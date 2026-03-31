/**
 * Tests para el componente MonacoDiffViewer.
 * Verifica estados de carga, error y renderizado del editor.
 */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/core/components/theme/palette/palette-provider', () => ({
  useThemePalette: () => ({ isDark: false }),
}))

vi.mock('@monaco-editor/react', () => ({
  DiffEditor: ({ language, original, modified }: { language: string; original: string; modified: string }) => (
    <div data-testid="diff-editor" data-language={language} data-original={original} data-modified={modified} />
  ),
}))

import { MonacoDiffViewer } from '../components/monaco-diff-viewer/monaco-diff-viewer'

describe('MonacoDiffViewer', () => {
  const defaultProps = {
    originalContent: 'old code',
    modifiedContent: 'new code',
    language: 'TypeScript',
    fileName: 'src/app.ts',
  }

  it('renderiza el editor diff con contenido', () => {
    render(<MonacoDiffViewer {...defaultProps} />)

    const editor = screen.getByTestId('diff-editor')
    expect(editor).toBeInTheDocument()
    expect(editor).toHaveAttribute('data-language', 'TypeScript')
    expect(editor).toHaveAttribute('data-original', 'old code')
    expect(editor).toHaveAttribute('data-modified', 'new code')
  })

  it('muestra estado de carga', () => {
    render(<MonacoDiffViewer {...defaultProps} isLoading={true} />)

    expect(screen.getByText('Cargando src/app.ts...')).toBeInTheDocument()
    expect(screen.queryByTestId('diff-editor')).not.toBeInTheDocument()
  })

  it('muestra estado de error', () => {
    render(<MonacoDiffViewer {...defaultProps} error="Error al cargar el archivo" />)

    expect(screen.getByText('Error al cargar el archivo')).toBeInTheDocument()
    expect(screen.queryByTestId('diff-editor')).not.toBeInTheDocument()
  })

  it('no muestra error si error es null', () => {
    render(<MonacoDiffViewer {...defaultProps} error={null} />)

    expect(screen.getByTestId('diff-editor')).toBeInTheDocument()
  })

  it('prioriza error sobre loading', () => {
    render(<MonacoDiffViewer {...defaultProps} error="Some error" isLoading={true} />)

    expect(screen.getByText('Some error')).toBeInTheDocument()
    expect(screen.queryByText(/Cargando/)).not.toBeInTheDocument()
  })

  it('aplica className correctamente', () => {
    const { container } = render(<MonacoDiffViewer {...defaultProps} className="test-class" />)

    expect(container.firstChild).toHaveClass('test-class')
  })

  it('renderiza con contenido vacío', () => {
    render(<MonacoDiffViewer {...defaultProps} originalContent="" modifiedContent="" />)

    const editor = screen.getByTestId('diff-editor')
    expect(editor).toHaveAttribute('data-original', '')
    expect(editor).toHaveAttribute('data-modified', '')
  })
})
