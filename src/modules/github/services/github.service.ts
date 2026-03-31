import 'server-only'

import type { IGitHubPrOptions, IGitHubPrResult } from '../types'
import { getGitHubClient, isGitHubAvailable } from '../lib/github-client'

/**
 * Crea un Pull Request en GitHub.
 * @param options - Opciones del PR (owner, repo, title, head, base, body)
 * @returns Resultado con número y URL del PR
 * @throws Error si GitHub no está configurado o la API falla
 */
export async function createPullRequest(options: IGitHubPrOptions): Promise<IGitHubPrResult> {
  const octokit = getGitHubClient()

  if (!octokit) {
    throw new Error('GitHub client no disponible. Configura GITHUB_TOKEN en las variables de entorno.')
  }

  const response = await octokit.rest.pulls.create({
    owner: options.owner,
    repo: options.repo,
    title: options.title,
    head: options.head,
    base: options.base,
    body: options.body,
  })

  return {
    prNumber: response.data.number,
    prUrl: response.data.html_url,
    created: new Date(response.data.created_at),
  }
}

/**
 * Añade un comentario a un Pull Request existente.
 * @param owner - Propietario del repositorio
 * @param repo - Nombre del repositorio
 * @param prNumber - Número del PR
 * @param body - Contenido del comentario en Markdown
 * @throws Error si GitHub no está configurado o la API falla
 */
export async function addPrComment(owner: string, repo: string, prNumber: number, body: string): Promise<void> {
  const octokit = getGitHubClient()

  if (!octokit) {
    throw new Error('GitHub client no disponible. Configura GITHUB_TOKEN en las variables de entorno.')
  }

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body,
  })
}

/**
 * Obtiene información de un repositorio.
 * @param owner - Propietario del repositorio
 * @param repo - Nombre del repositorio
 * @returns Información del repositorio o null si no existe
 */
export async function getRepository(
  owner: string,
  repo: string
): Promise<{ defaultBranch: string; isPrivate: boolean } | null> {
  const octokit = getGitHubClient()

  if (!octokit) return null

  try {
    const response = await octokit.rest.repos.get({ owner, repo })

    return {
      defaultBranch: response.data.default_branch,
      isPrivate: response.data.private,
    }
  } catch {
    return null
  }
}

export { isGitHubAvailable }
