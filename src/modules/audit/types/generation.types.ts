/**
 * Tipos para el sistema de generación de contenido.
 * Define la estructura del contenido generado para PRs.
 */

import type { ITokenUsage } from './validation.types'

// Interface para el contenido generado por el motor de auditoría
export interface IGeneratedContent {
  /** Título sugerido para el Pull Request */
  title: string
  /** Resumen ejecutivo de los cambios */
  summary: string
  /** Descripción detallada de los cambios realizados */
  changes: string
  /** Sugerencias y recomendaciones adicionales */
  suggestions: string
  /** Checklist de verificación para el revisor */
  checklist: string
  /** Markdown cruto generado (para uso interno) */
  rawMarkdown?: string
  /** Uso de tokens de la llamada a IA (opcional) */
  tokenUsage?: ITokenUsage
}
