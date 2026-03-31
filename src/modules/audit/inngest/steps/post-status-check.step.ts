/**
 * Step 7 del workflow: publicación del status check en el commit.
 * Bloquea merge si hay issues críticos, marca pending si hay warnings.
 */
import type { IAuditCommit, IEnrichedIssue } from '../../types'
import { getAuditById } from '../../queries/audit.queries'
import { postAuditStatus } from '../workflow-steps.utils'

import { parseRepoUrl } from './parse-diff.step'

/**
 * Publica el status check en el commit del PR según la severidad de los issues.
 * @param auditId - ID de la auditoría
 */
export async function runPostStatusCheck(auditId: string): Promise<void> {
  const auditRecord = await getAuditById(auditId)
  if (!auditRecord) return

  const issues = (auditRecord.issues ?? []) as IEnrichedIssue[]
  const { owner, repo } = parseRepoUrl(auditRecord.repoUrl)
  const commits = (auditRecord.commits ?? []) as IAuditCommit[]
  const commitSha = commits[0]?.sha ?? ''
  if (!commitSha) return

  await postAuditStatus({ owner, repo, commitSha, issues })
}
