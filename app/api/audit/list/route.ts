/**
 * Endpoint para listar auditorías.
 * GET /api/audit/list
 *
 * Muestra todas las auditorías (incluyendo las anónimas del CLI).
 * Si se pasa ?mine=true, filtra solo las del usuario autenticado.
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireAuth } from '@/modules/auth/services/auth.service'
import { listAudits, listAllAudits } from '@/modules/audit/queries/audit.queries'
import { auditListQuerySchema } from '@/modules/audit/types/api.types'

export async function GET(req: Request) {
  try {
    // Verificar autenticación
    let userId: string | undefined
    try {
      const session = await requireAuth()
      userId = session.user.id
    } catch {
      // Usuario no autenticado - no puede ver auditorías
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = auditListQuerySchema.parse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      status: searchParams.get('status') ?? undefined,
    })

    const mineOnly = searchParams.get('mine') === 'true'

    // Si pide solo las suyas, filtrar por userId
    if (mineOnly && userId) {
      const result = await listAudits(userId, {
        page: query.page,
        limit: query.limit,
        status: query.status,
      })
      return NextResponse.json(result)
    }

    // Mostrar todas las auditorías
    const result = await listAllAudits({
      page: query.page,
      limit: query.limit,
      status: query.status,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
