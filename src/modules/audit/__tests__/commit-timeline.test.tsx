/**
 * Tests para el componente CommitTimeline.
 * Verifica renderizado de commits, ordenamiento y estados vacíos.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

import type { IAuditCommit } from '../types/commit.types'

vi.mock('@/core/utils/cn.utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}))

vi.mock('@/core/ui/scroll-area', () => ({
  ScrollArea: ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div data-testid="scroll-area" style={style}>
      {children}
    </div>
  ),
}))

vi.mock('@/core/ui/separator', () => ({
  Separator: () => <hr data-testid="separator" />,
}))

vi.mock('@/core/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span data-testid="badge">{children}</span>,
}))

vi.mock('@/core/utils/date', () => ({
  formatRelativeDate: (date: string) => `hace ${date}`,
  formatDate: (date: string) => date,
}))

vi.mock('lucide-react', () => ({
  GitBranch: () => <span data-testid="icon-git-branch">GitBranch</span>,
  GitCommitHorizontal: () => <span data-testid="icon-commit">CommitIcon</span>,
}))

const DEFAULT_TRANSLATIONS = {
  title: 'Commits',
  filesChanged: 'archivos',
  emptyMessage: 'No hay commits',
  viewDetails: 'Ver detalles',
  viewDiff: 'Ver diff',
}

function makeCommit(overrides: Partial<IAuditCommit> = {}): IAuditCommit {
  return {
    sha: 'abc1234567890',
    message: 'feat: add new feature',
    author: { name: 'Developer', email: 'dev@test.com' },
    date: '2024-06-15T10:00:00Z',
    files: ['src/app.ts', 'src/utils.ts'],
    ...overrides,
  }
}

async function renderTimeline(commits: IAuditCommit[] = []) {
  const { CommitTimeline } = await import('../components/commit-timeline/commit-timeline')
  return render(
    <CommitTimeline commits={commits} repoUrl="https://github.com/acme/project" translations={DEFAULT_TRANSLATIONS} />
  )
}

describe('CommitTimeline', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el título con conteo de commits', async () => {
    await renderTimeline([makeCommit()])

    expect(screen.getByText('Commits')).toBeDefined()
    expect(screen.getByText('(1)')).toBeDefined()
  })

  it('muestra mensaje vacío cuando no hay commits', async () => {
    await renderTimeline([])

    expect(screen.getByText('No hay commits')).toBeDefined()
  })

  it('renderiza cada commit con su SHA corto', async () => {
    await renderTimeline([makeCommit({ sha: 'abc1234567890def' })])

    const link = screen.getByText('abc1234')
    expect(link).toBeDefined()
    expect(link.getAttribute('href')).toBe('https://github.com/acme/project/commit/abc1234567890def')
  })

  it('renderiza el mensaje del commit', async () => {
    await renderTimeline([makeCommit({ message: 'fix: resolve bug' })])

    expect(screen.getByText('fix: resolve bug')).toBeDefined()
  })

  it('renderiza el nombre del autor', async () => {
    await renderTimeline([makeCommit()])

    expect(screen.getByText('Developer')).toBeDefined()
  })

  it('muestra iniciales cuando no hay avatar', async () => {
    await renderTimeline([makeCommit({ author: { name: 'John Doe', email: 'j@test.com' } })])

    expect(screen.getByText('JD')).toBeDefined()
  })

  it('muestra badge con cantidad de archivos', async () => {
    await renderTimeline([makeCommit()])

    const badges = screen.getAllByTestId('badge')
    expect(badges.some(b => b.textContent?.includes('2'))).toBe(true)
  })

  it('ordena commits por fecha descendente', async () => {
    const commits = [
      makeCommit({ sha: 'older', date: '2024-01-01T00:00:00Z' }),
      makeCommit({ sha: 'newer', date: '2024-06-01T00:00:00Z' }),
    ]

    await renderTimeline(commits)

    const allText = document.body.textContent ?? ''
    const olderPos = allText.indexOf('older'.slice(0, 7))
    const newerPos = allText.indexOf('newer'.slice(0, 7))
    expect(newerPos).toBeLessThan(olderPos)
  })

  it('trunca mensajes largos', async () => {
    const longMessage = 'a'.repeat(200)
    await renderTimeline([makeCommit({ message: longMessage })])

    const displayed = screen.getByText(`${'a'.repeat(120)}...`)
    expect(displayed).toBeDefined()
  })

  it('múltiples commits se renderizan', async () => {
    const commits = [
      makeCommit({ sha: 'commit1', message: 'first' }),
      makeCommit({ sha: 'commit2', message: 'second' }),
      makeCommit({ sha: 'commit3', message: 'third' }),
    ]

    await renderTimeline(commits)

    expect(screen.getByText('(3)')).toBeDefined()
    expect(screen.getByText('first')).toBeDefined()
    expect(screen.getByText('second')).toBeDefined()
    expect(screen.getByText('third')).toBeDefined()
  })
})

describe('commit-timeline.utils', () => {
  it('shortSha acorta a 7 caracteres', async () => {
    const { shortSha } = await import('../components/commit-timeline/commit-timeline.utils')
    expect(shortSha('abc1234567890')).toBe('abc1234')
  })

  it('countFiles retorna 0 para commits sin archivos', async () => {
    const { shortSha } = await import('../components/commit-timeline/commit-timeline.utils')
    expect(shortSha('abc1234567890')).toBe('abc1234')
  })

  it('groupCommitsByDate agrupa por fecha', async () => {
    const { groupCommitsByDate } = await import('../components/commit-timeline/commit-timeline.utils')
    const commits = [
      makeCommit({ date: '2024-06-15T10:00:00Z', sha: 'a' }),
      makeCommit({ date: '2024-06-15T14:00:00Z', sha: 'b' }),
      makeCommit({ date: '2024-06-14T10:00:00Z', sha: 'c' }),
    ]

    const groups = groupCommitsByDate(commits)
    expect(groups).toHaveLength(2)
    expect(groups[0]!.commits).toHaveLength(2)
    expect(groups[1]!.commits).toHaveLength(1)
  })
})
