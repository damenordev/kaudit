import { getTranslations } from 'next-intl/server'

import { getSession } from '@/modules/auth/services/auth.service'
import { listAudits } from '@/modules/audit/queries/audit.queries'
import { AuditsTable } from '@/modules/audit/components'
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
function transformToResponse(data: any[]): IAuditStatusResponse[] {
  return data.map(item => ({
    id: item.id,
    status: item.status,
    repoUrl: item.repoUrl,
    branchName: item.branchName,
    targetBranch: item.targetBranch,
    validationResult: item.validationResult ?? undefined,
    generatedContent: item.generatedContent ?? undefined,
    prUrl: item.prUrl ?? undefined,
    errorMessage: item.errorMessage ?? undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }))
}

/**
 * Server Component page para listar auditorías del usuario.
 * Obtiene datos del servidor y los pasa al componente cliente.
 */
export default async function AuditsPage({ searchParams }: IPageProps) {
  const t = await getTranslations('dashboard.audits')
  const session = await getSession()

  const params = await searchParams
  const page = params.page ? parseInt(params.page) : 1
  const limit = params.limit ? parseInt(params.limit) : 10

  // Obtener auditorías del usuario
  const result = session?.user?.id
    ? await listAudits(session.user.id, { page, limit })
    : { data: [], pageCount: 0, total: 0 }

  return (
    <section className="p-3 h-full" aria-labelledby="audits-page-heading">
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
          pageOf: 'Page {current} of {total}',
        }}
      />
    </section>
  )
}
