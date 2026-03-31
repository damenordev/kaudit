/**
 * Tests para el componente FileSidebar.
 * Verifica renderizado, selección de archivos y búsqueda.
 */
import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import type { IChangedFile } from '../types/diff.types'
import type { IEnrichedIssue } from '../types/issue.types'
import { FileSidebar } from '../components/file-sidebar'

function createMockFile(overrides: Partial<IChangedFile> = {}): IChangedFile {
  return {
    path: 'src/components/app.tsx',
    language: 'TypeScript',
    additions: 10,
    deletions: 5,
    status: 'modified',
    diff: '',
    hunks: [],
    issueCount: 0,
    commitSha: 'abc123',
    ...overrides,
  }
}

function createMockIssue(overrides: Partial<IEnrichedIssue> = {}): IEnrichedIssue {
  return {
    id: 'issue-1',
    type: 'security',
    severity: 'critical',
    file: 'src/components/app.tsx',
    line: 10,
    title: 'Test issue',
    message: 'Test message',
    status: 'open',
    ...overrides,
  }
}

describe('FileSidebar', () => {
  const defaultProps = {
    files: [createMockFile()],
    issues: [] as IEnrichedIssue[],
    selectedFile: undefined,
    onFileSelect: vi.fn(),
  }

  it('renderiza la barra de búsqueda', () => {
    render(<FileSidebar {...defaultProps} />)
    const searchInput = screen.getByPlaceholderText('Buscar archivos...')
    expect(searchInput).toBeInTheDocument()
  })

  it('renderiza los archivos en la lista', () => {
    render(<FileSidebar {...defaultProps} />)
    expect(screen.getByText('app.tsx')).toBeInTheDocument()
  })

  it('llama a onFileSelect al hacer click en un archivo', () => {
    const onFileSelect = vi.fn()
    render(<FileSidebar {...defaultProps} onFileSelect={onFileSelect} />)

    const fileButton = screen.getByText('app.tsx').closest('button')
    expect(fileButton).toBeTruthy()
    fireEvent.click(fileButton!)
    expect(onFileSelect).toHaveBeenCalledWith('src/components/app.tsx')
  })

  it('filtra archivos al escribir en la búsqueda', () => {
    const files = [createMockFile({ path: 'src/app.tsx' }), createMockFile({ path: 'src/utils.ts' })]

    render(<FileSidebar {...defaultProps} files={files} />)

    const searchInput = screen.getByPlaceholderText('Buscar archivos...')
    fireEvent.change(searchInput, { target: { value: 'utils' } })

    expect(screen.getByText('utils.ts')).toBeInTheDocument()
    expect(screen.queryByText('app.tsx')).not.toBeInTheDocument()
  })

  it('muestra el badge de issues cuando hay issues', () => {
    const issues = [createMockIssue({ file: 'src/components/app.tsx' })]
    render(<FileSidebar {...defaultProps} issues={issues} />)

    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('renderiza múltiples archivos', () => {
    const files = [
      createMockFile({ path: 'src/a.ts' }),
      createMockFile({ path: 'src/b.ts' }),
      createMockFile({ path: 'src/c.ts' }),
    ]

    render(<FileSidebar {...defaultProps} files={files} />)

    expect(screen.getByText('a.ts')).toBeInTheDocument()
    expect(screen.getByText('b.ts')).toBeInTheDocument()
    expect(screen.getByText('c.ts')).toBeInTheDocument()
  })

  it('alterna entre vista agrupada y plana', () => {
    render(<FileSidebar {...defaultProps} />)

    const toggleButton = screen.getByText('Agrupados')
    fireEvent.click(toggleButton)
    expect(screen.getByText('Planos')).toBeInTheDocument()
  })

  it('no muestra badge de issues si no hay issues', () => {
    render(<FileSidebar {...defaultProps} />)
    const badges = screen.queryAllByText('0')
    expect(badges).toHaveLength(0)
  })
})
