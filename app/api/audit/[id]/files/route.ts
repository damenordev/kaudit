/**
 * Endpoint para obtener la lista de archivos modificados de una auditoría.
 * GET /api/audit/[id]/files
 *
 * Soporta filtros por query params:
 * - status: added | modified | deleted | renamed
 * - search: búsqueda por nombre de archivo
 */
import { NextResponse } from 'next/server'

import { requireAuth } from '@/modules/auth/services/auth.service'
import { getAuditById } from '@/modules/audit/queries/audit.queries'

import type { IAuditCommit, IChangedFile, TFileStatus } from '@/modules/audit/types'

interface IFileListResponse {
  files: IChangedFile[]
  total: number
  changedFiles: IChangedFile[]
  commits: IAuditCommit[]
  filters: {
    status?: string
    search?: string
  }
}

const VALID_STATUSES: TFileStatus[] = ['added', 'modified', 'deleted', 'renamed']

/**
 * Extrae y valida los filtros de los query params.
 */
function parseFilters(searchParams: URLSearchParams) {
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  return {
    status: status && VALID_STATUSES.includes(status as TFileStatus) ? status : undefined,
    search: search?.trim() || undefined,
  }
}

/**
 * Filtra los archivos según status y búsqueda.
 */
function filterFiles(files: IChangedFile[], filters: { status?: string; search?: string }) {
  let result = files

  if (filters.status) {
    result = result.filter(file => file.status === filters.status)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    result = result.filter(file => file.path.toLowerCase().includes(searchLower))
  }

  return result
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)

    const audit = await getAuditById(id)
    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    // Intentar obtener sesión para verificar ownership
    try {
      const session = await requireAuth()
      if (audit.userId && audit.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } catch {
      // Usuario CLI anónimo - permitir acceso
    }

    const filters = parseFilters(searchParams)
    const allFiles = audit.changedFiles ?? []
    const filteredFiles = filterFiles(allFiles, filters)

    const response: IFileListResponse = {
      files: filteredFiles,
      total: filteredFiles.length,
      changedFiles: allFiles,
      commits: audit.commits ?? [],
      filters: {
        status: filters.status,
        search: filters.search,
      },
    }

    return NextResponse.json(response)
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
