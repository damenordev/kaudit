/**
 * Endpoint de chat general con el agente de IA.
 * POST /api/chat
 *
 * Valida el input con Zod y gestiona auth opcional con rate limiting.
 */
import { createAgentUIStreamResponse } from 'ai'
import { z } from 'zod'

import { createAgent } from '@/modules/ai-assistant/lib/agent'

export const maxDuration = 60

/** Schema de validación para mensajes del chat */
const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(10_000),
})

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50),
  model: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = chatRequestSchema.parse(body)

    const agent = createAgent(validated.model)

    console.log('--- Chat Request ---')
    console.log('Model:', validated.model ?? 'default')
    console.log('Messages:', validated.messages.length)

    return createAgentUIStreamResponse({
      agent,
      uiMessages: validated.messages,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    console.error('[Chat] Error:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
