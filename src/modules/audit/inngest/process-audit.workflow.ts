/**
 * Workflow de Inngest para procesar auditorías.
 * Orquesta los pasos delegando en handlers del directorio steps/.
 */
import type { IDocstringResult, IGeneratedTest, IValidationIssue } from '../types'
import { inngest } from '@/core/lib/inngest/client'

import { updateAuditStatus } from '../queries/audit.queries'
import { runValidateSecurity } from './steps/validate-security.step'
import { runParseDiffAndCommits } from './steps/parse-diff.step'
import { runGenerateContent } from './steps/generate-content.step'
import { runGenerateDocstrings } from './steps/generate-docstrings.step'
import { runGenerateTests } from './steps/generate-tests.step'
import { runPostPrComments } from './steps/post-pr-comments.step'
import { runPostStatusCheck } from './steps/post-status-check.step'

/**
 * Workflow principal para procesar una auditoría.
 * Valida, genera contenido, comenta en PR y publica status check.
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

      const errorMessage = typeof error === 'string' ? error : error.message
      const isBlocked = errorMessage.includes('críticos') || errorMessage.includes('critical')
      const status = isBlocked ? 'blocked' : 'failed'

      await updateAuditStatus(auditId, status, { errorMessage })
    },
  },
  async ({ event, step }) => {
    const auditId = event.data.auditId as string

    // Paso 1: Validación de seguridad
    const validationResult = await step.run('validate-security', () => runValidateSecurity(auditId))

    // Paso 2: Parsear diff, obtener commits y enriquecer issues
    await step.run('parse-diff-and-commits', () =>
      runParseDiffAndCommits(auditId, validationResult.issues as IValidationIssue[])
    )

    // Determinar si hay issues críticos para condicionar steps posteriores
    const isBlocked = (validationResult.issues as IValidationIssue[]).some(
      (v: IValidationIssue) => v.severity === 'critical'
    )

    // Paso 3: Generación de contenido (solo si no hay issues críticos)
    let content = null
    if (!isBlocked) {
      content = await step.run('generate-content', () => runGenerateContent(auditId, validationResult))
    }

    // Paso 4: Generación de docstrings (solo si no hay críticos)
    let docstringResults: IDocstringResult[] = []
    if (!isBlocked) {
      docstringResults = await step.run('generate-docstrings', () => runGenerateDocstrings(auditId))
    }

    // Paso 5: Generación de tests unitarios (solo si no hay críticos)
    let generatedTests: IGeneratedTest[] = []
    if (!isBlocked) {
      generatedTests = await step.run('generate-tests', () =>
        runGenerateTests(auditId, validationResult.issues as IValidationIssue[])
      )
    }

    // Paso 6: Publicar comentarios en el PR
    await step.run('post-pr-comments', () => runPostPrComments(auditId))

    // Paso 7: Status check en el commit
    await step.run('post-status-check', () => runPostStatusCheck(auditId))

    // Estado final: blocked si hay críticos, completed si todo OK
    if (isBlocked) {
      await updateAuditStatus(auditId, 'blocked', { validationResult })
      return { success: false, message: 'Auditoría bloqueada por issues críticos.' }
    }

    await updateAuditStatus(auditId, 'completed', {
      generatedContent: content ?? undefined,
      docstrings: docstringResults,
      generatedTests: generatedTests.length > 0 ? generatedTests : undefined,
      validationResult,
    })
    return { success: true, prUrl: null, prNumber: null, message: 'Auditoría completada.' }
  }
)
