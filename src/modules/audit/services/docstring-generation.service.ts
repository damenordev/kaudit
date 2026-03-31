/**
 * Servicio de generación automática de docstrings JSDoc.
 * Analiza archivos modificados y genera documentación en español
 * para funciones que carecen de ella.
 */
import 'server-only'

import { generateText, Output } from 'ai'

import { AI_CALL_TIMEOUT_MS, getLightModel } from '@/core/config/ai.config'

import { docstringGenerationPrompt, docstringResponseSchema } from '../lib/prompts/docstring-generation.prompt'
import type { IChangedFile, IDocstringResult } from '../types'

/** Lenguajes soportados para generación de docstrings */
const SUPPORTED_LANGUAGES = new Set(['typescript', 'javascript', 'ts', 'js'])

/**
 * Normaliza el lenguaje del archivo al formato esperado.
 * @param language - Lenguaje crudo del diff
 * @returns Lenguaje normalizado o null si no es soportado
 */
function normalizeLanguage(language: string): 'typescript' | 'javascript' | null {
  const normalized = language.toLowerCase().trim()
  return SUPPORTED_LANGUAGES.has(normalized)
    ? normalized === 'ts'
      ? 'typescript'
      : normalized === 'js'
        ? 'javascript'
        : (normalized as 'typescript' | 'javascript')
    : null
}

/**
 * Extrae el código fuente añadido del diff de un archivo.
 * Solo considera líneas añadidas para no documentar código eliminado.
 * @param file - Archivo modificado con hunks
 * @returns Código fuente de las líneas añadidas
 */
function extractAddedSource(file: IChangedFile): string {
  const addedLines = file.hunks.flatMap(hunk =>
    hunk.changes.filter(change => change.type === 'add').map(change => change.content)
  )
  return addedLines.join('\n')
}

/**
 * Genera docstrings JSDoc para las funciones sin documentar
 * en un archivo modificado del diff.
 *
 * @param file - Archivo modificado con diff y hunks
 * @returns Lista de docstrings generados para el archivo
 */
export async function generateDocstrings(file: IChangedFile): Promise<IDocstringResult[]> {
  const language = normalizeLanguage(file.language)
  if (!language) return []

  const sourceCode = extractAddedSource(file)
  if (sourceCode.trim().length === 0) return []

  try {
    const result = await generateText({
      model: getLightModel(),
      output: Output.object({ schema: docstringResponseSchema }),
      prompt: docstringGenerationPrompt(sourceCode, file.path, language),
      abortSignal: AbortSignal.timeout(AI_CALL_TIMEOUT_MS),
    })

    console.log(
      `[Docstrings] ${file.path}: ${result.output.docstrings.length} docstrings generados ` +
        `(${result.usage.totalTokens ?? 0} tokens)`
    )

    return result.output.docstrings
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error(`[Docstrings] Error generando para ${file.path}: ${message}`)
    return []
  }
}
