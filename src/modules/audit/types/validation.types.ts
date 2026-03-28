/**
 * Tipos para el sistema de validación de código.
 * Define severidades, tipos de issues y resultados de validación.
 */

// Información de uso de tokens de IA
export interface ITokenUsage {
  /** Tokens de entrada (prompt) */
  inputTokens: number
  /** Tokens de salida (respuesta) */
  outputTokens: number
  /** Total de tokens */
  totalTokens: number
}

// Niveles de severidad para los issues detectados
export type TValidationSeverity = 'critical' | 'high' | 'medium' | 'low'

// Tipos de problemas de seguridad que puede detectar el validador
export type TValidationIssueType = 'API_KEY' | 'SQL_INJECTION' | 'XSS' | 'SECRET' | 'DANGEROUS_LOGIC'

// Interface para un issue individual detectado en el código
export interface IValidationIssue {
  /** Tipo de problema detectado */
  type: TValidationIssueType
  /** Nivel de severidad del problema */
  severity: TValidationSeverity
  /** Número de línea donde se encontró el problema */
  line: number
  /** Descripción del problema */
  message: string
  /** Sugerencia para corregir el problema */
  suggestion: string
}

// Interface para el resultado completo de una validación
export interface IValidationResult {
  /** Indica si el código pasó la validación sin problemas críticos */
  isValid: boolean
  /** Lista de issues detectados */
  issues: IValidationIssue[]
  /** Timestamp de cuando se realizó el análisis (Date en runtime, string cuando se serializa) */
  analyzedAt: Date | string
  /** Uso de tokens de la llamada a IA (opcional) */
  tokenUsage?: ITokenUsage
}
