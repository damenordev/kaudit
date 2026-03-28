/**
 * Tipos para la integración con GitHub API.
 * Define las opciones y resultados para operaciones de PR.
 */

// Interface para las opciones de creación de un Pull Request
export interface IGitHubPrOptions {
  /** Propietario del repositorio (owner) */
  owner: string
  /** Nombre del repositorio */
  repo: string
  /** Título del Pull Request */
  title: string
  /** Branch origen (head) */
  head: string
  /** Branch destino (base) */
  base: string
  /** Cuerpo/descripción del Pull Request */
  body: string
}

// Interface para el resultado de crear un Pull Request
export interface IGitHubPrResult {
  /** Número del PR creado */
  prNumber: number
  /** URL del PR creado */
  prUrl: string
  /** Fecha de creación */
  created: Date
}
