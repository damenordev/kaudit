/**
 * Tipos para la integración con GitHub API.
 * Define las opciones y resultados para operaciones de PR.
 */

import type { IEnrichedIssue } from '@/modules/audit/types'

// Interface para las opciones de creación de un Pull Request
export interface IGitHubPrOptions {
  /** Propietario del repositorio (owner) */
  owner: string
  /** Nombre del repositorio */
  repo: string
  /** Título del Pull Request */
  title: string
  /** Branch origen (head) */
  head: string
  /** Branch destino (base) */
  base: string
  /** Cuerpo/descripción del Pull Request */
  body: string
}

// Interface para el resultado de crear un Pull Request
export interface IGitHubPrResult {
  /** Número del PR creado */
  prNumber: number
  /** URL del PR creado */
  prUrl: string
  /** Fecha de creación */
  created: Date
  /** Indica si se actualizó un PR existente en lugar de crear uno nuevo */
  updated?: boolean
}

/** Parámetros para publicar comentarios inline en un PR */
export interface IPostInlineCommentsParams {
  owner: string
  repo: string
  pullNumber: number
  issues: IEnrichedIssue[]
  commitSha: string
}

/** Parámetros para publicar el resumen de auditoría en un PR */
export interface IPostReviewSummaryParams {
  owner: string
  repo: string
  pullNumber: number
  totalIssues: number
  criticalCount: number
  errorCount: number
  warningCount: number
  infoCount: number
  summary?: string
  dashboardUrl?: string
}

/** Parámetros para crear un status check en un commit */
export interface ICreateCommitStatusParams {
  owner: string
  repo: string
  commitSha: string
  state: 'success' | 'failure' | 'pending'
  description: string
  targetUrl?: string
}

/** Resultado de parsear una URL de PR de GitHub */
export interface IParsedPrInfo {
  owner: string
  repo: string
  pullNumber: number
}
