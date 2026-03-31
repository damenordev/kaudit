/**
 * Step 6 del workflow: publicación de comentarios en el PR.
 * Comenta issues inline y publica un resumen general.
 */
import type { IAuditCommit, IEnrichedIssue } from '../../types'
import { getAuditById } from '../../queries/audit.queries'
import { postPrComments } from '../workflow-steps.utils'

import { parseRepoUrl } from './parse-diff.step'

/**
 * Publica comentarios inline y resumen en el PR asociado a la auditoría.
 * Si no hay PR o no hay issues comentables, no hace nada.
 * @param auditId - ID de la auditoría
 */
export async function runPostPrComments(auditId: string): Promise<void> {
  const auditRecord = await getAuditById(auditId)
  if (!auditRecord) return

  const issues = (auditRecord.issues ?? []) as IEnrichedIssue[]
  if (issues.length === 0) return

  const { owner, repo } = parseRepoUrl(auditRecord.repoUrl)
  const commits = (auditRecord.commits ?? []) as IAuditCommit[]
  const commitSha = commits[0]?.sha ?? ''

  await postPrComments({
    owner,
    repo,
    prUrl: auditRecord.prUrl,
    issues,
    commitSha,
    summary: auditRecord.generatedContent?.summary ?? undefined,
  })
}
