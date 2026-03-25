'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'

import { cn } from '@/core/utils'
import { Separator } from '@/core/ui/separator'

import { createToolbarItems } from './editor.constants'
import { EditorToolbarButton } from './editor-toolbar-button'
import type { IEditorToolbarProps } from './editor.types'
import { useLexKitEditor } from './lexkit.system'

/**
 * Barra de herramientas configurable del editor.
 * Renderiza los botones según la lista de ítems proporcionada.
 * Soporta separadores visuales entre grupos de herramientas.
 *
 * @example
 * ```tsx
 * <EditorToolbar
 *   items={['bold', 'italic', 'separator', 'link']}
 * />
 * ```
 */
export const EditorToolbar = ({ items, actionOverrides, className }: IEditorToolbarProps) => {
  const t = useTranslations('dashboard.editor')
  const editorContext = useLexKitEditor()
  const { commands, activeStates } = editorContext

  const toolbarItems = useMemo(
    () =>
      createToolbarItems({
        bold: t('toolbar.bold'),
        italic: t('toolbar.italic'),
        strike: t('toolbar.strike'),
        code: t('toolbar.code'),
        heading1: t('toolbar.heading1'),
        heading2: t('toolbar.heading2'),
        heading3: t('toolbar.heading3'),
        bulletList: t('toolbar.bulletList'),
        orderedList: t('toolbar.orderedList'),
        blockquote: t('toolbar.blockquote'),
        codeBlock: t('toolbar.codeBlock'),
        horizontalRule: t('toolbar.horizontalRule'),
        link: t('toolbar.link'),
        image: t('toolbar.image'),
        table: t('toolbar.table'),
        undo: t('toolbar.undo'),
        redo: t('toolbar.redo'),
      }),
    [t]
  )

  const historyItems = items.filter(item => item === 'undo' || item === 'redo')
  const mainItems = items.filter(item => item !== 'undo' && item !== 'redo')

  const renderItem = (item: (typeof items)[number], index: number) => {
    if (item === 'separator') return <Separator key={`sep-${index}`} orientation="vertical" className="mx-1 h-6" />

    const config = toolbarItems[item]
    if (!config) return null

    const IconComponent = config.icon
    const isActive = config.isActive?.(activeStates, editorContext) ?? false
    const isDisabled = config.canExecute ? !config.canExecute(activeStates, editorContext) : false
    const onClick = () => (actionOverrides?.[item] ?? config.action)(commands)

    return (
      <EditorToolbarButton
        key={config.id}
        onClick={onClick}
        isActive={isActive}
        isDisabled={isDisabled}
        tooltip={config.label}
        shortcut={config.shortcut}
      >
        <IconComponent />
      </EditorToolbarButton>
    )
  }

  return (
    <div
      role="toolbar"
      aria-label={t('toolbar.ariaLabel')}
      className={cn('flex flex-wrap items-center gap-0.5 border-b p-1.5', className)}
    >
      <div className="flex flex-wrap items-center gap-0.5">{mainItems.map(renderItem)}</div>
      {historyItems.length > 0 && (
        <div className="ml-auto flex items-center gap-0.5">{historyItems.map(renderItem)}</div>
      )}
    </div>
  )
}
