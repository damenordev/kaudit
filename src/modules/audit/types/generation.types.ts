/**
 * Tipos para el sistema de generación de contenido.
 * Define la estructura del contenido generado para PRs y docstrings.
 */

import type { ITokenUsage } from './validation.types'

// Interface para el contenido generado por el motor de auditoría
export interface IGeneratedContent {
  /** Título sugerido para el Pull Request */
  title: string
  /** Resumen ejecutivo de los cambios */
  summary: string
  /** Lista detallada de los cambios realizados */
  changes: string[]
  /** Sugerencias y recomendaciones adicionales */
  suggestions: string[]
  /** Checklist de verificación para el revisor */
  checklist: string[]
  /** Markdown crudo generado (para uso interno) */
  rawMarkdown?: string
  /** Uso de tokens de la llamada a IA (opcional) */
  tokenUsage?: ITokenUsage
}

/** Resultado de generar un docstring JSDoc para una función */
export interface IDocstringResult {
  /** Ruta del archivo que contiene la función */
  filePath: string
  /** Nombre de la función sin docstring */
  functionName: string
  /** Número de línea donde empieza la función */
  line: number
  /** Bloque JSDoc completo generado para la función */
  docstring: string
  /** Lenguaje del archivo fuente */
  language: 'typescript' | 'javascript'
}

/** Frameworks de testing soportados */
export type TTestFramework = 'vitest' | 'jest'

/** Representa un test unitario generado por IA */
export interface IGeneratedTest {
  /** Ruta del archivo original al que pertenece el test */
  filePath: string
  /** Ruta sugerida para el archivo de test */
  testFilePath: string
  /** Código completo del test generado */
  testCode: string
  /** Framework de testing utilizado */
  framework: TTestFramework
  /** Descripción de qué cubre el test */
  description: string
}
