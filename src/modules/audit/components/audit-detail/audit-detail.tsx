import { cn } from '@/core/utils/cn.utils'
import { Badge } from '@/core/ui/badge'
import { ExternalLink, GitBranch, GitPullRequest, Clock } from 'lucide-react'

import type { IAuditStatusResponse } from '../../types/api.types'
import { AuditGeneratedContent } from './audit-detail-content'
import { AuditValidationSection } from './audit-detail-validation'

/** Variantes visuales del badge según el status */
const STATUS_VARIANT_MAP: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  completed: 'default',
  failed: 'destructive',
  processing: 'secondary',
  pending: 'outline',
  validating: 'secondary',
  generating: 'secondary',
  blocked: 'destructive',
}

export interface IAuditDetailProps {
  audit: IAuditStatusResponse
  translations: {
    repository: string
    branch: string
    targetBranch: string
    createdAt: string
    viewPR?: string
    validation?: {
      title: string
      noIssues: string
      issuesFound: string
      line: string
      suggestion: string
    }
    content?: {
      title: string
      noContent: string
    }
    error?: {
      title: string
      prefix: string
    }
  }
  className?: string
}

export function AuditDetail({ audit, translations, className }: IAuditDetailProps) {
  const { validation, content, error } = translations
  const badgeVariant = STATUS_VARIANT_MAP[audit.status] ?? 'outline'

  return (
    <div className={cn('space-y-4', className)}>
      {/* Cabecera: estado + info del repo en fila */}
      <section className="flex flex-col gap-3 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <Badge variant={badgeVariant} className="capitalize">
            {audit.status}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="size-3" />
            {new Date(audit.createdAt).toLocaleString()}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground flex items-center gap-1">
              <GitBranch className="size-3" /> {translations.branch}
            </dt>
            <dd className="font-mono text-sm truncate">{audit.branchName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground flex items-center gap-1">
              <GitBranch className="size-3" /> {translations.targetBranch}
            </dt>
            <dd className="font-mono text-sm truncate">{audit.targetBranch}</dd>
          </div>
        </dl>

        {audit.prUrl && translations.viewPR && (
          <a
            className="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:underline w-fit"
            href={audit.prUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitPullRequest className="size-3.5" />
            {translations.viewPR}
            <ExternalLink className="size-3" />
          </a>
        )}
      </section>

      {/* Resultado de validación */}
      {audit.validationResult && validation && (
        <AuditValidationSection result={audit.validationResult} translations={validation} />
      )}

      {/* Contenido generado */}
      {audit.generatedContent && content && (
        <AuditGeneratedContent generated={audit.generatedContent} translations={content} />
      )}

      {/* Mensaje de error */}
      {audit.errorMessage && error && (
        <section className="p-4 border rounded-lg border-destructive/50 bg-destructive/5">
          <h3 className="text-sm font-semibold mb-1 text-destructive">{error.title}</h3>
          <p className="text-sm text-destructive/80">
            {error.prefix}: {audit.errorMessage}
          </p>
        </section>
      )}
    </div>
  )
}
