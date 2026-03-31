/**
 * Tests para el prompt de chat de auditoría.
 * Verifica que buildAuditChatPrompt genera el prompt correcto
 * y que el prompt produce la estructura IEnrichedIssue[] esperada.
 */
import { describe, expect, it } from 'vitest'

import type { IChangedFile, IEnrichedIssue, IAuditCommit, IValidationResult } from '../../types'
import { buildAuditChatPrompt } from '../../lib/prompts/chat.prompt'

function makeChangedFile(overrides: Partial<IChangedFile> = {}): IChangedFile {
  return {
    path: 'src/auth.ts',
    language: 'TypeScript',
    additions: 10,
    deletions: 3,
    status: 'modified',
    diff: '',
    hunks: [],
    issueCount: 2,
    commitSha: 'abc123',
    ...overrides,
  }
}

function makeIssue(overrides: Partial<IEnrichedIssue> = {}): IEnrichedIssue {
  return {
    id: 'issue-1',
    type: 'security',
    severity: 'critical',
    file: 'src/auth.ts',
    line: 42,
    title: 'SQL Injection',
    message: 'User input not sanitized',
    suggestedFix: 'Use parameterized queries',
    status: 'open',
    ...overrides,
  }
}

function makeCommit(overrides: Partial<IAuditCommit> = {}): IAuditCommit {
  return {
    sha: 'abc1234567890',
    message: 'feat: add auth module',
    author: { name: 'Dev', email: 'dev@test.com' },
    date: '2024-06-15T10:00:00Z',
    files: ['src/auth.ts'],
    ...overrides,
  }
}

function makeValidationResult(overrides: Partial<IValidationResult> = {}): IValidationResult {
  return {
    isValid: true,
    issues: [],
    analyzedAt: new Date('2024-06-15'),
    ...overrides,
  }
}

describe('buildAuditChatPrompt', () => {
  it('genera un prompt con todas las secciones', () => {
    const prompt = buildAuditChatPrompt({
      repoUrl: 'https://github.com/acme/project',
      branchName: 'feature/auth',
      targetBranch: 'main',
      changedFiles: [makeChangedFile()],
      issues: [makeIssue()],
      commits: [makeCommit()],
      validationResult: makeValidationResult(),
    })

    expect(prompt).toContain('acme/project')
    expect(prompt).toContain('feature/auth')
    expect(prompt).toContain('main')
    expect(prompt).toContain('src/auth.ts')
    expect(prompt).toContain('SQL Injection')
    expect(prompt).toContain('abc1234')
  })

  it('incluye secciones vacías cuando hay datos null', () => {
    const prompt = buildAuditChatPrompt({
      repoUrl: 'https://github.com/acme/project',
      branchName: 'feature',
      targetBranch: 'main',
      changedFiles: null,
      issues: null,
      commits: null,
      validationResult: null,
    })

    expect(prompt).toContain('No changed files.')
    expect(prompt).toContain('No issues detected.')
    expect(prompt).toContain('No commits info.')
    expect(prompt).toContain('No validation.')
  })

  it('incluye issues con severidad y tipo', () => {
    const issues = [
      makeIssue({ severity: 'critical', type: 'security', title: 'Secret exposed' }),
      makeIssue({ severity: 'warning', type: 'best-practice', title: 'Missing error handling', id: 'issue-2' }),
    ]

    const prompt = buildAuditChatPrompt({
      repoUrl: 'https://github.com/test/repo',
      branchName: 'fix',
      targetBranch: 'main',
      changedFiles: [],
      issues,
      commits: [],
      validationResult: makeValidationResult(),
    })

    expect(prompt).toContain('[critical] security: Secret exposed')
    expect(prompt).toContain('[warning] best-practice: Missing error handling')
  })

  it('incluye suggested fix cuando existe', () => {
    const issues = [makeIssue({ suggestedFix: 'Use env variables' })]

    const prompt = buildAuditChatPrompt({
      repoUrl: 'https://github.com/test/repo',
      branchName: 'fix',
      targetBranch: 'main',
      changedFiles: [],
      issues,
      commits: [],
      validationResult: makeValidationResult(),
    })

    expect(prompt).toContain('Suggested fix: Use env variables')
  })

  it('no incluye suggested fix cuando no existe', () => {
    const issues = [makeIssue({ suggestedFix: undefined })]

    const prompt = buildAuditChatPrompt({
      repoUrl: 'https://github.com/test/repo',
      branchName: 'fix',
      targetBranch: 'main',
      changedFiles: [],
      issues,
      commits: [],
      validationResult: makeValidationResult(),
    })

    expect(prompt).not.toContain('Suggested fix:')
  })

  it('limita archivos a 30 máximo', () => {
    const files = Array.from({ length: 35 }, (_, i) => makeChangedFile({ path: `src/file${i}.ts` }))

    const prompt = buildAuditChatPrompt({
      repoUrl: 'https://github.com/test/repo',
      branchName: 'fix',
      targetBranch: 'main',
      changedFiles: files,
      issues: [],
      commits: [],
      validationResult: makeValidationResult(),
    })

    expect(prompt).toContain('src/file0.ts')
    expect(prompt).toContain('src/file29.ts')
    expect(prompt).not.toContain('src/file30.ts')
    expect(prompt).not.toContain('src/file34.ts')
  })

  it('limita commits a 15 máximo', () => {
    const commits = Array.from({ length: 20 }, (_, i) =>
      makeCommit({ sha: `commit${i}hash1234567890`, message: `msg ${i}` })
    )

    const prompt = buildAuditChatPrompt({
      repoUrl: 'https://github.com/test/repo',
      branchName: 'fix',
      targetBranch: 'main',
      changedFiles: [],
      issues: [],
      commits,
      validationResult: makeValidationResult(),
    })

    expect(prompt).toContain('msg 0')
    expect(prompt).toContain('msg 14')
    expect(prompt).not.toContain('msg 15')
  })

  it('incluye issues count en archivos', () => {
    const files = [makeChangedFile({ path: 'src/auth.ts', issueCount: 3 })]

    const prompt = buildAuditChatPrompt({
      repoUrl: 'https://github.com/test/repo',
      branchName: 'fix',
      targetBranch: 'main',
      changedFiles: files,
      issues: [],
      commits: [],
      validationResult: makeValidationResult(),
    })

    expect(prompt).toContain('(3 issues)')
  })

  it('incluye información de validación con issues', () => {
    const validation = makeValidationResult({
      isValid: false,
      issues: [
        {
          type: 'SECRET',
          severity: 'critical',
          line: 5,
          message: 'Hardcoded API key',
          suggestion: 'Use env vars',
        },
      ],
    })

    const prompt = buildAuditChatPrompt({
      repoUrl: 'https://github.com/test/repo',
      branchName: 'fix',
      targetBranch: 'main',
      changedFiles: [],
      issues: [],
      commits: [],
      validationResult: validation,
    })

    expect(prompt).toContain('[critical] SECRET: Hardcoded API key')
    expect(prompt).toContain('Suggestion: Use env vars')
  })

  it('validación sin issues muestra "passed"', () => {
    const prompt = buildAuditChatPrompt({
      repoUrl: 'https://github.com/test/repo',
      branchName: 'fix',
      targetBranch: 'main',
      changedFiles: [],
      issues: [],
      commits: [],
      validationResult: makeValidationResult({ isValid: true, issues: [] }),
    })

    expect(prompt).toContain('Validation passed')
  })

  it('IEnrichedIssue[] tiene la estructura correcta', () => {
    const issue: IEnrichedIssue = makeIssue()

    expect(issue).toHaveProperty('id')
    expect(issue).toHaveProperty('type')
    expect(issue).toHaveProperty('severity')
    expect(issue).toHaveProperty('file')
    expect(issue).toHaveProperty('line')
    expect(issue).toHaveProperty('title')
    expect(issue).toHaveProperty('message')
    expect(issue).toHaveProperty('status')

    const severity: IEnrichedIssue['severity'] = 'critical'
    expect(['critical', 'error', 'warning', 'info']).toContain(severity)

    const type: IEnrichedIssue['type'] = 'security'
    expect(['security', 'style', 'logic', 'performance', 'best-practice']).toContain(type)
  })

  it('arreglo de IEnrichedIssue tiene tipo correcto', () => {
    const issues: IEnrichedIssue[] = [
      makeIssue({ id: '1', severity: 'critical' }),
      makeIssue({ id: '2', severity: 'warning' }),
      makeIssue({ id: '3', severity: 'info' }),
    ]

    expect(issues).toHaveLength(3)
    expect(issues.every(i => typeof i.id === 'string')).toBe(true)
    expect(issues.every(i => typeof i.line === 'number')).toBe(true)
    expect(issues.every(i => i.file.length > 0)).toBe(true)
  })
})
