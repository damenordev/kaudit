import { cn } from '@/core/utils/cn.utils'
import { Badge } from '@/core/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/core/ui/card'
import { ExternalLink, GitBranch, GitPullRequest, Clock, Info } from 'lucide-react'

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

/** Detalle de la auditoría: info del repo, validación y contenido generado */
export function AuditDetail({ audit, translations, className }: IAuditDetailProps) {
  const { validation, content, error } = translations

  return (
    <div className={cn('space-y-4', className)}>
      {/* Info del repo en Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="size-4 text-muted-foreground" />
            Detalles de la auditoría
            <Badge variant={STATUS_VARIANT_MAP[audit.status] ?? 'outline'} className="capitalize ml-auto">
              {audit.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                <GitBranch className="size-3" /> {translations.branch}
              </dt>
              <dd className="font-mono text-sm truncate">{audit.branchName}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                <GitBranch className="size-3" /> {translations.targetBranch}
              </dt>
              <dd className="font-mono text-sm truncate">{audit.targetBranch}</dd>
            </div>
          </dl>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" />
              {new Date(audit.createdAt).toLocaleString()}
            </span>
            {audit.prUrl && translations.viewPR && (
              <a
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                href={audit.prUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <GitPullRequest className="size-3.5" />
                {translations.viewPR}
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>

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
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold mb-1 text-destructive">{error.title}</h3>
            <p className="text-sm text-destructive/80">
              {error.prefix}: {audit.errorMessage}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
