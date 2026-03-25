import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { TLexKitCommands, TLexKitActiveStates, TLexKitEditorContext } from './lexkit.system'

/**
 * Identificadores de herramientas disponibles en la barra del editor.
 * Usa 'separator' para insertar un divisor visual entre grupos.
 */
export type TToolbarItem =
  | 'bold'
  | 'italic'
  | 'strike'
  | 'code'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'codeBlock'
  | 'horizontalRule'
  | 'link'
  | 'image'
  | 'table'
  | 'undo'
  | 'redo'
  | 'separator'

/**
 * Presets predefinidos del editor.
 * - `minimal`: Solo texto enriquecido básico (negrita, cursiva, enlace).
 * - `comment`: Ideal para campos de comentarios cortos.
 * - `standard`: Editor completo para artículos y contenido general.
 * - `full`: Todas las herramientas disponibles, incluido imágenes y bloques de código.
 */
export type TEditorPreset = 'minimal' | 'comment' | 'standard' | 'full'

/**
 * Formato de salida del contenido del editor.
 * - `html`: Devuelve HTML como string (por defecto).
 * - `markdown`: Devuelve el documento en formato Markdown.
 * - `json`: Devuelve el documento en formato JSON.
 * - `text`: Devuelve solo texto plano sin formato.
 */
export type TOutputFormat = 'html' | 'markdown' | 'json' | 'text'

/**
 * Configuración interna de un ítem de toolbar.
 * Define cómo se renderiza y comporta cada botón.
 */
export interface IToolbarItemConfig {
  /** Identificador único del ítem */
  id: TToolbarItem
  /** Texto descriptivo para el tooltip */
  label: string
  /** Icono de Lucide a mostrar */
  icon: LucideIcon
  /** Atajo de teclado (para mostrar en tooltip) */
  shortcut?: string
  /** Acción a ejecutar al hacer click. */
  action: (commands: TLexKitCommands) => void
  /** Determina si el ítem está activo (para toggles) */
  isActive?: (activeStates: TLexKitActiveStates, editorContext: TLexKitEditorContext) => boolean
  /** Determina si el ítem se puede ejecutar */
  canExecute?: (activeStates: TLexKitActiveStates, editorContext: TLexKitEditorContext) => boolean
}

/**
 * Configuración personalizada del editor.
 * Permite sobreescribir el preset con opciones específicas.
 */
export interface IEditorConfig {
  /** Lista de herramientas a mostrar en la barra */
  toolbar?: TToolbarItem[]
  /** Extensiones adicionales de LexKit a nivel local */
  extensions?: any[]
  /** Niveles de heading permitidos */
  headingLevels?: (1 | 2 | 3 | 4 | 5 | 6)[]
  /** Formato de salida del contenido */
  output?: TOutputFormat
  /** Permite insertar imágenes como base64 (default: false). Usar false para evitar bloat en JSON y configurar onImageUpload para uploads reales. */
  allowBase64?: boolean
}

/**
 * Props del componente Editor.
 */
export interface IEditorProps {
  /** Contenido actual del editor (HTML string por defecto) */
  value?: string
  /** Callback cuando el contenido cambia */
  onChange?: (value: string) => void
  /** Preset de configuración predefinido */
  preset?: TEditorPreset
  /** Configuración personalizada (sobreescribe el preset) */
  config?: IEditorConfig
  /** Placeholder del editor cuando está vacío */
  placeholder?: string
  /** Si el editor es editable */
  editable?: boolean
  /** Si se muestra la barra de herramientas */
  showToolbar?: boolean
  /** Altura mínima del área de edición en CSS */
  minHeight?: string
  /** Altura máxima del área de edición en CSS (activa scroll) */
  maxHeight?: string
  /** Clase CSS del contenedor principal */
  className?: string
  /** Clase CSS del área de contenido del editor */
  contentClassName?: string
  /** Clase CSS de la barra de herramientas */
  toolbarClassName?: string
  /** Callback al inicializar el editor */
  onEditorReady?: () => void
  /** Etiqueta de accesibilidad */
  'aria-label'?: string
  /** Indica estado inválido para accesibilidad */
  'aria-invalid'?: boolean
  /** ID del elemento que describe el editor */
  'aria-describedby'?: string
  /** Callback para upload de imágenes */
  onImageUpload?: (file: File) => Promise<string>
}

/**
 * Props del componente EditorToolbar.
 */
export interface IEditorToolbarProps {
  /** Lista de ítems a mostrar en la toolbar */
  items: TToolbarItem[]
  /** Sobrescribe la acción de un ítem (ej. abrir diálogo en lugar de prompt) */
  actionOverrides?: Partial<Record<TToolbarItem, (commands: TLexKitCommands) => void>>
  /** Clase CSS adicional */
  className?: string
}

/**
 * Props del componente EditorToolbarButton.
 */
export interface IEditorToolbarButtonProps {
  /** Callback al hacer click */
  onClick: () => void
  /** Si el botón está en estado activo (toggle) */
  isActive?: boolean
  /** Si el botón está deshabilitado */
  isDisabled?: boolean
  /** Texto del tooltip */
  tooltip: string
  /** Atajo de teclado (mostrado en tooltip) */
  shortcut?: string
  /** Contenido del botón (icono) */
  children: ReactNode
}
