/**
 * Endpoint para obtener el estado de una auditoría.
 * GET /api/audit/[id]/status
 *
 * Permite acceso anónimo para CLI - si la auditoría existe, cualquiera puede verla.
 * Usuarios autenticados mantienen verificación de ownership para auditorías propias.
 *
 * NOTA DE SEGURIDAD: Solo devuelve campos necesarios para polling.
 * NUNCA exponer gitDiff, changedFiles, commits, issues, docstrings, etc.
 */
import { NextResponse } from 'next/server'

import { authenticateRequest } from '@/modules/auth/lib/cli-auth.middleware'
import { getAuditById } from '@/modules/audit/queries/audit.queries'

import type { IAuditStatusResponse } from '@/modules/audit/types/api.types'

/**
 * Construye una respuesta segura con solo los campos necesarios para polling.
 * Evita exponer datos sensibles como gitDiff o contenido detallado del repo.
 */
function buildSafeStatusResponse(audit: Awaited<ReturnType<typeof getAuditById>>): IAuditStatusResponse {
  if (!audit) {
    throw new Error('Audit is null')
  }

  return {
    id: audit.id,
    status: audit.status,
    repoUrl: audit.repoUrl,
    branchName: audit.branchName,
    targetBranch: audit.targetBranch,
    validationResult: audit.validationResult ?? undefined,
    generatedContent: audit.generatedContent ?? undefined,
    prUrl: audit.prUrl ?? undefined,
    errorMessage: audit.errorMessage ?? undefined,
    createdAt: audit.createdAt,
    updatedAt: audit.updatedAt,
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const audit = await getAuditById(id)
    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    // Autenticación unificada: sesión web o API key del CLI
    const authenticatedUser = await authenticateRequest(req)

    // Usuario autenticado - verificar ownership solo si la auditoría tiene userId
    if (authenticatedUser && audit.userId && audit.userId !== authenticatedUser.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Respuesta explícita: solo campos necesarios para polling del CLI
    const statusResponse = buildSafeStatusResponse(audit)
    return NextResponse.json(statusResponse)
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
