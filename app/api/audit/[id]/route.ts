/**
 * Endpoint para obtener el detalle completo de una auditoría.
 * GET /api/audit/[id]
 *
 * Permite acceso anónimo para CLI - si la auditoría existe, cualquiera puede verla.
 * Usuarios autenticados mantienen verificación de ownership para auditorías propias.
 */
import { NextResponse } from 'next/server'

import { requireAuth } from '@/modules/auth/services/auth.service'
import { getAuditById } from '@/modules/audit/queries/audit.queries'

import type { IChangedFile, IEnrichedIssue } from '@/modules/audit/types'

interface IAuditDetailResponse {
  id: string
  userId: string | null
  repoUrl: string
  branchName: string
  targetBranch: string
  status: string
  changedFiles: IChangedFile[] | null
  commits: unknown[] | null
  issues: IEnrichedIssue[] | null
  prUrl: string | null
  errorMessage: string | null
  createdAt: Date
  updatedAt: Date
  metrics: {
    totalAdditions: number
    totalDeletions: number
    totalFiles: number
    totalIssues: number
  }
}

/**
 * Calcula métricas agregadas de los archivos modificados.
 */
function calculateMetrics(files: IChangedFile[] | null, issues: IEnrichedIssue[] | null) {
  if (!files) {
    return {
      totalAdditions: 0,
      totalDeletions: 0,
      totalFiles: 0,
      totalIssues: issues?.length ?? 0,
    }
  }

  return {
    totalAdditions: files.reduce((sum, file) => sum + file.additions, 0),
    totalDeletions: files.reduce((sum, file) => sum + file.deletions, 0),
    totalFiles: files.length,
    totalIssues: issues?.length ?? files.reduce((sum, file) => sum + file.issueCount, 0),
  }
}

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

    const metrics = calculateMetrics(audit.changedFiles, audit.issues)

    const response: IAuditDetailResponse = {
      id: audit.id,
      userId: audit.userId,
      repoUrl: audit.repoUrl,
      branchName: audit.branchName,
      targetBranch: audit.targetBranch,
      status: audit.status,
      changedFiles: audit.changedFiles,
      commits: audit.commits,
      issues: audit.issues,
      prUrl: audit.prUrl,
      errorMessage: audit.errorMessage,
      createdAt: audit.createdAt,
      updatedAt: audit.updatedAt,
      metrics,
    }

    return NextResponse.json(response)
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
