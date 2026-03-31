/**
 * Servicio de validación de código con IA.
 * Analiza git diffs para detectar problemas de seguridad.
 */
import 'server-only'

import { generateText, Output } from 'ai'

import { getAIProvider } from '@/core/config/ai.config'

import { validationPrompt, validationSchema } from '../lib/prompts/validation.prompt'
import type { IValidationResult } from '../types'

/**
 * Valida un git diff buscando problemas de seguridad.
 * Usa GPT-4o-mini para un análisis rápido y eficiente.
 *
 * @param gitDiff - El diff del código a validar
 * @returns Resultado de la validación con issues detectados
 * @throws Error si el modelo de IA falla
 */
export async function validateGitDiff(gitDiff: string): Promise<IValidationResult> {
  // Caso edge: diff vacío
  if (!gitDiff || gitDiff.trim().length === 0) {
    return {
      isValid: true,
      issues: [],
      analyzedAt: new Date(),
    }
  }

  const result = await generateText({
    model: getAIProvider(),
    output: Output.object({ schema: validationSchema }),
    prompt: validationPrompt(gitDiff),
  })

  // Registrar uso de tokens en el servidor
  console.log(
    `[Validation] Tokens: ${result.usage.totalTokens ?? 0} (input: ${result.usage.inputTokens ?? 0}, output: ${result.usage.outputTokens ?? 0})`
  )

  return {
    ...result.output,
    analyzedAt: new Date(),
    tokenUsage: {
      inputTokens: result.usage.inputTokens ?? 0,
      outputTokens: result.usage.outputTokens ?? 0,
      totalTokens: result.usage.totalTokens ?? 0,
    },
  }
}

/**
 * Determina si un resultado de validación tiene problemas críticos.
 * @param result - Resultado de validación
 * @returns true si hay problemas críticos o de severidad alta
 */
export function hasCriticalIssues(result: IValidationResult): boolean {
  return result.issues.some(issue => issue.severity === 'critical' || issue.severity === 'high')
}

/**
 * Filtra issues por severidad mínima.
 * @param result - Resultado de validación
 * @param minSeverity - Severidad mínima a incluir
 * @returns Issues filtrados
 */
export function filterIssuesBySeverity(
  result: IValidationResult,
  minSeverity: 'critical' | 'high' | 'medium' | 'low'
): IValidationResult['issues'] {
  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
  const minLevel = severityOrder[minSeverity]

  return result.issues.filter(issue => severityOrder[issue.severity] >= minLevel)
}
