/**
 * Utilidad para validar diffs divididos en chunks y mergear resultados.
 * Cada chunk se valida independientemente con retry y los issues se combinan.
 */
import { generateText, Output } from 'ai'

import { getAIProvider } from '@/core/config/ai.config'

import type { IValidationResult, ITokenUsage } from '../types'
import { validationPrompt, validationSchema } from './prompts/validation.prompt'

/** Máximo de reintentos cuando un chunk falla */
const MAX_RETRIES = 2

/** Factor de reducción del diff en cada retry */
const RETRY_SCALE_FACTOR = 0.6

/** Tokens de output para respuestas con muchos issues */
const MAX_OUTPUT_TOKENS = 8192

/** Resultado parcial de un chunk individual */
interface IChunkResult {
  isValid: boolean
  issues: IValidationResult['issues']
  tokenUsage: ITokenUsage
}

/**
 * Ejecuta un intento de validación con un chunk de diff.
 */
async function attemptValidation(safeDiff: string) {
  return generateText({
    model: getAIProvider(),
    output: Output.object({ schema: validationSchema }),
    prompt: validationPrompt(safeDiff),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
  })
}

/**
 * Valida un chunk individual con reintentos progresivos.
 * En cada retry trunca el chunk para reducir tamaño.
 */
async function validateSingleChunk(chunk: string, chunkIndex: number): Promise<IChunkResult> {
  let scaleFactor = 1.0

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Truncar chunk si scaleFactor lo reduce
      const effectiveDiff = scaleFactor < 1.0 ? chunk.slice(0, Math.floor(chunk.length * scaleFactor)) : chunk

      const result = await attemptValidation(effectiveDiff)

      console.log(
        `[ValidateChunks] Chunk ${chunkIndex} — Tokens: ${result.usage.totalTokens ?? 0}` +
          (attempt > 0 ? ` [retry ${attempt}]` : '')
      )

      return {
        isValid: result.output.isValid,
        issues: result.output.issues,
        tokenUsage: {
          inputTokens: result.usage.inputTokens ?? 0,
          outputTokens: result.usage.outputTokens ?? 0,
          totalTokens: result.usage.totalTokens ?? 0,
        },
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      console.warn(`[ValidateChunks] Chunk ${chunkIndex} intento ${attempt + 1} falló: ${msg}`)

      if (attempt < MAX_RETRIES) {
        scaleFactor *= RETRY_SCALE_FACTOR
        console.log(`[ValidateChunks] Chunk ${chunkIndex} reintentando al ${(scaleFactor * 100).toFixed(0)}%`)
        continue
      }

      // Todos los reintentos fallaron — retornar vacío para este chunk
      console.warn(`[ValidateChunks] Chunk ${chunkIndex} falló definitivamente, omitiendo`)
      return { isValid: true, issues: [], tokenUsage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 } }
    }
  }

  return { isValid: true, issues: [], tokenUsage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 } }
}

/**
 * Valida múltiples chunks de diff y mergea los resultados.
 * Ejecuta cada chunk secuencialmente con retry individual.
 *
 * @param chunks - Array de diffs (un chunk por llamada al modelo)
 * @returns Resultado combinado con todos los issues encontrados
 */
export async function validateChunks(chunks: string[]): Promise<IValidationResult> {
  // Un solo chunk: comportamiento directo
  if (chunks.length === 1) {
    const single = await validateSingleChunk(chunks[0] as string, 1)
    console.log(`[ValidateChunks] 1/1 completado — ${single.issues.length} issues encontrados`)
    return { isValid: single.isValid, issues: single.issues, analyzedAt: new Date(), tokenUsage: single.tokenUsage }
  }

  console.log(`[ValidateChunks] Procesando diff en ${chunks.length} chunks`)

  const allIssues: IValidationResult['issues'] = []
  let globalIsValid = true
  const totalUsage: ITokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 }

  for (let i = 0; i < chunks.length; i++) {
    const chunkResult = await validateSingleChunk(chunks[i] as string, i + 1)

    if (!chunkResult.isValid) globalIsValid = false
    allIssues.push(...chunkResult.issues)
    totalUsage.inputTokens += chunkResult.tokenUsage.inputTokens
    totalUsage.outputTokens += chunkResult.tokenUsage.outputTokens
    totalUsage.totalTokens += chunkResult.tokenUsage.totalTokens

    console.log(
      `[ValidateChunks] Chunk ${i + 1}/${chunks.length} completado — ${chunkResult.issues.length} issues encontrados`
    )
  }

  console.log(`[ValidateChunks] Completado: ${chunks.length} chunks procesados, ${allIssues.length} issues totales`)

  return { isValid: globalIsValid, issues: allIssues, analyzedAt: new Date(), tokenUsage: totalUsage }
}
