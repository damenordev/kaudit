import type { getTranslations } from 'next-intl/server'

import { Spinner } from '@/core/ui/spinner'

/** Panel cuando la auditoría aún no tiene datos de archivos y sigue procesando */
export function PendingAuditNotice({ status }: { status: string }) {
  if (status === 'failed' || status === 'completed') {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 border border-border/40 border-dashed rounded-xl bg-muted/5">
      <Spinner className="size-5 text-muted-foreground" />
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Procesando código de la auditoría...</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Este proceso puede tardar unos segundos.
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
