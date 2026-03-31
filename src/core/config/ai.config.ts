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
