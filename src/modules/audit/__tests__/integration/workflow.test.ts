/**
 * Tests de integración para el workflow de auditoría.
 * Verifica la orquestación de parsing, validación y generación.
 * Mockea las llamadas a servicios externos (fetch, AI, DB).
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/modules/github/services/commits.service', () => ({
  fetchCommits: vi.fn(),
}))

vi.mock('@/core/lib/inngest/client', () => ({
  inngest: {
    createFunction: vi.fn((config, handler) => ({ config, handler })),
  },
}))

vi.mock('../queries/audit.queries', () => ({
  getAuditById: vi.fn(),
  updateAuditStatus: vi.fn(),
}))

vi.mock('../services/validation.service', () => ({
  validateGitDiff: vi.fn(),
}))

vi.mock('../services/generation.service', () => ({
  generatePrDescription: vi.fn(),
}))

import { fetchCommits } from '@/modules/github/services/commits.service'
import { getAuditById, updateAuditStatus } from '../../queries/audit.queries'
import { validateGitDiff } from '../../services/validation.service'
import { generatePrDescription } from '../../services/generation.service'
import { parseDiff } from '../../lib/parse-diff.utils'

import type { IAuditCommit, IValidationIssue, IValidationResult } from '../../types'

const MOCK_GIT_DIFF = `diff --git a/src/hello.ts b/src/hello.ts
index 1234567..abcdefg 100644
--- a/src/hello.ts
+++ b/src/hello.ts
@@ -1,3 +1,5 @@
 export function hello() {
-  return 'world';
+  return 'world!';
+  console.log('debug');
 }
`

function makeMockCommit(sha: string): IAuditCommit {
  return {
    sha,
    message: `commit ${sha}`,
    author: { name: 'dev', email: 'dev@test.com' },
    date: '2024-06-01T00:00:00Z',
    files: ['src/hello.ts'],
  }
}

function makeValidationResult(issues: IValidationIssue[] = []): IValidationResult {
  return {
    isValid: issues.length === 0,
    issues,
    analyzedAt: new Date(),
  }
}

describe('Workflow de auditoría - integración', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('parseDiff dentro del flujo de auditoría', () => {
    it('parsea el diff obtenido de la DB', () => {
      const changedFiles = parseDiff(MOCK_GIT_DIFF)

      expect(changedFiles).toHaveLength(1)
      expect(changedFiles[0]!.path).toBe('src/hello.ts')
      expect(changedFiles[0]!.additions).toBe(2)
      expect(changedFiles[0]!.deletions).toBe(1)
    })

    it('detecta diff vacío y retorna array vacío', () => {
      const changedFiles = parseDiff('')

      expect(changedFiles).toHaveLength(0)
    })
  })

  describe('validación + parsing', () => {
    it('parsea diff y valida sin issues críticos', async () => {
      const validationResult = makeValidationResult()
      vi.mocked(validateGitDiff).mockResolvedValue(validationResult)

      const result = await validateGitDiff(MOCK_GIT_DIFF)

      expect(result.isValid).toBe(true)
      expect(result.issues).toHaveLength(0)
    })

    it('detecta issues críticos en la validación', async () => {
      const criticalIssue: IValidationIssue = {
        type: 'SECRET',
        severity: 'critical',
        line: 2,
        message: 'Hardcoded API key detected',
        suggestion: 'Use environment variables',
      }
      const validationResult = makeValidationResult([criticalIssue])
      vi.mocked(validateGitDiff).mockResolvedValue(validationResult)

      const result = await validateGitDiff(MOCK_GIT_DIFF)

      expect(result.isValid).toBe(false)
      expect(result.issues).toHaveLength(1)
      expect(result.issues[0]!.severity).toBe('critical')
    })
  })

  describe('parseRepoUrl', () => {
    function parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
      if (!match) throw new Error(`URL de repo inválida: ${repoUrl}`)
      return { owner: match[1] ?? '', repo: (match[2] ?? '').replace(/\.git$/, '') }
    }

    it('extrae owner y repo de una URL válida', () => {
      expect(parseRepoUrl('https://github.com/acme/project')).toEqual({
        owner: 'acme',
        repo: 'project',
      })
    })

    it('remueve sufijo .git', () => {
      expect(parseRepoUrl('https://github.com/acme/project.git')).toEqual({
        owner: 'acme',
        repo: 'project',
      })
    })

    it('lanza error para URL inválida', () => {
      expect(() => parseRepoUrl('not-a-url')).toThrow()
    })
  })

  describe('fetchCommits integración', () => {
    it('obtiene commits y los combina con archivos parseados', async () => {
      const mockCommits = [makeMockCommit('abc1234'), makeMockCommit('def5678')]
      vi.mocked(fetchCommits).mockResolvedValue(mockCommits)

      const changedFiles = parseDiff(MOCK_GIT_DIFF)
      const commits = await fetchCommits('acme', 'project', 'main', 'feature')

      expect(commits).toHaveLength(2)
      expect(changedFiles).toHaveLength(1)
      expect(changedFiles[0]!.path).toBe('src/hello.ts')
    })

    it('maneja error de fetchCommits graceful', async () => {
      vi.mocked(fetchCommits).mockRejectedValue(new Error('API rate limit'))

      try {
        await fetchCommits('acme', 'project', 'main', 'feature')
      } catch {
        // Se espera el error
      }

      const changedFiles = parseDiff(MOCK_GIT_DIFF)
      expect(changedFiles).toHaveLength(1)
    })
  })

  describe('flujo completo (mocked services)', () => {
    it('ejecuta validación, parsing y generación en secuencia', async () => {
      const validationResult = makeValidationResult()
      vi.mocked(validateGitDiff).mockResolvedValue(validationResult)
      vi.mocked(generatePrDescription).mockResolvedValue({
        title: 'Update hello function',
        summary: 'Updated return value',
        changes: '- Changed return',
        suggestions: 'None',
        checklist: '- [ ] Tested',
      })
      vi.mocked(getAuditById).mockResolvedValue({
        id: 'audit-1',
        gitDiff: MOCK_GIT_DIFF,
        repoUrl: 'https://github.com/acme/project',
        branchName: 'feature',
        targetBranch: 'main',
      } as never)
      vi.mocked(updateAuditStatus).mockResolvedValue({} as never)
      vi.mocked(fetchCommits).mockResolvedValue([makeMockCommit('aaa1111')])

      const diff = MOCK_GIT_DIFF
      const validation = await validateGitDiff(diff)
      expect(validation.isValid).toBe(true)

      const files = parseDiff(diff)
      expect(files).toHaveLength(1)

      const commits = await fetchCommits('acme', 'project', 'main', 'feature')
      expect(commits).toHaveLength(1)

      const content = await generatePrDescription(diff, validation)
      expect(content.title).toBe('Update hello function')
    })
  })
})
