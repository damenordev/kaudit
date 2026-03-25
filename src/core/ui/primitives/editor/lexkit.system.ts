import React from 'react'
import {
  createEditorSystem,
  boldExtension,
  italicExtension,
  underlineExtension,
  strikethroughExtension,
  listExtension,
  imageExtension,
  linkExtension,
  blockFormatExtension,
  historyExtension,
  htmlExtension,
  codeFormatExtension,
  codeExtension,
  horizontalRuleExtension,
  MarkdownExtension,
  HTMLEmbedExtension,
  TableExtension,
  floatingToolbarExtension,
  commandPaletteExtension,
  contextMenuExtension,
  DraggableBlockExtension,
  ALL_MARKDOWN_TRANSFORMERS,
} from '@lexkit/editor'

const markdownExt = new MarkdownExtension().configure({
  customTransformers: ALL_MARKDOWN_TRANSFORMERS,
})

const tableExt = new TableExtension().configure({
  enableContextMenu: false, // Disabling custom context menu for now to avoid the extra boilerplate of building one from scratch
  markdownExtension: markdownExt,
})

export const lexkitExtensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
  strikethroughExtension,
  listExtension,
  imageExtension.configure({
    defaultAlignment: 'center',
    resizable: true,
    pasteListener: { insert: true, replace: true },
    debug: false,
  }),
  linkExtension.configure({
    linkSelectedTextOnPaste: true,
    autoLinkText: true,
    autoLinkUrls: true,
  }),
  blockFormatExtension,
  historyExtension,
  htmlExtension,
  codeFormatExtension,
  codeExtension,
  horizontalRuleExtension,
  markdownExt,
  tableExt,
  floatingToolbarExtension,
  commandPaletteExtension,
  new HTMLEmbedExtension().configure({
    toggleRenderer: ({ isPreview, onClick, style }) =>
      React.createElement('button', { onClick, style }, isPreview ? 'Edit HTML' : 'Preview'),
    markdownExtension: markdownExt,
  }),
  new DraggableBlockExtension().configure({
    buttonStackPosition: 'left',
  }),
] as const

export const { Provider: LexKitProvider, useEditor: useLexKitEditor } = createEditorSystem<typeof lexkitExtensions>()

export type TLexKitEditorContext = ReturnType<typeof useLexKitEditor>
export type TLexKitCommands = TLexKitEditorContext['commands']
export type TLexKitActiveStates = TLexKitEditorContext['activeStates']
