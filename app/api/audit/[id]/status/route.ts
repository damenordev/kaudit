/**
 * Endpoint para obtener el estado de una auditoría.
 * GET /api/audit/[id]/status
 *
 * Permite acceso anónimo para CLI - si la auditoría existe, cualquiera puede verla.
 * Usuarios autenticados mantienen verificación de ownership para auditorías propias.
 */
import { NextResponse } from 'next/server'

import { requireAuth } from '@/modules/auth/services/auth.service'
import { getAuditById } from '@/modules/audit/queries/audit.queries'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const audit = await getAuditById(id)
    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    // Intentar obtener sesión para verificar ownership
    // Si no hay sesión (CLI anónimo), permitir acceso a la auditoría
    try {
      const session = await requireAuth()
      // Usuario autenticado - verificar ownership solo si la auditoría tiene userId
      if (audit.userId && audit.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } catch {
      // Usuario CLI anónimo - permitir acceso a la auditoría existente
    }

    return NextResponse.json(audit)
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
