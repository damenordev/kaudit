/**
 * Step 2 del workflow: parseo del diff, obtención de commits y enriquecimiento de issues.
 * Extrae archivos modificados, obtiene commits y enriquece los issues con contexto.
 */
import { NonRetriableError } from 'inngest'

import { fetchCommits } from '@/modules/github/services/commits.service'

import type { IAuditCommit, IChangedFile, IEnrichedIssue, IValidationIssue } from '../../types'
import { parseDiff } from '../../lib/parse-diff.utils'
import { getAuditById, updateAuditStatus } from '../../queries/audit.queries'
import { enrichIssues } from '../../services/enrich-issues.service'

/** Extrae owner y repo de una URL de GitHub */
function parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw new NonRetriableError(`URL de repo inválida: ${repoUrl}`)
  return { owner: match[1] ?? '', repo: (match[2] ?? '').replace(/\.git$/, '') }
}

/**
 * Parsea el diff, obtiene commits de GitHub y enriquece los issues.
 * @param auditId - ID de la auditoría
 * @param issues - Issues de validación del paso anterior
 */
export async function runParseDiffAndCommits(auditId: string, issues: IValidationIssue[]): Promise<void> {
  await updateAuditStatus(auditId, 'processing')
  const auditRecord = await getAuditById(auditId)
  if (!auditRecord?.gitDiff) throw new NonRetriableError('No se encontró git diff')

  const changedFiles = parseDiff(auditRecord.gitDiff)
  if (changedFiles.length === 0) {
    throw new NonRetriableError('El diff no contiene cambios parseables')
  }

  const { owner, repo } = parseRepoUrl(auditRecord.repoUrl)
  let commits: IAuditCommit[] = []
  try {
    const fetched = await fetchCommits(owner, repo, auditRecord.targetBranch, auditRecord.branchName)
    commits = Array.isArray(fetched) ? fetched : []
  } catch (err) {
    console.error(`[audit:${auditId}] Error obteniendo commits:`, err)
  }

  const commitShas = commits.map((c: IAuditCommit) => c.sha)
  const enrichedIssues = enrichIssues(issues, changedFiles, commitShas)
  await updateAuditStatus(auditId, 'processing', {
    changedFiles,
    commits,
    issues: enrichedIssues,
  })
}

/** Re-exporta parseRepoUrl para uso en otros steps */
export { parseRepoUrl }
