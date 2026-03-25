'use client'

import { Button } from '@/core/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/core/ui/tooltip'

import type { IEditorToolbarButtonProps } from './editor.types'

/**
 * Botón individual de la barra de herramientas del editor.
 * Muestra un tooltip con el nombre de la acción y su atajo de teclado.
 *
 * @example
 * ```tsx
 * <EditorToolbarButton
 *   onClick={() => editor.chain().focus().toggleBold().run()}
 *   isActive={editor.isActive('bold')}
 *   tooltip="Negrita"
 *   shortcut="Ctrl+B"
 * >
 *   <Bold />
 * </EditorToolbarButton>
 * ```
 */
export const EditorToolbarButton = ({
  onClick,
  isActive = false,
  isDisabled = false,
  tooltip,
  shortcut,
  children,
}: IEditorToolbarButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        size="icon-sm"
        onClick={e => {
          e.preventDefault()
          onClick()
        }}
        disabled={isDisabled}
        aria-label={tooltip}
        aria-pressed={isActive}
        type="button"
      >
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      <span>{tooltip}</span>
      {shortcut && <kbd className="ml-1.5 rounded bg-background/20 px-1 py-0.5 font-mono text-[10px]">{shortcut}</kbd>}
    </TooltipContent>
  </Tooltip>
)
