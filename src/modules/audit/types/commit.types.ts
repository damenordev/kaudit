/**
 * Tipos para el sistema de commits de auditoría.
 * Define la estructura de commits y autores para el análisis.
 */

/** Información del autor de un commit */
export interface ICommitAuthor {
  /** Nombre del autor */
  name: string
  /** Email del autor */
  email: string
  /** URL del avatar del autor (opcional) */
  avatar?: string
}

/** Representa un commit en el contexto de una auditoría */
export interface IAuditCommit {
  /** SHA del commit (hash completo) */
  sha: string
  /** Mensaje del commit */
  message: string
  /** Información del autor del commit */
  author: ICommitAuthor
  /** Fecha del commit en formato ISO 8601 */
  date: string
  /** Lista de rutas de archivos modificados en este commit */
  files: string[]
}
