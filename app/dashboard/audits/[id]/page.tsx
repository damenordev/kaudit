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
} from '@/modules/audit/components'
import { Button } from '@/core/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/ui/tabs'
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

  const changedFiles = audit.changedFiles ?? []
  const issues = audit.issues ?? []
  const commits = audit.commits ?? []
  const hasFiles = changedFiles.length > 0

  return (
    <section
      className="flex flex-col gap-6 p-6 mx-auto w-full h-full min-h-(--container-height)"
      aria-labelledby="audit-detail-heading"
    >
      <h1 id="audit-detail-heading" className="sr-only">
        {t('pageTitle')} - {audit.id}
      </h1>

      {/* Cabecera: repo, status badge y fecha */}
      <AuditDetailHeader
        repoName={repoName}
        status={audit.status}
        createdAt={audit.createdAt}
        branchName={audit.branchName}
        prUrl={audit.prUrl ?? undefined}
      />

      <Tabs defaultValue="overview" className="w-full flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit mb-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="diff" disabled={!hasFiles}>
            Archivos y Código
          </TabsTrigger>
          {audit.status === 'completed' && <TabsTrigger value="chat">Asistente IA</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="flex-1 space-y-6 focus-visible:outline-none focus-visible:ring-0">
          {/* Resumen estadístico: archivos, issues, commits, líneas */}
          <AuditSummary changedFiles={changedFiles} issues={issues} commits={commits} />

          {/* Info del audit: status, branch, validación, contenido generado */}
          <AuditDetail audit={auditResponse} translations={buildDetailTranslations(t)} />

          {!hasFiles && <PendingAuditNotice status={audit.status} />}
        </TabsContent>

        <TabsContent value="diff" className="flex-1 focus-visible:outline-none focus-visible:ring-0">
          {hasFiles && (
            <Suspense fallback={<LoadingFallback label="Cargando visor de diff..." />}>
              <AuditDetailClient auditId={id} changedFiles={changedFiles} issues={issues} commits={commits} />
            </Suspense>
          )}
        </TabsContent>

        {audit.status === 'completed' && (
          <TabsContent value="chat" className="flex-1 focus-visible:outline-none focus-visible:ring-0">
            <AuditChatPanel
              auditId={id}
              changedFiles={changedFiles}
              issues={issues}
              translations={buildChatTranslations(t)}
            />
          </TabsContent>
        )}
      </Tabs>
    </section>
  )
}
