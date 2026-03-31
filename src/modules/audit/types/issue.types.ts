/**
 * Tipos para el sistema de issues enriquecidos.
 * Define issues con contexto de commit y sugerencias de fix.
 */

/** Tipos de issues que pueden detectarse */
export type TIssueType = 'security' | 'style' | 'logic' | 'performance' | 'best-practice'

/** Niveles de severidad para los issues */
export type TIssueSeverity = 'critical' | 'error' | 'warning' | 'info'

/** Estados posibles de un issue */
export type TIssueStatus = 'open' | 'acknowledged' | 'resolved' | 'ignored'

/** Representa un issue enriquecido con contexto adicional */
export interface IEnrichedIssue {
  /** Identificador único del issue */
  id: string
  /** Tipo de issue detectado */
  type: TIssueType
  /** Nivel de severidad del issue */
  severity: TIssueSeverity
  /** Ruta del archivo donde se encontró el issue */
  file: string
  /** Número de línea donde se encontró el issue */
  line: number
  /** SHA del commit donde se originó el issue (opcional) */
  commitSha?: string
  /** Título corto del issue */
  title: string
  /** Descripción detallada del issue */
  message: string
  /** Fragmento de código donde se encontró el issue (opcional) */
  codeSnippet?: string
  /** Sugerencia para corregir el issue (opcional) */
  suggestedFix?: string
  /** Estado actual del issue */
  status: TIssueStatus
}
