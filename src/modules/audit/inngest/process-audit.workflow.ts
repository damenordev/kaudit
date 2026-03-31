/**
 * Workflow de Inngest para procesar auditorías.
 * 4 steps: validate → parse-and-enrich → generate-all → publish-results.
 * La generación usa Promise.allSettled para aislar fallos individuales.
 */
import type { IDocstringResult, IGeneratedTest, IValidationIssue } from '../types'

import { inngest } from '@/core/lib/inngest/client'

import type { IAuditOptions } from '@/core/lib/inngest/client'

import { getFriendlyErrorMessage } from '../lib/error-messages.utils'
import { updateAuditStatus } from '../queries/audit.queries'
import { runGenerateAll } from './steps/generate-all.step'
import { runParseDiffAndCommits } from './steps/parse-diff.step'
import { runPublishResults } from './steps/publish-results.step'
import { runValidateSecurity } from './steps/validate-security.step'

/** Resultado de un step: éxito con datos o fallo capturado */
type TStepResult<T> = { ok: true; data: T } | { ok: false }

/**
 * Workflow principal para procesar una auditoría.
 * Paso 1: validación de seguridad
 * Paso 2: parseo del diff y enriquecimiento
 * Paso 3: generación paralela (PR desc + docstrings + tests)
 * Paso 4: publicación de resultados (PR comments + status check)
 */
export const processAudit = inngest.createFunction(
  {
    id: 'process-audit',
    name: 'Process Audit',
    retries: 3,
    triggers: [{ event: 'audit/created' }],
    onFailure: async ({ event, error }) => {
      const originalData = event.data as unknown as { auditId?: string }
      const auditId = originalData.auditId
      if (!auditId) return

      // Red de seguridad: captura errores no manejados por runStep
      console.error(`[audit:${auditId}] Error no capturado en workflow:`, error)
      const friendlyMsg = getFriendlyErrorMessage(error)
      try {
        await updateAuditStatus(auditId, 'failed', { errorMessage: friendlyMsg })
      } catch (updateError) {
        console.error(`[audit:${auditId}] Error al marcar como fallida:`, updateError)
      }
    },
  },
  async ({ event, step }) => {
    const auditId = event.data.auditId as string
    const options: IAuditOptions = (event.data.options ?? {}) as IAuditOptions

    // Ejecuta un step con manejo de errores y mensaje amigable
    async function runStep<T>(name: string, fn: () => Promise<T>): Promise<TStepResult<Awaited<T>>> {
      try {
        const data = (await step.run(name, fn)) as Awaited<T>
        return { ok: true, data }
      } catch (error) {
        const friendlyMsg = getFriendlyErrorMessage(error)
        console.error(`[audit:${auditId}] Step "${name}" falló:`, error)
        await step.run(`mark-failed-${name}`, async () => {
          await updateAuditStatus(auditId, 'failed', { errorMessage: friendlyMsg })
        })
        return { ok: false }
      }
    }

    // --- STEP 1: Validación de seguridad ---
    const s1 = await runStep('validate-security', () => runValidateSecurity(auditId))
    if (!s1.ok) return { success: false, message: 'Auditoría fallida.' }
    const validationResult = s1.data

    const issues = validationResult.issues as IValidationIssue[]
    const isBlocked = issues.some((v: IValidationIssue) => v.severity === 'critical')

    // --- STEP 2: Parseo del diff y enriquecimiento ---
    const s2 = await runStep('parse-and-enrich', () => runParseDiffAndCommits(auditId, issues))
    if (!s2.ok) return { success: false, message: 'Auditoría fallida.' }

    // --- STEP 3: Generaciones en paralelo (solo si no hay críticos) ---
    let content = null
    let docstringResults: IDocstringResult[] = []
    let generatedTests: IGeneratedTest[] = []
    let prDescriptionFailed = false

    if (!isBlocked) {
      const s3 = await runStep('generate-all', () => runGenerateAll(auditId, validationResult, options))
      if (s3.ok) {
        content = s3.data.content
        docstringResults = s3.data.docstringResults
        generatedTests = s3.data.generatedTests
        prDescriptionFailed = s3.data.prDescriptionFailed
      }
    }

    // PR description es esencial — si falló, marcar auditoría como fallida
    if (prDescriptionFailed) {
      await step.run('mark-pr-desc-failed', async () => {
        await updateAuditStatus(auditId, 'failed', {
          errorMessage: 'Error generando descripción del PR',
        })
      })
      return { success: false, message: 'Error generando descripción del PR.' }
    }

    // --- STEP 4: Publicar resultados (comentarios + status check) ---
    const s4 = await runStep('publish-results', () => runPublishResults(auditId, options))
    if (!s4.ok) return { success: false, message: 'Auditoría fallida.' }

    // Estado final: blocked si hay críticos, completed si todo OK
    if (isBlocked) {
      await updateAuditStatus(auditId, 'blocked', { validationResult })
      return { success: false, message: 'Auditoría bloqueada por issues críticos.' }
    }

    await updateAuditStatus(auditId, 'completed', {
      generatedContent: content ?? undefined,
      docstrings: docstringResults as unknown as IDocstringResult[],
      generatedTests: (generatedTests.length > 0 ? generatedTests : undefined) as unknown as
        | IGeneratedTest[]
        | undefined,
      validationResult,
    })
    return { success: true, prUrl: null, prNumber: null, message: 'Auditoría completada.' }
  }
)
