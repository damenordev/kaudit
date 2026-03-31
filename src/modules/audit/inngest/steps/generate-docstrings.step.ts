/**
 * Step 4 del workflow: generación de docstrings para funciones sin documentar.
 * Solo se ejecuta si no hay issues críticos.
 */
import type { IChangedFile, IDocstringResult } from '../../types'
import { getAuditById, updateAuditStatus } from '../../queries/audit.queries'
import { generateDocstrings } from '../../services/docstring-generation.service'

/**
 * Genera docstrings JSDoc para funciones sin documentar en los archivos modificados.
 * @param auditId - ID de la auditoría
 * @returns Lista de docstrings generados
 */
export async function runGenerateDocstrings(auditId: string): Promise<IDocstringResult[]> {
  const auditRecord = await getAuditById(auditId)
  if (!auditRecord) return []

  const files = (auditRecord.changedFiles ?? []) as IChangedFile[]
  const supportedFiles = files.filter(
    f => f.language === 'TypeScript' || f.language === 'JavaScript' || f.language === 'ts' || f.language === 'js'
  )

  // Procesar archivos en paralelo con límite de concurrencia
  const allDocstrings = await Promise.all(supportedFiles.map(f => generateDocstrings(f)))
  const flattened = allDocstrings.flat()

  if (flattened.length > 0) {
    await updateAuditStatus(auditId, 'generating', { docstrings: flattened })
  }

  return flattened
}
