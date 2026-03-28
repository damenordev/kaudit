/**
 * Tipos para el CLI de GitHub Auditor.
 * Define interfaces para opciones, configuración y respuestas.
 */

// Opciones del comando CLI
export interface ICliOptions {
  /** Rama base para el diff (default: main) */
  base?: string
  /** URL base de la API (default: https://kaudit.vercel.app) */
  url?: string
  /** Timeout máximo de polling en ms (default: 300000 = 5 min) */
  timeout?: number
  /** Deshabilitar colores para CI */
  noColor?: boolean
  /** Usar cambios staged en lugar de commits */
  staged?: boolean
  /** URL del repositorio (para repos sin remote) */
  repo?: string
  /** Push automático después de auditoría exitosa (default: true) */
  push?: boolean
}

// Configuración interna del CLI
export interface ICliConfig {
  /** URL base de la API */
  apiUrl: string
  /** Rama base para comparar */
  targetBranch: string
  /** Tiempo máximo de polling en ms */
  maxPollTime: number
  /** Intervalo de polling en ms */
  pollInterval: number
  /** Tamaño máximo del diff en bytes */
  maxDiffSize: number
}

// Estados posibles de una auditoría
export type TCliStatus = 'pending' | 'processing' | 'validating' | 'generating' | 'completed' | 'failed' | 'blocked'

// Información del repositorio git
export interface IGitInfo {
  /** Si el directorio actual es un repo git */
  isRepo: boolean
  /** Nombre de la rama actual */
  branchName: string
  /** URL del remote origin */
  repoUrl: string
  /** Diff contra la rama base */
  gitDiff: string
}

// Request para iniciar auditoría
export interface IAuditStartRequest {
  repoUrl: string
  branchName: string
  targetBranch: string
  gitDiff: string
}

// Response del endpoint de inicio
export interface IAuditStartResponse {
  auditId: string
  status: string
}

// Response del endpoint de status
export interface IAuditStatusResponse {
  id: string
  status: TCliStatus
  repoUrl: string
  branchName: string
  targetBranch: string
  validationResult?: {
    isValid: boolean
    issues: Array<{
      type: string
      severity: 'error' | 'warning' | 'info'
      message: string
      file?: string
      line?: number
    }>
    summary: string
  }
  generatedContent?: {
    prTitle: string
    prBody: string
    commitMessage: string
    suggestedChanges?: string
  }
  prUrl?: string
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

// Callback para polling de status
export type TStatusCallback = (status: IAuditStatusResponse) => void

// Configuración por defecto del CLI
export const DEFAULT_CLI_CONFIG: ICliConfig = {
  apiUrl: 'https://kaudit.vercel.app',
  targetBranch: 'main',
  maxPollTime: 300000, // 5 minutos
  pollInterval: 2000, // 2 segundos
  maxDiffSize: 1000000, // 1MB
}
