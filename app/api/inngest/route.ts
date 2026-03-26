/**
 * Webhook handler para Inngest.
 * Recibe eventos del Inngest server y los procesa.
 */
import { serve } from 'inngest/next'

import { inngest, functions } from '@/core/lib/inngest'

export const maxDuration = 60

// Handler de Inngest para Next.js
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
})
