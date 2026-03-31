/**
 * Tipos para el sistema de análisis de diffs.
 * Define la estructura de archivos modificados, hunks y cambios de línea.
 */

/** Estado de un archivo en el diff */
export type TFileStatus = 'added' | 'modified' | 'deleted' | 'renamed'

/** Tipo de cambio en una línea individual */
export type TLineChangeType = 'add' | 'del' | 'normal'

/** Representa un cambio en una línea individual del diff */
export interface ILineChange {
  /** Tipo de cambio: add (añadida), del (eliminada), normal (sin cambios) */
  type: TLineChangeType
  /** Número de línea en el archivo original (opcional para líneas añadidas) */
  oldLineNumber?: number
  /** Número de línea en el archivo nuevo (opcional para líneas eliminadas) */
  newLineNumber?: number
  /** Contenido de la línea */
  content: string
}

/** Representa un hunk (bloque de cambios) dentro de un archivo */
export interface IHunk {
  /** Línea de inicio en el archivo original */
  oldStart: number
  /** Cantidad de líneas en el archivo original */
  oldLines: number
  /** Línea de inicio en el archivo modificado */
  newStart: number
  /** Cantidad de líneas en el archivo modificado */
  newLines: number
  /** Contenido completo del hunk incluyendo header */
  content: string
  /** Lista de cambios individuales de línea */
  changes: ILineChange[]
}

/** Representa un archivo modificado en el diff */
export interface IChangedFile {
  /** Ruta del archivo en el repositorio */
  path: string
  /** Lenguaje de programación detectado */
  language: string
  /** Cantidad de líneas añadidas */
  additions: number
  /** Cantidad de líneas eliminadas */
  deletions: number
  /** Estado del archivo en el diff */
  status: TFileStatus
  /** Contenido completo del diff del archivo */
  diff: string
  /** Lista de hunks (bloques de cambios) */
  hunks: IHunk[]
  /** Cantidad de issues detectados en este archivo */
  issueCount: number
  /** SHA del commit que modificó este archivo */
  commitSha: string
}
