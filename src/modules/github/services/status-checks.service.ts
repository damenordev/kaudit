/**
 * Servicio para crear status checks en commits de GitHub.
 * Usa la Statuses API para reportar el resultado de la auditoría.
 */
import 'server-only'

import { getGitHubClient } from '../lib/github-client'
import type { ICreateCommitStatusParams } from '../types'

const STATUS_CONTEXT = 'cube-audit/security'

/**
 * Crea un status check en un commit específico.
 * Usa el contexto "cube-audit/security" para identificar la auditoría.
 */
export async function createCommitStatus(params: ICreateCommitStatusParams): Promise<void> {
  const octokit = getGitHubClient()
  if (!octokit) return

  try {
    await octokit.rest.repos.createCommitStatus({
      owner: params.owner,
      repo: params.repo,
      sha: params.commitSha,
      state: params.state,
      description: params.description,
      target_url: params.targetUrl,
      context: STATUS_CONTEXT,
    })
  } catch (error) {
    console.error('[status-checks] Error creando status check:', error)
  }
}
