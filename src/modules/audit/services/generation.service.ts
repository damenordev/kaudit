/**
 * Servicio de generación de contenido para PRs con IA.
 * Genera descripciones profesionales usando Claude 3.5 Sonnet.
 * Incluye retry con re-truncado progresivo si el modelo falla.
 */
import 'server-only'

import { generateText, Output } from 'ai'

import { AI_HEAVY_CALL_TIMEOUT_MS, getHeavyModel } from '@/core/config/ai.config'

import { generationPrompt, generationSchema } from '../lib/prompts/generation.prompt'
import { truncateDiffForModel } from '../lib/truncate-diff.utils'
import type { IGeneratedContent, IValidationResult } from '../types'

/** Máximo de reintentos cuando la generación falla */
const MAX_RETRIES = 2

/** Factor de reducción del diff en cada retry */
const RETRY_SCALE_FACTOR = 0.6

/**
 * Genera una descripción de PR basada en el diff y validación.
 * Trunca el diff automáticamente si excede el contexto del modelo.
 * Reintenta con diff más pequeño si la generación falla.
 *
 * @param gitDiff - El diff del código
 * @param validationResult - Resultado de la validación previa
 * @returns Contenido generado para el PR
 */
export async function generatePrDescription(
  gitDiff: string,
  validationResult: IValidationResult
): Promise<IGeneratedContent> {
  // Caso edge: diff vacío
  if (!gitDiff || gitDiff.trim().length === 0) {
    return buildFallbackContent()
  }

  const issuesContext = validationResult.issues.map(i => ({
    type: i.type,
    severity: i.severity,
    message: i.message,
  }))

  let scaleFactor = 1.0

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const safeDiff = truncateDiffForModel(gitDiff, undefined, scaleFactor)

      const result = await generateText({
        model: getHeavyModel(),
        output: Output.object({ schema: generationSchema }),
        prompt: generationPrompt(safeDiff, {
          isValid: validationResult.isValid,
          issues: issuesContext,
        }),
        abortSignal: AbortSignal.timeout(AI_HEAVY_CALL_TIMEOUT_MS),
      })

      console.log(
        `[Generation] Tokens: ${result.usage.totalTokens ?? 0} (input: ${result.usage.inputTokens ?? 0}, output: ${result.usage.outputTokens ?? 0})` +
          (attempt > 0 ? ` [retry ${attempt}]` : '')
      )

      // Validar que el contenido no esté vacío
      if (!result.output.title?.trim()) {
        throw new Error('El modelo generó un título vacío')
      }

      const rawMarkdown = buildRawMarkdown(result.output)

      return {
        ...result.output,
        rawMarkdown,
        tokenUsage: {
          inputTokens: result.usage.inputTokens ?? 0,
          outputTokens: result.usage.outputTokens ?? 0,
          totalTokens: result.usage.totalTokens ?? 0,
        },
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      console.warn(`[Generation] Intento ${attempt + 1} falló: ${msg}`)

      if (attempt < MAX_RETRIES) {
        scaleFactor *= RETRY_SCALE_FACTOR
        console.log(`[Generation] Reintentando con scaleFactor ${(scaleFactor * 100).toFixed(0)}%`)
        continue
      }

      // Todos los reintentos fallaron — retornar fallback
      console.warn('[Generation] Todos los reintentos fallaron, retornando contenido fallback')
      return buildFallbackContent()
    }
  }

  return buildFallbackContent()
}

/**
 * Construye contenido fallback mínimo cuando la generación falla.
 */
function buildFallbackContent(): IGeneratedContent {
  return {
    title: 'Changes detected',
    summary: 'Automated description generation failed. Please review the diff manually.',
    changes: ['- Review the git diff for details'],
    suggestions: ['Consider running the audit again later'],
    checklist: ['- [ ] Review the diff manually'],
  }
}

/**
 * Construye el markdown crudo a partir del objeto generado.
 */
function buildRawMarkdown(content: {
  title: string
  summary: string
  changes: string[]
  suggestions: string[]
  checklist: string[]
}): string {
  return `# ${content.title}

## Summary
${content.summary}

## Changes
${content.changes.join('\n')}

## Suggestions
${content.suggestions.join('\n')}

## Checklist
${content.checklist.join('\n')}
`
}

/**
 * Genera el cuerpo completo del PR en formato Markdown.
 * @param content - Contenido generado
 * @returns String con el cuerpo del PR formateado
 */
export function buildPrBody(content: IGeneratedContent): string {
  return content.rawMarkdown ?? buildRawMarkdown(content)
}
