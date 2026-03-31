/**
 * Endpoint de chat contextual con IA sobre una auditoría.
 * POST /api/audit/[id]/chat
 *
 * Recibe mensajes del usuario y responde con contexto de la auditoría.
 * Usa streaming para respuesta en tiempo real.
 */
import { streamText } from 'ai'
import { z } from 'zod'

import { getAIProvider } from '@/core/config/ai.config'
import { getAuditById } from '@/modules/audit/queries/audit.queries'
import { buildAuditChatPrompt } from '@/modules/audit/lib/prompts/chat.prompt'

import type { IChangedFile, IEnrichedIssue, IAuditCommit, IValidationResult } from '@/modules/audit/types'

export const maxDuration = 60

/** Schema de validación para mensajes del chat de auditoría */
const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(10_000),
})

const auditChatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50),
})

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const validated = auditChatRequestSchema.parse(body)

    const audit = await getAuditById(id)
    if (!audit) {
      return Response.json({ error: 'Audit not found' }, { status: 404 })
    }

    const systemPrompt = buildAuditChatPrompt({
      repoUrl: audit.repoUrl,
      branchName: audit.branchName,
      targetBranch: audit.targetBranch,
      changedFiles: (audit.changedFiles as IChangedFile[] | null) ?? null,
      issues: (audit.issues as IEnrichedIssue[] | null) ?? null,
      commits: (audit.commits as IAuditCommit[] | null) ?? null,
      validationResult: (audit.validationResult as IValidationResult | null) ?? null,
    })

    const result = streamText({
      model: getAIProvider(),
      system: systemPrompt,
      messages: validated.messages,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    console.error('[Audit Chat] Error:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
