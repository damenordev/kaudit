/**
 * Servicio para publicar comentarios inline y resúmenes en PRs de GitHub.
 * Usa la Review Comments API para comentarios en líneas específicas.
 */
import 'server-only'

import type { IEnrichedIssue } from '@/modules/audit/types'

import { getGitHubClient } from '../lib/github-client'
import type { IPostInlineCommentsParams, IPostReviewSummaryParams } from '../types'

const SEVERITY_BADGE: Record<string, string> = {
  critical: '🔴 **CRITICAL**',
  error: '🟠 **ERROR**',
  warning: '🟡 **WARNING**',
  info: '🔵 **INFO**',
}

/** Formatea el cuerpo de un comentario inline para un issue */
function formatCommentBody(issue: IEnrichedIssue): string {
  const badge = SEVERITY_BADGE[issue.severity] ?? '⚪ **UNKNOWN**'
  let body = `${badge} — **${issue.title}**\n\n${issue.message}`
  if (issue.suggestedFix) {
    body += `\n\n**Sugerencia:**\n\`\`\`suggestion\n${issue.suggestedFix}\n\`\`\``
  }
  return body
}

/** Construye el cuerpo del comentario resumen con tabla de severidades */
function buildSummaryBody(params: IPostReviewSummaryParams): string {
  const table = [
    '| Severidad | Cantidad |',
    '|-----------|----------|',
    `| 🔴 Critical | ${params.criticalCount} |`,
    `| 🟠 Error | ${params.errorCount} |`,
    `| 🟡 Warning | ${params.warningCount} |`,
    `| 🔵 Info | ${params.infoCount} |`,
    `| **Total** | **${params.totalIssues}** |`,
  ].join('\n')

  let body = `## 🤖 Resumen de Auditoría\n\n${table}`
  if (params.summary) body += `\n\n${params.summary}`
  if (params.dashboardUrl) body += `\n\n📊 [Ver detalle en el dashboard](${params.dashboardUrl})`
  return body
}

/**
 * Publica comentarios inline en líneas específicas del PR.
 * Crea un review con comentarios agrupados por archivo.
 * Si el review falla, intenta comentarios individuales como fallback.
 */
export async function postInlineReviewComments(params: IPostInlineCommentsParams): Promise<void> {
  const octokit = getGitHubClient()
  if (!octokit) return

  const { owner, repo, pullNumber, issues, commitSha } = params
  const commentableIssues = issues.filter(i => i.file && i.line > 0)
  if (commentableIssues.length === 0) return

  try {
    await octokit.rest.pulls.createReview({
      owner,
      repo,
      pull_number: pullNumber,
      commit_id: commitSha,
      event: 'COMMENT',
      body: `Revisión: ${commentableIssues.length} issue(s) en ${new Set(commentableIssues.map(i => i.file)).size} archivo(s).`,
      comments: commentableIssues.map(issue => ({
        path: issue.file,
        line: issue.line,
        side: 'RIGHT' as const,
        body: formatCommentBody(issue),
      })),
    })
  } catch (reviewError) {
    console.error('[pr-comments] Review agrupado falló, intentando individualmente:', reviewError)
    await postIndividualComments(octokit, owner, repo, pullNumber, commitSha, commentableIssues)
  }
}

/** Fallback: publica comentarios inline uno por uno con manejo de errores individual */
async function postIndividualComments(
  octokit: ReturnType<typeof getGitHubClient> & object,
  owner: string,
  repo: string,
  pullNumber: number,
  commitSha: string,
  issues: IEnrichedIssue[]
): Promise<void> {
  for (const issue of issues) {
    try {
      await octokit.rest.pulls.createReviewComment({
        owner,
        repo,
        pull_number: pullNumber,
        body: formatCommentBody(issue),
        commit_id: commitSha,
        path: issue.file,
        line: issue.line,
        side: 'RIGHT',
      })
    } catch (commentError) {
      console.error(`[pr-comments] Error en ${issue.file}:${issue.line}:`, commentError)
    }
  }
}

/**
 * Publica un comentario resumen con la tabla de severidades de la auditoría.
 */
export async function postReviewSummary(params: IPostReviewSummaryParams): Promise<void> {
  const octokit = getGitHubClient()
  if (!octokit) return

  try {
    await octokit.rest.issues.createComment({
      owner: params.owner,
      repo: params.repo,
      issue_number: params.pullNumber,
      body: buildSummaryBody(params),
    })
  } catch (error) {
    console.error('[pr-comments] Error publicando resumen:', error)
  }
}
