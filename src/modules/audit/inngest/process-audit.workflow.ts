/**
 * Workflow de Inngest para procesar auditorías.
 * Orquesta los pasos de validación y generación de contenido.
 * NOTA: La creación del PR se hace en el CLI DESPUÉS del push para evitar race conditions.
 */
import { NonRetriableError } from 'inngest'

import { inngest } from '@/core/lib/inngest/client'

import type { IValidationIssue } from '../types'
import { getAuditById, updateAuditStatus } from '../queries/audit.queries'
import { generatePrDescription } from '../services/generation.service'
import { validateGitDiff } from '../services/validation.service'

/**
 * Workflow principal para procesar una auditoría.
 * Solo valida y genera contenido. El PR se crea en el CLI después del push.
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
    const validationResult = await step.run('validate-security', async () => {
      await updateAuditStatus(auditId, 'validating')

      const auditRecord = await getAuditById(auditId)
      if (!auditRecord?.gitDiff) {
        throw new NonRetriableError('No se encontró git diff para la auditoría')
      }

      return validateGitDiff(auditRecord.gitDiff)
    })

    // Verificar problemas críticos
    const hasCriticalIssues = validationResult.issues.some((i: IValidationIssue) => i.severity === 'critical')
    if (hasCriticalIssues) {
      await updateAuditStatus(auditId, 'blocked', { validationResult })
      const criticalMessages = validationResult.issues
        .filter((i: IValidationIssue) => i.severity === 'critical')
        .map((i: IValidationIssue) => i.message)
        .join(', ')
      throw new NonRetriableError(`Problemas críticos: ${criticalMessages}`)
    }

    // Paso 2: Generación de contenido
    const content = await step.run('generate-content', async () => {
      await updateAuditStatus(auditId, 'generating')

      const auditRecord = await getAuditById(auditId)
      if (!auditRecord?.gitDiff) {
        throw new NonRetriableError('No se encontró git diff')
      }

      return generatePrDescription(auditRecord.gitDiff, validationResult)
    })

    // Guardar contenido generado y marcar como completado
    // El PR se creará en el CLI después del push
    await updateAuditStatus(auditId, 'completed', {
      generatedContent: content,
      validationResult,
    })

    return {
      success: true,
      prUrl: null,
      prNumber: null,
      message: 'Auditoría completada. El PR se creará después del push.',
    }
  }
)
