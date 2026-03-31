/**
 * Endpoint para iniciar una nueva auditoría.
 * POST /api/audit/start
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { env } from '@/env'
import { inngest } from '@/core/lib/inngest/client'
import { authenticateRequest } from '@/modules/auth/lib/cli-auth.middleware'
import { createAudit } from '@/modules/audit/queries/audit.queries'
import { auditStartSchema } from '@/modules/audit/types/api.types'
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
  try {
    // Autenticación unificada: sesión web o API key del CLI
    const authenticatedUser = await authenticateRequest(req)
    const userId = authenticatedUser?.userId

    const body = await req.json()
    const validated = auditStartSchema.parse(body)

    const auditId = nanoid()
    await createAudit({
      id: auditId,
      userId,
      repoUrl: validated.repoUrl,
      branchName: validated.branchName,
      targetBranch: validated.targetBranch,
      gitDiff: validated.gitDiff,
    })

    // Envío de evento a Inngest: no bloquea la respuesta si falla.
    // La auditoría ya fue creada en DB y puede procesarse después.
    if (!env.INNGEST_EVENT_KEY) {
      console.warn('[audit/start] INNGEST_EVENT_KEY no configurado — evento audit/created omitido')
    } else {
      try {
        await inngest.send({
          name: 'audit/created',
          data: {
            auditId,
            repoUrl: validated.repoUrl,
            branchName: validated.branchName,
            targetBranch: validated.targetBranch,
            userId: userId ?? null,
            options: validated.options,
          },
        })
      } catch (inngestError) {
        // Clave inválida o servidor Inngest no disponible — no es fatal
        console.warn(
          '[audit/start] No se pudo enviar evento a Inngest (la auditoría persiste en DB):',
          inngestError instanceof Error ? inngestError.message : inngestError
        )
      }
    }

    return NextResponse.json({ auditId, status: 'pending' }, { status: 201 })
  } catch (error) {
    console.error('[audit/start] Error no controlado:', error)

    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
