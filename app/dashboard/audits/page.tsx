import { getTranslations } from 'next-intl/server'

import { getSession } from '@/modules/auth/services/auth.service'
import { listAllAudits } from '@/modules/audit/queries/audit.queries'
import { AuditsTable } from '@/modules/audit/components/audits-table/audits-table'
import type { IAuditStatusResponse } from '@/modules/audit/types/api.types'

interface IPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
  }>
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
 */
export default async function AuditsPage({ searchParams }: IPageProps) {
  const t = await getTranslations('dashboard.audits')
  const session = await getSession()

  // Verificar autenticación
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

  // Obtener todas las auditorías (incluyendo anónimas del CLI)
  const result = await listAllAudits({ page, limit })

  return (
    <section className="flex flex-col gap-4 p-3 h-full" aria-labelledby="audits-page-heading">
      <h1 id="audits-page-heading" className="sr-only">
        {t('pageTitle')}
      </h1>
      <AuditsTable
        data={transformToResponse(result.data)}
        pageCount={result.pageCount}
        translations={{
          date: t('table.date'),
          repository: t('table.repository'),
          status: t('table.status'),
          prUrl: t('table.prUrl'),
          actions: t('table.actions'),
          viewDetails: t('table.viewDetails'),
          noResultsTitle: t('noAudits'),
          noResultsDescription: t('noAuditsDescription'),
          rowsPerPage: 'Rows per page',
          pageOf: `Page ${page} of ${result.pageCount || 1}`,
        }}
      />
    </section>
  )
}
