/**
 * Utilidad para validar diffs divididos en chunks y mergear resultados.
 * Cada chunk se valida independientemente con retry y los issues se combinan.
 */
import { generateText, Output } from 'ai'

import { AI_HEAVY_CALL_TIMEOUT_MS, getHeavyModelInstance } from '@/core/config/ai.config'

import type { IValidationResult, ITokenUsage } from '../types'
import { validationPrompt, validationSchema } from './prompts/validation.prompt'

const MAX_RETRIES = 2
const RETRY_SCALE_FACTOR = 0.6
const MAX_OUTPUT_TOKENS = 8192

/** Resultado parcial de un chunk individual */
interface IChunkResult {
  isValid: boolean
  issues: IValidationResult['issues']
  tokenUsage: ITokenUsage
  /** Indica si el chunk falló después de todos los reintentos */
  failed: boolean
}

/** Ejecuta un intento de validación con un chunk de diff. */
async function attemptValidation(safeDiff: string) {
  return generateText({
    model: getHeavyModelInstance(),
    output: Output.object({ schema: validationSchema }),
    prompt: validationPrompt(safeDiff),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    abortSignal: AbortSignal.timeout(AI_HEAVY_CALL_TIMEOUT_MS),
  })
}

/** Resultado vacío para chunks fallidos */
const FAILED_CHUNK: IChunkResult = {
  isValid: true,
  issues: [],
  tokenUsage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
  failed: true,
}

/**
 * Valida un chunk individual con reintentos progresivos.
 * En cada retry trunca el chunk para reducir tamaño.
 */
async function validateSingleChunk(chunk: string, chunkIndex: number): Promise<IChunkResult> {
  let scaleFactor = 1.0

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
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
        failed: false,
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      console.warn(`[ValidateChunks] Chunk ${chunkIndex} intento ${attempt + 1} falló: ${msg}`)

      if (attempt < MAX_RETRIES) {
        scaleFactor *= RETRY_SCALE_FACTOR
        console.log(`[ValidateChunks] Chunk ${chunkIndex} reintentando al ${(scaleFactor * 100).toFixed(0)}%`)
        continue
      }
      console.warn(`[ValidateChunks] Chunk ${chunkIndex} falló definitivamente, marcando como fallido`)
      return FAILED_CHUNK
    }
  }

  return FAILED_CHUNK
}

/**
 * Valida múltiples chunks de diff y mergea los resultados.
 * Ejecuta cada chunk en paralelo con retry individual.
 * Si TODOS los chunks fallan, lanza error para propagar fallo al workflow.
 */
export async function validateChunks(chunks: string[]): Promise<IValidationResult> {
  if (chunks.length === 1) {
    const single = await validateSingleChunk(chunks[0] as string, 1)
    console.log(`[ValidateChunks] 1/1 completado — ${single.issues.length} issues encontrados`)

    if (single.failed) {
      throw new Error('All validation chunks failed — AI model unavailable or timeout exceeded')
    }
    return { isValid: single.isValid, issues: single.issues, analyzedAt: new Date(), tokenUsage: single.tokenUsage }
  }

  console.log(`[ValidateChunks] Procesando ${chunks.length} chunks en paralelo`)

  const chunkResults = await Promise.all(
    chunks.map((chunk, index) =>
      validateSingleChunk(chunk, index + 1).then(result => {
        console.log(`[ValidateChunks] Chunk ${index + 1}/${chunks.length} — ${result.issues.length} issues`)
        return result
      })
    )
  )

  const failedCount = chunkResults.filter(r => r.failed).length

  if (failedCount === chunks.length) {
    throw new Error('All validation chunks failed — AI model unavailable or timeout exceeded')
  }
  if (failedCount > 0) {
    console.warn(
      `[ValidateChunks] ${failedCount}/${chunks.length} chunks fallaron — continuando con resultados parciales`
    )
  }

  const successful = chunkResults.filter(r => !r.failed)
  const globalIsValid = successful.every(r => r.isValid)
  const allIssues = successful.flatMap(r => r.issues)
  const totalUsage: ITokenUsage = successful.reduce(
    (acc, r) => ({
      inputTokens: acc.inputTokens + r.tokenUsage.inputTokens,
      outputTokens: acc.outputTokens + r.tokenUsage.outputTokens,
      totalTokens: acc.totalTokens + r.tokenUsage.totalTokens,
    }),
    { inputTokens: 0, outputTokens: 0, totalTokens: 0 }
  )

  console.log(`[ValidateChunks] Completado: ${chunks.length} chunks, ${allIssues.length} issues totales`)
  return { isValid: globalIsValid, issues: allIssues, analyzedAt: new Date(), tokenUsage: totalUsage }
}
