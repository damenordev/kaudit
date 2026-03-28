/**
 * Tipos para el contenido de archivo en una auditoría.
 */
export interface IFileContent {
  path: string
  language: string
  baseContent: string
  headContent: string
  baseRef: string
  headRef: string
}
