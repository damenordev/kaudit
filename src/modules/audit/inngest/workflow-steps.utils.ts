/**
 * Funciones auxiliares para los steps del workflow de auditoría.
 * Encapsula la lógica de PR comments y status checks.
 */
import { createCommitStatus } from '@/modules/github/services/status-checks.service'
import { postInlineReviewComments, postReviewSummary } from '@/modules/github/services/pr-comments.service'

import type { IEnrichedIssue } from '../types'

/** Cuenta issues agrupados por severidad */
export function countBySeverity(issues: IEnrichedIssue[]) {
  return {
    critical: issues.filter(i => i.severity === 'critical').length,
    error: issues.filter(i => i.severity === 'error').length,
    warning: issues.filter(i => i.severity === 'warning').length,
    info: issues.filter(i => i.severity === 'info').length,
  }
}

/** Verifica si hay issues críticos o de severidad alta */
export function hasBlockerIssues(issues: IEnrichedIssue[]): boolean {
  return issues.some(i => i.severity === 'critical')
}

/** Parsea una URL de PR para extraer owner, repo y número */
export function parsePrUrl(
  prUrl: string | null | undefined
): { owner: string; repo: string; pullNumber: number } | null {
  if (!prUrl) return null
  const match = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
  if (!match) return null
  return { owner: match[1] ?? '', repo: match[2] ?? '', pullNumber: Number(match[3]) }
}

/**
 * Publica comentarios inline y resumen en el PR asociado a la auditoría.
 * Si no hay PR o no hay issues comentables, no hace nada.
 */
export async function postPrComments(params: {
  owner: string
  repo: string
  prUrl: string | null | undefined
  issues: IEnrichedIssue[]
  commitSha: string
  summary?: string
  dashboardUrl?: string
}): Promise<void> {
  const prInfo = parsePrUrl(params.prUrl)
  if (!prInfo) {
    console.log('[workflow] Sin PR asociado, saltando comentarios')
    return
  }

  const counts = countBySeverity(params.issues)
  const commentableIssues = params.issues.filter(i => i.file && i.line > 0)

  if (commentableIssues.length > 0) {
    await postInlineReviewComments({
      owner: params.owner,
      repo: params.repo,
      pullNumber: prInfo.pullNumber,
      issues: commentableIssues,
      commitSha: params.commitSha,
    })
  }

  await postReviewSummary({
    owner: params.owner,
    repo: params.repo,
    pullNumber: prInfo.pullNumber,
    totalIssues: params.issues.length,
    criticalCount: counts.critical,
    errorCount: counts.error,
    warningCount: counts.warning,
    infoCount: counts.info,
    summary: params.summary,
    dashboardUrl: params.dashboardUrl,
  })
}

/**
 * Publica el status check en el commit según la severidad de los issues.
 * - critical → failure (bloquea merge con branch protection)
 * - warnings/errors → pending
 * - limpio → success
 */
export async function postAuditStatus(params: {
  owner: string
  repo: string
  commitSha: string
  issues: IEnrichedIssue[]
  targetUrl?: string
}): Promise<void> {
  const { critical, error, warning } = countBySeverity(params.issues)

  const state = critical > 0 ? ('failure' as const) : error + warning > 0 ? ('pending' as const) : ('success' as const)

  const description =
    state === 'failure'
      ? `Bloqueado: ${critical} issue(s) crítico(s) encontrado(s)`
      : state === 'pending'
        ? `Revisar: ${error} error(es), ${warning} warning(s)`
        : 'Auditoría completada sin problemas'

  await createCommitStatus({
    owner: params.owner,
    repo: params.repo,
    commitSha: params.commitSha,
    state,
    description,
    targetUrl: params.targetUrl,
  })
}
