import {
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Table,
  Undo,
} from 'lucide-react'

import type { IToolbarItemConfig, TEditorPreset, TToolbarItem } from './editor.types'

type TToolbarLabels = {
  bold: string
  italic: string
  strike: string
  code: string
  heading1: string
  heading2: string
  heading3: string
  bulletList: string
  orderedList: string
  blockquote: string
  codeBlock: string
  horizontalRule: string
  link: string
  image: string
  table: string
  undo: string
  redo: string
}

/**
 * Crea la configuración de ítems del toolbar con labels personalizados.
 *
 * @param labels - Objeto con las etiquetas traducidas para cada herramienta del toolbar.
 * @returns Record con la configuración de cada ítem del toolbar.
 *
 * @example
 * ```tsx
 * const toolbarItems = createToolbarItems({
 *   bold: t('toolbar.bold'),
 *   italic: t('toolbar.italic'),
 *   // ...
 * })
 * ```
 */

export const createToolbarItems = (
  labels: TToolbarLabels
): Record<Exclude<TToolbarItem, 'separator'>, IToolbarItemConfig> => ({
  bold: {
    id: 'bold',
    label: labels.bold,
    icon: Bold,
    shortcut: 'Ctrl+B',
    action: commands => commands.toggleBold(),
    isActive: activeStates => activeStates.bold,
  },
  italic: {
    id: 'italic',
    label: labels.italic,
    icon: Italic,
    shortcut: 'Ctrl+I',
    action: commands => commands.toggleItalic(),
    isActive: activeStates => activeStates.italic,
  },
  strike: {
    id: 'strike',
    label: labels.strike,
    icon: Strikethrough,
    shortcut: 'Ctrl+Shift+S',
    action: commands => commands.toggleStrikethrough(),
    isActive: activeStates => activeStates.strikethrough,
  },
  code: {
    id: 'code',
    label: labels.code,
    icon: Code,
    shortcut: 'Ctrl+E',
    action: commands => commands.toggleCode(),
    isActive: activeStates => activeStates.code,
  },
  heading1: {
    id: 'heading1',
    label: labels.heading1,
    icon: Heading1,
    shortcut: 'Ctrl+Alt+1',
    action: commands => commands.toggleHeading('h1'),
    isActive: activeStates => activeStates.isH1,
  },
  heading2: {
    id: 'heading2',
    label: labels.heading2,
    icon: Heading2,
    shortcut: 'Ctrl+Alt+2',
    action: commands => commands.toggleHeading('h2'),
    isActive: activeStates => activeStates.isH2,
  },
  heading3: {
    id: 'heading3',
    label: labels.heading3,
    icon: Heading3,
    shortcut: 'Ctrl+Alt+3',
    action: commands => commands.toggleHeading('h3'),
    isActive: activeStates => activeStates.isH3,
  },
  bulletList: {
    id: 'bulletList',
    label: labels.bulletList,
    icon: List,
    shortcut: 'Ctrl+Shift+8',
    action: commands => commands.toggleUnorderedList(),
    isActive: activeStates => activeStates.unorderedList,
  },
  orderedList: {
    id: 'orderedList',
    label: labels.orderedList,
    icon: ListOrdered,
    shortcut: 'Ctrl+Shift+7',
    action: commands => commands.toggleOrderedList(),
    isActive: activeStates => activeStates.orderedList,
  },
  blockquote: {
    id: 'blockquote',
    label: labels.blockquote,
    icon: Quote,
    shortcut: 'Ctrl+Shift+B',
    action: commands => commands.toggleQuote(),
    isActive: activeStates => activeStates.isQuote,
  },
  codeBlock: {
    id: 'codeBlock',
    label: labels.codeBlock,
    icon: Code2,
    shortcut: 'Ctrl+Alt+C',
    action: commands => commands.toggleCodeBlock(),
    isActive: activeStates => activeStates.isInCodeBlock,
  },
  horizontalRule: {
    id: 'horizontalRule',
    label: labels.horizontalRule,
    icon: Minus,
    action: commands => commands.insertHorizontalRule(),
  },
  link: {
    id: 'link',
    label: labels.link,
    icon: Link2,
    shortcut: 'Ctrl+K',
    action: () => {},
    isActive: activeStates => activeStates.isLink,
  },
  image: {
    id: 'image',
    label: labels.image,
    icon: ImageIcon,
    action: () => {},
  },
  table: {
    id: 'table',
    label: labels.table,
    icon: Table,
    action: commands => commands.insertTable({ rows: 3, columns: 3, includeHeaders: true }),
  },
  undo: {
    id: 'undo',
    label: labels.undo,
    icon: Undo,
    shortcut: 'Ctrl+Z',
    action: commands => commands.undo(),
    canExecute: activeStates => activeStates.canUndo,
  },
  redo: {
    id: 'redo',
    label: labels.redo,
    icon: Redo,
    shortcut: 'Ctrl+Shift+Z',
    action: commands => commands.redo(),
    canExecute: activeStates => activeStates.canRedo,
  },
})

/**
 * Presets de toolbar para distintos casos de uso.
 * Cada preset define qué herramientas se muestran en la barra.
 */
export const EDITOR_PRESETS: Record<TEditorPreset, TToolbarItem[]> = {
  /** Solo texto básico: negrita, cursiva y enlace */
  minimal: ['bold', 'italic', 'separator', 'link'],

  /** Para campos de comentarios: formato básico + código */
  comment: ['bold', 'italic', 'strike', 'separator', 'link', 'code'],

  /** Editor estándar para artículos y contenido */
  standard: [
    'bold',
    'italic',
    'strike',
    'separator',
    'heading1',
    'heading2',
    'heading3',
    'separator',
    'bulletList',
    'orderedList',
    'separator',
    'blockquote',
    'code',
    'separator',
    'link',
    'image',
    'table',
    'separator',
    'undo',
    'redo',
  ],

  /** Todas las herramientas disponibles */
  full: [
    'bold',
    'italic',
    'strike',
    'separator',
    'heading1',
    'heading2',
    'heading3',
    'separator',
    'bulletList',
    'orderedList',
    'separator',
    'blockquote',
    'code',
    'codeBlock',
    'horizontalRule',
    'separator',
    'link',
    'image',
    'table',
    'separator',
    'undo',
    'redo',
  ],
}

/**
 * Preset por defecto cuando no se especifica ninguno.
 */
export const DEFAULT_EDITOR_PRESET: TEditorPreset = 'standard'

/**
 * Niveles de heading por defecto.
 */
export const DEFAULT_HEADING_LEVELS: (1 | 2 | 3)[] = [1, 2, 3]

/**
 * Placeholder por defecto del editor.
 */
export const DEFAULT_PLACEHOLDER = 'Escribe algo...'

/**
 * Altura mínima por defecto del editor.
 */
export const DEFAULT_MIN_HEIGHT = '150px'
