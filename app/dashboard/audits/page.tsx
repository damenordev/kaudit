import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

import { getSession } from '@/modules/auth/services/auth.service'
import { listAllAudits } from '@/modules/audit/queries/audit.queries'
import { AuditsTable } from '@/modules/audit/components/audits-table'
import { type IDataTableTranslations } from '@/core/ui/data-table'
import type { IAuditStatusResponse } from '@/modules/audit/types/api.types'
import type { TAuditStatus } from '@/modules/audit/models/audit.schema'

export const metadata: Metadata = {
  title: 'Auditorías',
  description: 'Listado de auditorías con filtros y paginación',
}

interface IPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    status?: string
    q?: string
    from?: string
    to?: string
  }>
}

/**
 * Parsea un string de fecha a Date, o retorna undefined si es inválido.
 */
function parseOptionalDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const d = new Date(value)
  return isNaN(d.getTime()) ? undefined : d
}

/**
 * Valida que el status sea uno de los valores permitidos.
 */
function parseOptionalStatus(value: string | undefined): TAuditStatus | undefined {
  const validStatuses = ['pending', 'processing', 'validating', 'generating', 'completed', 'failed', 'blocked']
  if (!value || !validStatuses.includes(value)) return undefined
  return value as TAuditStatus
}

/**
 * Transforma los datos de la DB al formato de respuesta de API.
 * Convierte null a undefined para compatibilidad con tipos.
 */
function transformToResponse(data: unknown[]): IAuditStatusResponse[] {
  return (data as Array<Record<string, unknown>>).map(item => ({
    id: item.id as string,
    status: item.status as string,
    repoUrl: item.repoUrl as string,
    branchName: item.branchName as string,
    targetBranch: item.targetBranch as string,
    validationResult: (item.validationResult ?? undefined) as IAuditStatusResponse['validationResult'],
    generatedContent: (item.generatedContent ?? undefined) as IAuditStatusResponse['generatedContent'],
    prUrl: (item.prUrl ?? undefined) as string | undefined,
    errorMessage: (item.errorMessage ?? undefined) as string | undefined,
    createdAt: item.createdAt as Date,
    updatedAt: item.updatedAt as Date,
  }))
}

/**
 * Server Component page para listar auditorías.
 * Muestra todas las auditorías (incluyendo las del CLI anónimo).
 * Soporta filtros por status, búsqueda por repo y rango de fechas.
 */
export default async function AuditsPage({ searchParams }: IPageProps) {
  const t = await getTranslations('dashboard.audits')
  const session = await getSession()

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Please sign in to view audits.</p>
      </div>
    )
  }

  const params = await searchParams
  const page = params.page ? parseInt(params.page, 10) : 1
  const limit = params.limit ? parseInt(params.limit, 10) : 10
  const status = parseOptionalStatus(params.status)
  const search = params.q || undefined
  const dateFrom = parseOptionalDate(params.from)
  const dateTo = parseOptionalDate(params.to)

  const result = await listAllAudits({ page, limit, status, search, dateFrom, dateTo })

  const translations: IDataTableTranslations = {
    noResultsTitle: t('noAudits'),
    noResultsDescription: t('noAuditsDescription'),
    rowsPerPage: 'Rows per page',
    reset: 'Reset',
    tableView: 'Table',
    gridView: 'Grid',
    goToFirstPage: 'First',
    goToPreviousPage: 'Previous',
    goToNextPage: 'Next',
    goToLastPage: 'Last',
  }

  return (
    <section className="flex flex-col gap-4 p-3 h-full" aria-labelledby="audits-page-heading">
      <h1 id="audits-page-heading" className="sr-only">
        {t('pageTitle')}
      </h1>
      <AuditsTable data={transformToResponse(result.data)} pageCount={result.pageCount} translations={translations} />
    </section>
  )
}
