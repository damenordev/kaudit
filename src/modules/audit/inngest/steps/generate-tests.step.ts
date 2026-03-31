/**
 * Step 5 del workflow: generación de tests unitarios automáticos.
 * Solo se ejecuta si no hay issues críticos.
 */
import type { IChangedFile, IGeneratedTest, IValidationIssue } from '../../types'
import { getAuditById, updateAuditStatus } from '../../queries/audit.queries'
import { generateTestsForAudit } from '../../services/test-generation.service'

/**
 * Genera tests unitarios para los archivos modificados usando IA.
 * @param auditId - ID de la auditoría
 * @param issues - Issues de validación para contexto
 * @returns Lista de tests generados
 */
export async function runGenerateTests(auditId: string, issues: IValidationIssue[]): Promise<IGeneratedTest[]> {
  const auditRecord = await getAuditById(auditId)
  if (!auditRecord) return []

  const files = (auditRecord.changedFiles ?? []) as IChangedFile[]
  const tests = await generateTestsForAudit(files, issues)

  if (tests.length > 0) {
    await updateAuditStatus(auditId, 'generating', { generatedTests: tests })
  }

  return tests
}
