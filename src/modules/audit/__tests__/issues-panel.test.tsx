/**
 * Tests para el componente IssuesPanel.
 * Verifica renderizado, tabs de severidad y click en issues.
 */
import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import type { IEnrichedIssue } from '../types/issue.types'
import { IssuesPanel } from '../components/issues-panel'

function createMockIssue(overrides: Partial<IEnrichedIssue> = {}): IEnrichedIssue {
  return {
    id: 'issue-1',
    type: 'security',
    severity: 'critical',
    file: 'src/app.ts',
    line: 10,
    title: 'Test issue title',
    message: 'Test issue message',
    status: 'open',
    ...overrides,
  }
}

describe('IssuesPanel', () => {
  it('renderiza estado vacío cuando no hay issues', () => {
    render(<IssuesPanel issues={[]} />)

    expect(screen.getByText('No se encontraron issues')).toBeInTheDocument()
  })

  it('muestra el conteo total de issues', () => {
    const issues = [
      createMockIssue({ id: '1', severity: 'critical' }),
      createMockIssue({ id: '2', severity: 'warning' }),
    ]

    render(<IssuesPanel issues={issues} />)

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renderiza tabs de severidad', () => {
    const issues = [createMockIssue({ id: '1', severity: 'critical' })]

    render(<IssuesPanel issues={issues} />)

    expect(screen.getByText('Crítico')).toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Advertencia')).toBeInTheDocument()
    expect(screen.getByText('Info')).toBeInTheDocument()
  })

  it('muestra issues en la tab correspondiente', () => {
    const issues = [
      createMockIssue({ id: '1', severity: 'critical', title: 'Critical Issue' }),
      createMockIssue({ id: '2', severity: 'warning', title: 'Warning Issue' }),
    ]

    render(<IssuesPanel issues={issues} />)

    expect(screen.getByText('Critical Issue')).toBeInTheDocument()
  })

  it('llama a onIssueClick al hacer click en un issue', () => {
    const onIssueClick = vi.fn()
    const issue = createMockIssue({ id: '1', severity: 'critical' })

    render(<IssuesPanel issues={[issue]} onIssueClick={onIssueClick} />)

    const card = screen.getByText('Test issue title').closest('[class]')
    expect(card).toBeTruthy()
    fireEvent.click(card!)
    expect(onIssueClick).toHaveBeenCalledWith(issue)
  })

  it('muestra "Sin issues" en categoría vacía', () => {
    const issues = [createMockIssue({ id: '1', severity: 'critical' })]

    render(<IssuesPanel issues={issues} />)

    const warningTab = screen.getByText('Advertencia')
    fireEvent.click(warningTab)

    expect(screen.getByText('Sin issues en esta categoría')).toBeInTheDocument()
  })

  it('muestra archivo y línea del issue', () => {
    const issue = createMockIssue({ file: 'src/app.ts', line: 42 })

    render(<IssuesPanel issues={[issue]} />)

    expect(screen.getByText('src/app.ts')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('muestra el mensaje del issue', () => {
    const issue = createMockIssue({ message: 'Detected SQL injection vulnerability' })

    render(<IssuesPanel issues={[issue]} />)

    expect(screen.getByText('Detected SQL injection vulnerability')).toBeInTheDocument()
  })

  it('muestra "N/A" cuando el issue no tiene archivo', () => {
    const issue = createMockIssue({ file: '', line: 0 })

    render(<IssuesPanel issues={[issue]} />)

    expect(screen.getByText('N/A')).toBeInTheDocument()
  })
})
