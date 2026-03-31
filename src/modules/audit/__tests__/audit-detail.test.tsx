/**
 * Tests para el componente AuditDetail.
 * Verifica renderizado de información del repositorio, validación y errores.
 */
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import type { IAuditStatusResponse } from '../types/api.types'
import { AuditDetail } from '../components/audit-detail/audit-detail'

function createMockAudit(overrides: Partial<IAuditStatusResponse> = {}): IAuditStatusResponse {
  return {
    id: 'audit-1',
    status: 'completed',
    repoUrl: 'https://github.com/org/repo',
    branchName: 'feature/test',
    targetBranch: 'main',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    ...overrides,
  }
}

const defaultTranslations = {
  repository: 'Repositorio',
  branch: 'Branch',
  targetBranch: 'Target Branch',
  createdAt: 'Creado',
  viewPR: 'Ver PR',
  validation: {
    title: 'Validación',
    noIssues: 'Sin issues',
    issuesFound: 'Issues encontrados',
    line: 'línea',
    suggestion: 'sugerencia',
  },
  content: {
    title: 'Contenido generado',
    noContent: 'Sin contenido',
  },
  error: {
    title: 'Error',
    prefix: 'Error',
  },
}

describe('AuditDetail', () => {
  it('renderiza información del repositorio', () => {
    render(<AuditDetail audit={createMockAudit()} translations={defaultTranslations} />)

    expect(screen.getByText('feature/test')).toBeInTheDocument()
    expect(screen.getByText('main')).toBeInTheDocument()
  })

  it('muestra el link del PR si está disponible', () => {
    const audit = createMockAudit({ prUrl: 'https://github.com/org/repo/pull/1' })

    render(<AuditDetail audit={audit} translations={defaultTranslations} />)

    const link = screen.getByText('Ver PR')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', 'https://github.com/org/repo/pull/1')
  })

  it('no muestra link del PR si no hay prUrl', () => {
    render(<AuditDetail audit={createMockAudit()} translations={defaultTranslations} />)

    expect(screen.queryByText('Ver PR')).not.toBeInTheDocument()
  })

  it('muestra resultado de validación cuando es válido', () => {
    const audit = createMockAudit({
      validationResult: {
        isValid: true,
        issues: [],
        analyzedAt: '2024-01-15T10:00:00Z',
      },
    })

    render(<AuditDetail audit={audit} translations={defaultTranslations} />)

    expect(screen.getByText('Sin issues')).toBeInTheDocument()
  })

  it('muestra issues de validación cuando no es válido', () => {
    const audit = createMockAudit({
      validationResult: {
        isValid: false,
        issues: [
          { type: 'API_KEY', severity: 'critical', line: 10, message: 'Exposed API key', suggestion: 'Use env vars' },
        ],
        analyzedAt: '2024-01-15T10:00:00Z',
      },
    })

    render(<AuditDetail audit={audit} translations={defaultTranslations} />)

    expect(screen.getByText(/Issues encontrados/)).toBeInTheDocument()
    expect(screen.getByText(/API_KEY/)).toBeInTheDocument()
    expect(screen.getByText(/Exposed API key/)).toBeInTheDocument()
  })

  it('muestra contenido generado cuando existe', () => {
    const audit = createMockAudit({
      generatedContent: {
        title: 'PR Title',
        summary: 'Summary of changes',
        changes: ['- Changed file A', '- Updated file B'],
        suggestions: ['Consider refactoring'],
        checklist: ['- [ ] Check 1', '- [ ] Check 2'],
      },
    })

    render(<AuditDetail audit={audit} translations={defaultTranslations} />)

    expect(screen.getByText('Summary of changes')).toBeInTheDocument()
    expect(screen.getByText(/Check 1/)).toBeInTheDocument()
  })

  it('muestra mensaje de error cuando existe', () => {
    const audit = createMockAudit({ errorMessage: 'Something went wrong' })

    render(<AuditDetail audit={audit} translations={defaultTranslations} />)

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
  })

  it('aplica className correctamente', () => {
    const { container } = render(
      <AuditDetail audit={createMockAudit()} translations={defaultTranslations} className="test-class" />
    )

    expect(container.firstChild).toHaveClass('test-class')
  })
})
