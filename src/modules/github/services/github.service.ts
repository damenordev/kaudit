import 'server-only'

import type { IGitHubPrOptions, IGitHubPrResult } from '../types'
import { getGitHubClient, isGitHubAvailable } from '../lib/github-client'

/** Tipo alias para el cliente Octokit disponible */
type AvailableOctokit = NonNullable<ReturnType<typeof getGitHubClient>>

/**
 * Busca un PR existente abierto para owner/repo/head.
 * Usa pulls.list con state=open para encontrar duplicados.
 */
async function findExistingOpenPr(
  octokit: AvailableOctokit,
  owner: string,
  repo: string,
  head: string
): Promise<{ number: number; html_url: string; created_at: string } | null> {
  const pulls = await octokit.rest.pulls.list({
    owner,
    repo,
    head: `${owner}:${head}`,
    state: 'open',
  })
  const existing = pulls.data[0]
  if (!existing) return null
  return { number: existing.number, html_url: existing.html_url, created_at: existing.created_at }
}

/** Actualiza un PR existente con nuevo título y cuerpo. */
async function updateExistingPr(
  octokit: AvailableOctokit,
  owner: string,
  repo: string,
  prNumber: number,
  title: string,
  body: string
): Promise<void> {
  await octokit.rest.pulls.update({ owner, repo, pull_number: prNumber, title, body })
}

/**
 * Crea un Pull Request en GitHub.
 * Si ya existe un PR abierto para la misma branch, lo actualiza en lugar de fallar.
 * @returns Resultado con número, URL del PR y flag `updated` si era duplicado
 */
export async function createPullRequest(options: IGitHubPrOptions): Promise<IGitHubPrResult> {
  const octokit = getGitHubClient()
  if (!octokit) {
    throw new Error('GitHub client no disponible. Configura GITHUB_TOKEN en las variables de entorno.')
  }

  try {
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
  } catch (error: unknown) {
    // Verificar si es el error de "PR ya existe" (HTTP 422)
    const isDuplicate =
      error instanceof Error &&
      'status' in error &&
      (error as { status: number }).status === 422 &&
      error.message.includes('pull request already exists')

    if (!isDuplicate) throw error

    // Buscar el PR existente y actualizarlo con los nuevos datos de auditoría
    const existing = await findExistingOpenPr(octokit, options.owner, options.repo, options.head)
    if (!existing) {
      throw new Error('PR duplicado detectado pero no se pudo encontrar el PR existente')
    }
    await updateExistingPr(octokit, options.owner, options.repo, existing.number, options.title, options.body)
    return {
      prNumber: existing.number,
      prUrl: existing.html_url,
      created: new Date(existing.created_at),
      updated: true,
    }
  }
}

/** Añade un comentario a un Pull Request existente. */
export async function addPrComment(owner: string, repo: string, prNumber: number, body: string): Promise<void> {
  const octokit = getGitHubClient()
  if (!octokit) {
    throw new Error('GitHub client no disponible. Configura GITHUB_TOKEN en las variables de entorno.')
  }
  await octokit.rest.issues.createComment({ owner, repo, issue_number: prNumber, body })
}

/**
 * Obtiene información de un repositorio.
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
