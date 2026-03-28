/**
 * Servicio para obtener commits entre dos referencias de un repositorio.
 * Implementa paginación manual y retry con backoff exponencial.
 */
import 'server-only'

import type { IAuditCommit } from '@/modules/audit/types'

import { Octokit } from 'octokit'

import { getGitHubClient } from '@/modules/github/lib/github-client'

// Configuración de retry
const MAX_RETRIES = 3
const INITIAL_BACKOFF_MS = 1000
const BACKOFF_MULTIPLIER = 2
// Límite máximo de commits a obtener
const MAX_COMMITS_LIMIT = 250

/**
 * Error personalizado para errores de rate limit de GitHub API.
 */
export class RateLimitError extends Error {
  public readonly resetAt: Date | null
  public readonly limit: number | undefined
  public readonly retryAfter: number | undefined

  constructor(resetAt: Date | string | null, limit?: number, retryAfter?: number, message?: string) {
    super(message ?? 'GitHub API rate limit exceeded')
    this.resetAt = resetAt instanceof Date ? resetAt : null
    this.limit = limit
    this.retryAfter = retryAfter
  }
}

/**
 * Verifica si un error de la API de GitHub indica rate limit.
 */
function isRateLimitError(error: unknown): boolean {
  const axiosError = error as { status?: number; data?: { message?: string } }
  if (axiosError.status === 403) {
    const message = axiosError.data?.message ?? ''
    return message.includes('rate limit') || message.includes('abuse')
  }
  return false
}

/**
 * Calcula el tiempo de espera antes del siguiente reintento.
 */
function calculateBackoff(retryCount: number): number {
  return INITIAL_BACKOFF_MS * Math.pow(BACKOFF_MULTIPLIER, retryCount)
}

/**
 * Espera un tiempo determinado en milisegundos.
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Función interna que ejecuta la petición con soporte para retry.
 */
async function fetchCommitsWithRetry(
  octokit: Octokit,
  owner: string,
  repo: string,
  base: string,
  head: string,
  limit: number,
  retryCount: number = 0
): Promise<IAuditCommit[]> {
  try {
    const response = await octokit.rest.repos.compareCommits({
      owner,
      repo,
      base,
      head,
      per_page: 100,
    })

    const commits: IAuditCommit[] = []
    const commitData = response.data as {
      commits?: Array<{
        sha: string
        commit: { message: string; author?: { date?: string }; committer?: { date?: string } }
        author?: { login?: string; email?: string; avatar_url?: string } | null
        committer?: { login?: string; email?: string; avatar_url?: string } | null
      }>
      files?: Array<{ filename: string }>
    }

    for (const commit of commitData.commits ?? []) {
      if (commits.length >= limit) break

      commits.push({
        sha: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.author?.login ?? commit.committer?.login ?? 'Unknown',
          email: commit.author?.email ?? commit.committer?.email ?? '',
          avatar: commit.author?.avatar_url ?? commit.committer?.avatar_url,
        },
        date: commit.commit.committer?.date ?? commit.commit.author?.date ?? '',
        files: commitData.files?.map(f => f.filename) ?? [],
      })
    }

    return commits
  } catch (error) {
    if (isRateLimitError(error) && retryCount < MAX_RETRIES) {
      const backoff = calculateBackoff(retryCount)
      await sleep(backoff)
      return fetchCommitsWithRetry(octokit, owner, repo, base, head, limit, retryCount + 1)
    }
    throw error
  }
}

/**
 * Obtiene los commits entre dos referencias de un repositorio.
 */
export async function fetchCommits(
  owner: string,
  repo: string,
  base: string,
  head: string,
  limit: number = MAX_COMMITS_LIMIT
): Promise<IAuditCommit[]> {
  const octokit = getGitHubClient()

  if (!octokit) {
    throw new Error('GitHub client no disponible. Configura GITHUB_TOKEN.')
  }

  return fetchCommitsWithRetry(octokit, owner, repo, base, head, limit)
}
