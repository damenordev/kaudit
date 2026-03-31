'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createMermaidPlugin } from '@streamdown/mermaid'
import DOMPurify from 'dompurify'
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'

export interface IMermaidViewerProps {
  code: string
  className?: string
}

const MIN_ZOOM = 0.25
const MAX_ZOOM = 3
const ZOOM_STEP = 0.25

const plugin = createMermaidPlugin()
const mermaidInstance = plugin.getMermaid({ startOnLoad: false, theme: 'dark' })

export function MermaidViewer({ code, className }: IMermaidViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const renderId = useRef(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    const id = `mermaid-${++renderId.current}`

    mermaidInstance
      .render(id, code)
      .then(({ svg: renderedSvg }) => {
        if (!cancelled) {
          setSvg(renderedSvg)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Error rendering diagram'
          setError(message)
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [code])

  const handleZoomIn = useCallback(() => setZoom(z => Math.min(z + ZOOM_STEP, MAX_ZOOM)), [])
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(z - ZOOM_STEP, MIN_ZOOM)), [])
  const handleReset = useCallback(() => setZoom(1), [])
  const handleFullscreen = useCallback(() => setIsFullscreen(f => !f), [])

  if (error) {
    return (
      <div className={cn('flex items-center justify-center p-8 border rounded-lg bg-destructive/10', className)}>
        <div className="text-center space-y-2">
          <p className="text-sm text-destructive font-medium">Error rendering diagram</p>
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative flex flex-col border rounded-lg overflow-hidden bg-zinc-950',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
    >
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <ToolbarButton onClick={handleZoomOut} icon={<ZoomOut className="size-4" />} label="Alejar" />
        <ToolbarButton onClick={handleReset} icon={<RotateCcw className="size-4" />} label="Reset" />
        <ToolbarButton onClick={handleZoomIn} icon={<ZoomIn className="size-4" />} label="Acercar" />
        <ToolbarButton
          onClick={handleFullscreen}
          icon={isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          label={isFullscreen ? 'Salir' : 'Pantalla completa'}
        />
      </div>

      <div className="flex-1 overflow-auto p-4" ref={containerRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="size-6 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div
            className="origin-center transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(svg) }}
          />
        )}
      </div>
    </div>
  )
}

interface IToolbarButtonProps {
  onClick: () => void
  icon: React.ReactNode
  label: string
}

function ToolbarButton({ onClick, icon, label }: IToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
    >
      {icon}
    </button>
  )
}
