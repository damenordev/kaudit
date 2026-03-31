/**
 * Tests para el servicio de obtención de commits.
 * Verifica la interacción con GitHub API y el manejo de errores.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock del módulo github-client
vi.mock('@/modules/github/lib/github-client', () => ({
  getGitHubClient: vi.fn(),
}))

// Mock de server-only
vi.mock('server-only', () => ({}))

// Importar después del mock
const { getGitHubClient } = await import('@/modules/github/lib/github-client')
const { RateLimitError, fetchCommits } = await import('./commits.service')

// Helper para crear mock de respuesta de Octokit
function createMockOctokitResponse(
  commits: Array<{
    sha: string
    message: string
    author?: { login?: string; email?: string; avatar_url?: string } | null
    date?: string
    files?: string[]
  }>
) {
  return {
    rest: {
      repos: {
        compareCommits: vi.fn().mockResolvedValue({
          data: {
            commits: commits.map(c => ({
              sha: c.sha,
              commit: {
                message: c.message,
                author: { date: c.date ?? '2024-01-01T00:00:00Z' },
                committer: { date: c.date ?? '2024-01-01T00:00:00Z' },
              },
              author: c.author ?? null,
              committer: null,
            })),
            files: commits[0]?.files?.map(f => ({ filename: f })) ?? [],
          },
        }),
      },
    },
  }
}

describe('fetchCommits', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Fetch exitoso', () => {
    it('retorna commits correctamente', async () => {
      const mockOctokit = createMockOctokitResponse([
        { sha: 'abc123', message: 'feat: new feature', author: { login: 'user1' } },
      ])
      vi.mocked(getGitHubClient).mockReturnValue(mockOctokit as unknown as ReturnType<typeof getGitHubClient>)

      const result = await fetchCommits('owner', 'repo', 'main', 'feature')

      expect(result).toHaveLength(1)
      expect(result[0]?.sha).toBe('abc123')
      expect(result[0]?.message).toBe('feat: new feature')
    })

    it('llama a compareCommits con los parámetros correctos', async () => {
      const mockOctokit = createMockOctokitResponse([])
      vi.mocked(getGitHubClient).mockReturnValue(mockOctokit as unknown as ReturnType<typeof getGitHubClient>)

      await fetchCommits('owner', 'repo', 'base-branch', 'head-branch')

      expect(mockOctokit.rest.repos.compareCommits).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'repo',
        base: 'base-branch',
        head: 'head-branch',
        per_page: 100,
      })
    })

    it('respeta el límite máximo de commits', async () => {
      const commits = Array.from({ length: 10 }, (_, i) => ({
        sha: `sha${i}`,
        message: `commit ${i}`,
      }))

      const mockOctokit = createMockOctokitResponse(commits)
      vi.mocked(getGitHubClient).mockReturnValue(mockOctokit as unknown as ReturnType<typeof getGitHubClient>)

      const result = await fetchCommits('owner', 'repo', 'main', 'feature', 5)

      expect(result).toHaveLength(5)
    })
  })

  describe('Manejo de errores', () => {
    it('lanza error cuando el cliente no está disponible', async () => {
      vi.mocked(getGitHubClient).mockReturnValue(null)

      await expect(fetchCommits('owner', 'repo', 'main', 'feature')).rejects.toThrow('GitHub client no disponible')
    })

    it('reintenta cuando hay rate limit', async () => {
      const mockOctokit = {
        rest: {
          repos: {
            compareCommits: vi
              .fn()
              .mockRejectedValueOnce({
                status: 403,
                data: { message: 'rate limit exceeded' },
              })
              .mockResolvedValueOnce({
                data: {
                  commits: [{ sha: 'abc', commit: { message: 'test' }, author: null, committer: null }],
                  files: [],
                },
              }),
          },
        },
      }

      vi.mocked(getGitHubClient).mockReturnValue(mockOctokit as unknown as ReturnType<typeof getGitHubClient>)

      const result = await fetchCommits('owner', 'repo', 'main', 'feature')

      expect(result).toHaveLength(1)
      expect(mockOctokit.rest.repos.compareCommits).toHaveBeenCalledTimes(2)
    })
  })
})

describe('RateLimitError', () => {
  it('crea error con información de reset', () => {
    const resetAt = new Date('2024-12-31T23:59:59Z')
    const error = new RateLimitError(resetAt, 5000, 3600)

    expect(error.resetAt).toEqual(resetAt)
    expect(error.limit).toBe(5000)
    expect(error.retryAfter).toBe(3600)
    expect(error.message).toBe('GitHub API rate limit exceeded')
  })
})
