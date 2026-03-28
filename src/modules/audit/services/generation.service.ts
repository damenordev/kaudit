/**
 * Servicio de generación de contenido para PRs con IA.
 * Genera descripciones profesionales usando Claude 3.5 Sonnet.
 */
import 'server-only'

import { generateText, Output } from 'ai'

import { openrouter } from '@/modules/ai-assistant/lib/openrouter'

import { generationPrompt, generationSchema } from '../lib/prompts/generation.prompt'
import type { IGeneratedContent, IValidationResult } from '../types'

/**
 * Genera una descripción de PR basada en el diff y validación.
 * Usa Claude 3.5 Sonnet para generar contenido de alta calidad.
 *
 * @param gitDiff - El diff del código
 * @param validationResult - Resultado de la validación previa
 * @returns Contenido generado para el PR
 * @throws Error si el modelo de IA falla
 */
export async function generatePrDescription(
  gitDiff: string,
  validationResult: IValidationResult
): Promise<IGeneratedContent> {
  // Caso edge: diff vacío
  if (!gitDiff || gitDiff.trim().length === 0) {
    return {
      title: 'Empty changes',
      summary: 'No changes detected in the diff.',
      changes: 'No changes to describe.',
      suggestions: 'Please ensure the diff contains actual changes.',
      checklist: '- [ ] Verify the diff is not empty',
    }
  }

  const result = await generateText({
    model: openrouter('openrouter/free'),
    output: Output.object({ schema: generationSchema }),
    prompt: generationPrompt(gitDiff, {
      isValid: validationResult.isValid,
      issues: validationResult.issues.map(i => ({
        type: i.type,
        severity: i.severity,
        message: i.message,
      })),
    }),
  })

  // Registrar uso de tokens en el servidor
  console.log(
    `[Generation] Tokens: ${result.usage.totalTokens ?? 0} (input: ${result.usage.inputTokens ?? 0}, output: ${result.usage.outputTokens ?? 0})`
  )

  // Construir el markdown crudo para uso interno
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
}

/**
 * Construye el markdown crudo a partir del objeto generado.
 */
function buildRawMarkdown(content: {
  title: string
  summary: string
  changes: string
  suggestions: string
  checklist: string
}): string {
  return `# ${content.title}

## Summary
${content.summary}

## Changes
${content.changes}

## Suggestions
${content.suggestions}

## Checklist
${content.checklist}
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
