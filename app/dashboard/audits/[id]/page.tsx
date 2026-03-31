import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

import { getAuditById } from '@/modules/audit/queries/audit.queries'
import { AuditDetail, AuditDetailClient, AuditChatPanel } from '@/modules/audit/components'
import { Button } from '@/core/ui/button'
import { Spinner } from '@/core/ui/spinner'
import { ArrowLeft } from 'lucide-react'

import type { IAuditCommit, IChangedFile, IEnrichedIssue } from '@/modules/audit/types'

export const metadata: Metadata = {
  title: 'Detalle de Auditoría',
  description: 'Detalle completo de una auditoría con diff, issues y chat',
}

interface IPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ file?: string }>
}

export default async function AuditDetailPage({ params, searchParams }: IPageProps) {
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

  return (
    <section className="p-3 h-full max-w-[1600px] mx-auto" aria-labelledby="audit-detail-heading">
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
          content: { title: t('detail.content.title'), noContent: t('detail.content.noContent') },
          error: { title: t('detail.error.title'), prefix: t('detail.error.prefix') },
        }}
      />
      {changedFiles.length > 0 && (
        <Suspense fallback={<Spinner className="size-6 mx-auto my-8" />}>
          <AuditDetailClient
            auditId={id}
            changedFiles={changedFiles}
            issues={issues}
            commits={commits}
            className="mt-4"
          />
        </Suspense>
      )}

      {audit.status === 'completed' && (
        <div className="mt-4">
          <AuditChatPanel
            auditId={id}
            translations={{
              title: t('detail.chat.title'),
              badge: t('detail.chat.badge'),
              placeholder: t('detail.chat.placeholder'),
              contextInfo: t('detail.chat.contextInfo'),
              filesCount: t('detail.chat.filesCount'),
              issuesCount: t('detail.chat.issuesCount'),
              thinking: t('detail.chat.thinking'),
              errorMessage: t('detail.chat.errorMessage'),
              connectionError: t('detail.chat.connectionError'),
              inputPlaceholder: t('detail.chat.inputPlaceholder'),
            }}
          />
        </div>
      )}
    </section>
  )
}
