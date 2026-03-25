import { createAgentUIStreamResponse } from 'ai'

import { createAgent } from '@/modules/ai-assistant/lib/agent'

export const maxDuration = 60

export async function POST(req: Request) {
  const { messages, model } = await req.json()

  const agent = createAgent(model)

  console.log('--- Chat Request ---')
  console.log('Model:', model)
  console.log('Messages:', messages.length)

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  })
}
