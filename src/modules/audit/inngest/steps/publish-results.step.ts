/**
 * Step 4 del workflow: publicación de resultados.
 * Combina PR comments y status check en un solo step para reducir latencia.
 */
import type { IAuditCommit, IEnrichedIssue } from '../../types'
import { getAuditById } from '../../queries/audit.queries'
import { postPrComments, postAuditStatus } from '../workflow-steps.utils'
import { parseRepoUrl } from './parse-diff.step'

/** Opciones para el step de publicación */
export interface IPublishOptions {
  skipPRComments?: boolean
}

/**
 * Publica comentarios en el PR y status check en el commit.
 * Ambas operaciones se ejecutan en paralelo.
 */
export async function runPublishResults(auditId: string, options?: IPublishOptions): Promise<void> {
  const auditRecord = await getAuditById(auditId)
  if (!auditRecord) return

  const issues = (auditRecord.issues ?? []) as IEnrichedIssue[]
  const { owner, repo } = parseRepoUrl(auditRecord.repoUrl)
  const commits = (auditRecord.commits ?? []) as IAuditCommit[]
  const commitSha = commits[0]?.sha ?? ''

  // Comentarios y status check en paralelo (salto condicional por options)
  const tasks: Promise<void>[] = []
  if (!options?.skipPRComments) {
    tasks.push(
      postPrComments({
        owner,
        repo,
        prUrl: auditRecord.prUrl,
        issues,
        commitSha,
        summary: auditRecord.generatedContent?.summary ?? undefined,
      })
    )
  }
  if (commitSha) {
    tasks.push(postAuditStatus({ owner, repo, commitSha, issues }))
  }
  await Promise.all(tasks)
}
