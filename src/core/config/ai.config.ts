/**
 * Configuración centralizada del modelo de IA.
 * Permite cambiar el modelo desde una variable de entorno.
 */
import 'server-only'

import { openrouter } from '@/modules/ai-assistant/lib/openrouter'

/** Modelos disponibles a través de OpenRouter */
export const AI_MODELS = {
  free: 'openrouter/free',
  gpt4: 'openai/gpt-4o-mini',
  claude: 'anthropic/claude-3.5-sonnet',
  deepseek: 'deepseek/deepseek-chat',
} as const

export type TAIModelId = (typeof AI_MODELS)[keyof typeof AI_MODELS]

/** Límites de contexto del modelo para cálculos de truncamiento */
export const MODEL_CONTEXT_LIMITS = {
  /** Contexto máximo total del modelo (tokens) */
  maxContextTokens: 262_144,
  /** Tokens reservados para la respuesta del modelo (JSON schema pequeño) */
  reservedOutputTokens: 4_096,
  /** Tokens reservados para el prompt template (instrucciones sin diff) */
  reservedPromptTokens: 1_024,
  /** Margen de seguridad para evitar overflow por 1-2 tokens */
  safetyMargin: 512,
} as const

/**
 * Calcula el presupuesto máximo de tokens para el diff de entrada.
 * Resta output, prompt template y margen de seguridad al contexto total.
 */
export function getMaxDiffInputTokens(): number {
  const { maxContextTokens, reservedOutputTokens, reservedPromptTokens, safetyMargin } = MODEL_CONTEXT_LIMITS
  return maxContextTokens - reservedOutputTokens - reservedPromptTokens - safetyMargin
}

/**
 * Retorna el modelo de IA configurado.
 * Lee de la env var AI_MODEL, con default 'openrouter/free'.
 */
export function getAIModel(): TAIModelId {
  const modelFromEnv = process.env.AI_MODEL as TAIModelId | undefined
  return modelFromEnv ?? AI_MODELS.free
}

/**
 * Retorna la instancia del modelo de IA listo para usar.
 * Encapsula la selección del provider según el modelo configurado.
 */
export function getAIProvider() {
  return openrouter(getAIModel())
}
