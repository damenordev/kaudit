/**
 * Servicio para enriquecer issues de validación con contexto de diff y commits.
 * Transforma IValidationIssue[] en IEnrichedIssue[] con datos adicionales.
 */
import type { IChangedFile } from '../types/diff.types'
import type { IEnrichedIssue, TIssueSeverity, TIssueType } from '../types/issue.types'
import type { IValidationIssue, TValidationSeverity } from '../types/validation.types'

/** Mapeo de severidad de validación a severidad de issue enriquecido */
const SEVERITY_MAP: Record<TValidationSeverity, TIssueSeverity> = {
  critical: 'critical',
  high: 'error',
  medium: 'warning',
  low: 'info',
}

/** Mapeo de tipo de validación a tipo de issue enriquecido */
const TYPE_MAP: Record<string, TIssueType> = {
  API_KEY: 'security',
  SECRET: 'security',
  SQL_INJECTION: 'security',
  XSS: 'security',
  CSRF: 'security',
  AUTH: 'security',
  INJECTION: 'security',
  PATH_TRAVERSAL: 'security',
  SSRF: 'security',
  SENSITIVE_DATA: 'security',
  MISCONFIGURATION: 'best-practice',
  DANGEROUS_LOGIC: 'logic',
}

/** Genera un título corto a partir del tipo y mensaje del issue */
function buildTitle(type: string, message: string): string {
  const prefix = type.replace(/_/g, ' ').toLowerCase()
  const maxMsgLen = 60
  const truncated = message.length > maxMsgLen ? `${message.slice(0, maxMsgLen)}...` : message
  return `[${prefix}] ${truncated}`
}

/** Extrae un snippet de código del diff alrededor de la línea indicada */
function extractCodeSnippet(file: IChangedFile, lineNumber: number): string | undefined {
  for (const hunk of file.hunks) {
    const hunkEnd = hunk.newStart + hunk.newLines
    if (lineNumber >= hunk.newStart && lineNumber <= hunkEnd) {
      return hunk.changes
        .filter(c => c.type !== 'del')
        .map(c => c.content)
        .join('\n')
    }
  }
  return undefined
}

/** Busca el archivoChangedFile cuya ruta mejor coincide con el contexto del issue */
function findMatchingFile(validationIssue: IValidationIssue, changedFiles: IChangedFile[]): IChangedFile | undefined {
  // Heurística: buscar la ruta del archivo en el mensaje del issue
  const msgLower = validationIssue.message.toLowerCase()
  return changedFiles.find(f => msgLower.includes(f.path.toLowerCase()))
}

/**
 * Transforma issues de validación en issues enriquecidos con contexto de diff y commits.
 * @param validationIssues - Issues detectados por el validador de IA
 * @param changedFiles - Archivos modificados extraídos del diff
 * @param commitShas - SHAs de commits asociados (se usa el primero como fallback)
 * @returns Lista de issues enriquecidos listos para almacenar
 */
export function enrichIssues(
  validationIssues: IValidationIssue[],
  changedFiles: IChangedFile[],
  commitShas: string[]
): IEnrichedIssue[] {
  const fallbackSha = commitShas[0] ?? ''

  return validationIssues.map((vi, index): IEnrichedIssue => {
    const matchedFile = findMatchingFile(vi, changedFiles)
    const file = matchedFile?.path ?? 'unknown'
    const commitSha = matchedFile?.commitSha ?? fallbackSha
    const codeSnippet = matchedFile ? extractCodeSnippet(matchedFile, vi.line) : undefined

    return {
      id: `issue-${index}-${Date.now()}`,
      type: TYPE_MAP[vi.type] ?? 'logic',
      severity: SEVERITY_MAP[vi.severity] ?? 'info',
      file,
      line: vi.line,
      commitSha,
      title: buildTitle(vi.type, vi.message),
      message: vi.message,
      codeSnippet,
      suggestedFix: vi.suggestion || undefined,
      status: 'open',
    }
  })
}
