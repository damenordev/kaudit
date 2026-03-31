/**
 * Step 3 del workflow: generación de contenido (descripción del PR).
 * Solo se ejecuta si no hay issues críticos.
 */
import { NonRetriableError } from 'inngest'

import type { IGeneratedContent, IValidationResult } from '../../types'
import { getAuditById, updateAuditStatus } from '../../queries/audit.queries'
import { generatePrDescription } from '../../services/generation.service'

/**
 * Genera la descripción del PR usando IA.
 * @param auditId - ID de la auditoría
 * @param validationResult - Resultado de la validación de seguridad
 * @returns Contenido generado o null si no se pudo generar
 */
export async function runGenerateContent(
  auditId: string,
  validationResult: IValidationResult
): Promise<IGeneratedContent | null> {
  await updateAuditStatus(auditId, 'generating')
  const auditRecord = await getAuditById(auditId)
  if (!auditRecord?.gitDiff) throw new NonRetriableError('No se encontró git diff')
  return generatePrDescription(auditRecord.gitDiff, validationResult)
}
