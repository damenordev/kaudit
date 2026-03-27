import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { getAuditById } from '@/modules/audit/queries/audit.queries'
import { AuditDetail } from '@/modules/audit/components'
import { Button } from '@/core/ui/button'
import { ArrowLeft } from 'lucide-react'

interface IPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * Server Component page para mostrar el detalle de una auditoría.
 * Obtiene datos del servidor y los pasa al componente de detalle.
 */
export default async function AuditDetailPage({ params }: IPageProps) {
  const { id } = await params
  const t = await getTranslations('dashboard.audits')

  const audit = await getAuditById(id)

  if (!audit) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h1 className="text-2xl font-bold">{t('detail.notFound.title')}</h1>
        <p className="text-muted-foreground">{t('detail.notFound.description')}</p>
        <Button asChild>
          <Link href="/dashboard/audits">
            <ArrowLeft className="size-4" />
            {t('detail.notFound.backToList')}
          </Link>
        </Button>
      </div>
    )
  }

  // Transformar datos para compatibilidad con tipos
  const auditResponse = {
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

  return (
    <section className="p-3 h-full" aria-labelledby="audit-detail-heading">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/audits">
            <ArrowLeft className="size-4" />
            {t('detail.notFound.backToList')}
          </Link>
        </Button>
      </div>
      <h1 id="audit-detail-heading" className="sr-only">
        {t('pageTitle')} - {audit.id}
      </h1>
      <AuditDetail
        audit={auditResponse}
        translations={{
          repository: t('detail.repository'),
          branch: t('detail.branch'),
          targetBranch: t('detail.targetBranch'),
          createdAt: t('detail.createdAt'),
          viewPR: t('detail.viewPR'),
          validation: {
            title: t('detail.validation.title'),
            noIssues: t('detail.validation.noIssues'),
            issuesFound: t('detail.validation.issuesFound'),
            line: t('detail.validation.line'),
            suggestion: t('detail.validation.suggestion'),
          },
          content: {
            title: t('detail.content.title'),
            noContent: t('detail.content.noContent'),
          },
          error: {
            title: t('detail.error.title'),
            prefix: t('detail.error.prefix'),
          },
        }}
      />
    </section>
  )
}
