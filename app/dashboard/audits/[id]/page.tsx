import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { getAuditById } from '@/modules/audit/queries/audit.queries'
import {
  AuditDetail,
  AuditDetailClient,
  AuditDetailHeader,
  AuditChatPanel,
  AuditSummary,
  AuditFilesList,
} from '@/modules/audit/components'
import { Button } from '@/core/ui/button'
import type { IAuditCommit, IChangedFile, IEnrichedIssue } from '@/modules/audit/types'
import {
  PendingAuditNotice,
  LoadingFallback,
  buildDetailTranslations,
  buildChatTranslations,
} from './audit-detail.helpers'

export const metadata: Metadata = {
  title: 'Detalle de Auditoría',
  description: 'Detalle completo de una auditoría con diff, issues y chat',
}

interface IPageProps {
  params: Promise<{ id: string }>
}

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

  const repoName = audit.repoUrl.replace('https://github.com/', '')
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

  const changedFiles: IChangedFile[] = (audit.changedFiles as IChangedFile[] | null) ?? []
  const issues: IEnrichedIssue[] = (audit.issues as IEnrichedIssue[] | null) ?? []
  const commits: IAuditCommit[] = (audit.commits as IAuditCommit[] | null) ?? []
  const hasFiles = changedFiles.length > 0

  return (
    <section className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto" aria-labelledby="audit-detail-heading">
      <h1 id="audit-detail-heading" className="sr-only">
        {t('pageTitle')} - {audit.id}
      </h1>

      {/* Cabecera: repo, status badge y fecha */}
      <AuditDetailHeader repoName={repoName} status={audit.status} createdAt={audit.createdAt} />

      {/* Resumen estadístico: archivos, issues, commits, líneas */}
      <AuditSummary changedFiles={changedFiles} issues={issues} commits={commits} />

      {/* Info del audit: status, branch, validación, contenido generado */}
      <AuditDetail audit={auditResponse} translations={buildDetailTranslations(t)} />

      {/* Lista expandible de archivos con issues (o aviso de pendiente) */}
      {hasFiles ? (
        <AuditFilesList files={changedFiles} issues={issues} />
      ) : (
        <PendingAuditNotice status={audit.status} />
      )}

      {/* Visor de diff detallado con sidebar y panel de issues */}
      {hasFiles && (
        <Suspense fallback={<LoadingFallback label="Cargando visor de diff..." />}>
          <AuditDetailClient auditId={id} changedFiles={changedFiles} issues={issues} commits={commits} />
        </Suspense>
      )}

      {/* Panel de chat con IA (solo auditorías completadas) */}
      {audit.status === 'completed' && (
        <AuditChatPanel
          auditId={id}
          changedFiles={changedFiles}
          issues={issues}
          translations={buildChatTranslations(t)}
        />
      )}
    </section>
  )
}
