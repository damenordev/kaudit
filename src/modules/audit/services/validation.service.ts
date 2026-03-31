/**
 * Servicio de validación de código con IA.
 * Analiza git diffs para detectar problemas de seguridad.
 * Usa chunking para diffs grandes: divide en chunks, valida cada uno y mergea.
 */
import 'server-only'

import { chunkDiffForModel } from '../lib/chunk-diff.utils'
import { validateChunks } from '../lib/validate-chunks.utils'
import type { IValidationResult } from '../types'

/**
 * Valida un git diff buscando problemas de seguridad.
 * Divide el diff en chunks si excede el contexto del modelo,
 * garantizando que todos los archivos sean auditados.
 *
 * @param gitDiff - El diff del código a validar
 * @returns Resultado de la validación con issues detectados
 */
export async function validateGitDiff(gitDiff: string): Promise<IValidationResult> {
  // Caso edge: diff vacío
  if (!gitDiff || gitDiff.trim().length === 0) {
    return { isValid: true, issues: [], analyzedAt: new Date() }
  }

  // Dividir diff en chunks (si es necesario) y validar todos
  const chunks = chunkDiffForModel(gitDiff)
  return validateChunks(chunks)
}

/**
 * Determina si un resultado de validación tiene problemas críticos.
 */
export function hasCriticalIssues(result: IValidationResult): boolean {
  return result.issues.some(issue => issue.severity === 'critical' || issue.severity === 'high')
}

/**
 * Filtra issues por severidad mínima.
 */
export function filterIssuesBySeverity(
  result: IValidationResult,
  minSeverity: 'critical' | 'high' | 'medium' | 'low'
): IValidationResult['issues'] {
  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
  const minLevel = severityOrder[minSeverity]

  return result.issues.filter(issue => severityOrder[issue.severity] >= minLevel)
}
