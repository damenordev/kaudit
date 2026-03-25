'use client'

import React, { useEffect, useRef, useState } from 'react'

import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'

import { cn } from '@/core/utils'

import { EditorImageDialog } from './editor-image-dialog'
import { EditorLinkDialog } from './editor-link-dialog'
import { EditorToolbar } from './editor-toolbar'
import { DEFAULT_EDITOR_PRESET, DEFAULT_PLACEHOLDER, EDITOR_PRESETS } from './editor.constants'
import type { IEditorProps, TEditorPreset, TToolbarItem } from './editor.types'
import { lexkitExtensions, LexKitProvider, useLexKitEditor, type TLexKitCommands } from './lexkit.system'
import { shadcnTheme } from './theme'
import { useEditorState } from './use-editor-state'
import { useImageUpload } from './use-image-upload'

/**
 * Editor enriquecido (Rich Text Editor) basado en LexKit (Lexical).
 * Ofrece un área de edición configurable con opciones de formato.
 */
export const Editor = (props: IEditorProps) => {
  return (
    <LexKitProvider extensions={lexkitExtensions} config={{ theme: shadcnTheme }}>
      <EditorInner {...props} />
    </LexKitProvider>
  )
}

const EditorInner = ({
  value = '',
  onChange,
  preset = DEFAULT_EDITOR_PRESET,
  config,
  placeholder = DEFAULT_PLACEHOLDER,
  editable = true,
  showToolbar = true,
  minHeight = '150px',
  maxHeight,
  className,
  contentClassName,
  toolbarClassName,
  onEditorReady,
  onImageUpload,
  'aria-label': ariaLabel,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby,
}: IEditorProps) => {
  const { commands, lexical: editor, hasExtension, activeStates } = useLexKitEditor()
  const editorState = useEditorState()
  const imageUploadHandlers = useImageUpload(onImageUpload)

  const isInitializing = useRef(true)

  const activePreset: TEditorPreset = preset || DEFAULT_EDITOR_PRESET
  const defaultToolbarItems = EDITOR_PRESETS[activePreset] || EDITOR_PRESETS.standard
  const toolbarItems = config?.toolbar || defaultToolbarItems

  // Sync value inwards
  useEffect(() => {
    if (!isInitializing.current || !value || !editor) return
    const init = async () => {
      if (config?.output === 'markdown') {
        if (hasExtension('markdown')) await commands.importFromMarkdown(value, { immediate: true })
      } else {
        await commands.importFromHTML(value)
      }
      isInitializing.current = false
      onEditorReady?.()
    }
    init()
  }, [value, config?.output, editor, commands, hasExtension, onEditorReady])

  // Sync value outwards
  useEffect(() => {
    if (!editor || !onChange) return
    const unregister = editor.registerUpdateListener(async () => {
      if (isInitializing.current) return
      let outValue = ''
      if (config?.output === 'markdown') {
        if (hasExtension('markdown')) outValue = await commands.exportToMarkdown()
      } else if (config?.output === 'json') {
        const json = editor.getEditorState().toJSON()
        outValue = JSON.stringify(json)
      } else {
        outValue = await commands.exportToHTML()
      }
      onChange?.(outValue)
    })
    return () => unregister()
  }, [editor, onChange, config?.output, commands, hasExtension])

  // Re-export when config.output changes
  useEffect(() => {
    if (isInitializing.current || !editor || !onChange) return
    const exportValue = async () => {
      let outValue = ''
      if (config?.output === 'markdown') {
        if (hasExtension('markdown')) outValue = await commands.exportToMarkdown()
      } else if (config?.output === 'json') {
        const json = editor.getEditorState().toJSON()
        outValue = JSON.stringify(json, null, 2)
      } else {
        outValue = await commands.exportToHTML()
      }
      onChange(outValue)
    }
    exportValue()
  }, [config?.output, editor, onChange, commands, hasExtension])

  // Toolbar Actions Overrides
  const actionOverrides: Partial<Record<TToolbarItem, (commands: TLexKitCommands) => void>> = {
    link: cmd => {
      const url = activeStates?.isLink ? '' : '' // Would be nice to get selected URL, but let's open empty for now
      editorState.openLinkDialog(url)
    },
    image: () => {
      editorState.openImageDialog()
    },
  }

  return (
    <div
      aria-label={ariaLabel}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedby}
      className={cn(
        'flex flex-col overflow-hidden rounded-md border border-border/50 bg-background transition-colors focus-within:border-border',
        !editable && 'opacity-60',
        ariaInvalid && 'border-destructive ring-destructive/20 dark:ring-destructive/40 focus-within:ring-destructive',
        className
      )}
    >
      {showToolbar && editable && editor && (
        <EditorToolbar
          items={toolbarItems}
          actionOverrides={actionOverrides}
          className={cn('bg-muted/30 border-b border-border', toolbarClassName)}
        />
      )}

      <div className="relative flex-1">
        <div
          style={{ minHeight, maxHeight }}
          className={cn('py-4 px-10 max-w-none overflow-y-auto text-foreground', contentClassName)}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(shadcnTheme.contentEditable, 'min-h-[150px] outline-none selection:bg-primary/40')}
              />
            }
            placeholder={
              <div className="absolute top-4 left-10 text-muted-foreground pointer-events-none select-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={({ children }) => <>{children}</>}
          />
        </div>
      </div>

      <EditorLinkDialog
        open={editorState.linkDialogOpen}
        onOpenChange={editorState.setLinkDialogOpen}
        url={editorState.linkUrl}
        onUrlChange={editorState.setLinkUrl}
      />

      <EditorImageDialog
        open={editorState.imageDialogOpen}
        onOpenChange={editorState.setImageDialogOpen}
        url={editorState.imageUrl}
        onUrlChange={editorState.setImageUrl}
        onImageUpload={onImageUpload}
      />
    </div>
  )
}
