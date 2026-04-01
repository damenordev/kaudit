import type { getTranslations } from 'next-intl/server'

import { Badge } from '@/core/ui/badge'
import { Spinner } from '@/core/ui/spinner'

/** Panel cuando la auditoría aún no tiene datos de archivos */
export function PendingAuditNotice({ status }: { status: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 border rounded-lg bg-muted/30">
      <Spinner className="size-8" />
      <div className="text-center space-y-1">
        <p className="text-sm font-medium">La auditoría aún se está procesando</p>
        <p className="text-xs text-muted-foreground">
          Estado actual:{' '}
          <Badge variant="secondary" className="text-[10px] capitalize">
            {status}
          </Badge>
        </p>
      </div>
    </div>
  )
}

/** Fallback con spinner para Suspense boundaries inline */
export function LoadingFallback({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Spinner className="size-6" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

/** Construye las traducciones para AuditDetail desde next-intl */
export function buildDetailTranslations(t: Awaited<ReturnType<typeof getTranslations>>) {
  return {
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
  }
}

/** Construye las traducciones para AuditChatPanel desde next-intl */
export function buildChatTranslations(t: Awaited<ReturnType<typeof getTranslations>>) {
  return {
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
  }
}
