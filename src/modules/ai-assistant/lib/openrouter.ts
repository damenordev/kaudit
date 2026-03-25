import 'server-only'

import { createOpenRouter } from '@openrouter/ai-sdk-provider'

import { env } from '@/env'

/**
 * Instancia de OpenRouter para interactuar con modelos de IA.
 * Solo disponible en el servidor.
 */
export const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
})
