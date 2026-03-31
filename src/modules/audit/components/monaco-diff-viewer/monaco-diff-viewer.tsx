'use client'

import { useCallback } from 'react'
import { DiffEditor, type DiffOnMount } from '@monaco-editor/react'
import { useThemePalette } from '@/core/components/theme/palette/palette-provider'
import { cn } from '@/core/utils/cn.utils'
import { Spinner } from '@/core/ui/spinner'

export interface IMonacoDiffViewerProps {
  originalContent: string
  modifiedContent: string
  language: string
  fileName: string
  highlightedLines?: number[]
  isLoading?: boolean
  error?: string | null
  className?: string
}

/**
 * Inyecta estilos CSS globales para el resaltado de líneas con issues.
 */
function ensureHighlightStyles(): void {
  const styleId = 'monaco-diff-viewer-styles'
  if (document.getElementById(styleId)) return
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
    .monaco-highlighted-line { background-color: rgba(234, 179, 8, 0.15) !important; }
    .monaco-highlighted-glyph { background-color: rgba(234, 179, 8, 0.6) !important; border-radius: 2px; }
  `
  document.head.appendChild(style)
}

/**
 * Aplica decoraciones para resaltar líneas en el editor modificado.
 */
function applyDecorations(editor: Parameters<DiffOnMount>[0], highlightedLines: number[] | undefined): string[] {
  const modifiedEditor = editor.getModifiedEditor()
  if (!highlightedLines?.length) return []

  const decorations = highlightedLines.map(line => ({
    range: {
      startLineNumber: line,
      startColumn: 1,
      endLineNumber: line,
      endColumn: 1,
    },
    options: {
      isWholeLine: true,
      className: 'monaco-highlighted-line',
      glyphMarginClassName: 'monaco-highlighted-glyph',
    },
  }))

  return modifiedEditor.deltaDecorations([], decorations)
}

export function MonacoDiffViewer({
  originalContent,
  modifiedContent,
  language,
  fileName,
  highlightedLines,
  isLoading = false,
  error = null,
  className,
}: IMonacoDiffViewerProps) {
  const { isDark } = useThemePalette()

  const handleMount: DiffOnMount = useCallback(
    editor => {
      ensureHighlightStyles()
      applyDecorations(editor, highlightedLines)
    },
    [highlightedLines]
  )

  if (error) {
    return (
      <div className={cn('flex items-center justify-center p-8 border rounded-lg bg-destructive/10', className)}>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-3 p-8 border rounded-lg', className)}>
        <Spinner className="size-6" />
        <p className="text-sm text-muted-foreground">Cargando {fileName}...</p>
      </div>
    )
  }

  return (
    <div className={cn('h-full min-h-[400px] w-full overflow-hidden rounded-lg border', className)}>
      <DiffEditor
        original={originalContent}
        modified={modifiedContent}
        language={language}
        theme={isDark ? 'vs-dark' : 'vs'}
        originalModelPath={`${fileName}/base`}
        modifiedModelPath={`${fileName}/head`}
        onMount={handleMount}
        options={{
          readOnly: true,
          renderSideBySide: true,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          folding: true,
          renderOverviewRuler: true,
          automaticLayout: true,
          diffAlgorithm: 'advanced',
        }}
      />
    </div>
  )
}
