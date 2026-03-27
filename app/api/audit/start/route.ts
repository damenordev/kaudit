/**
 * Endpoint para iniciar una nueva auditoría.
 * POST /api/audit/start
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { inngest } from '@/core/lib/inngest/client'
import { requireAuth } from '@/modules/auth/services/auth.service'
import { createAudit } from '@/modules/audit/queries/audit.queries'
import { auditStartSchema } from '@/modules/audit/types/api.types'
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
  try {
    // Auth es nullable - CLI puede ser anónimo
    let userId: string | undefined
    try {
      const session = await requireAuth()
      userId = session.user.id
    } catch {
      // Usuario CLI anónimo - permitido
    }

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

    await inngest.send({
      name: 'audit/created',
      data: {
        auditId,
        repoUrl: validated.repoUrl,
        branchName: validated.branchName,
        targetBranch: validated.targetBranch,
        userId: userId ?? null,
      },
    })

    return NextResponse.json({ auditId, status: 'pending' }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
