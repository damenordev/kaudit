import 'server-only'

import { createRequesty } from '@requesty/ai-sdk'

import { env } from '@/env'

/**
 * Instancia de Requesty para interactuar con modelos de IA.
 * Solo disponible en el servidor.
 */
export const requesty = createRequesty({
  apiKey: env.REQUESTY_API_KEY,
})
