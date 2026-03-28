import { ExternalLink, GitBranch, Calendar, AlertCircle } from 'lucide-react'

import { Button } from '@/core/ui/button'

import { AuditStatusBadge } from '../audit-status-badge'
import { ValidationSection } from './validation-section'
import { ContentSection } from './content-section'

import type { IAuditStatusResponse } from '../../types/api.types'

export interface IAuditDetailProps {
  audit: IAuditStatusResponse
  translations: {
    repository: string
    branch: string
    targetBranch: string
    createdAt: string
    viewPR: string
    validation: {
      title: string
      noIssues: string
      issuesFound: string
      line: string
      suggestion: string
    }
    content: {
      title: string
      noContent: string
    }
    error: {
      title: string
      prefix: string
    }
  }
}

/**
 * Componente principal que muestra el detalle completo de una auditoría.
 * Diseño limpio y uniforme usando utilidades estándar.
 */
export function AuditDetail({ audit, translations }: IAuditDetailProps) {
  const {
    status,
    repoUrl,
    branchName,
    targetBranch,
    prUrl,
    errorMessage,
    validationResult,
    generatedContent,
    createdAt,
  } = audit

  const formattedDate =
    typeof createdAt === 'string'
      ? new Date(createdAt).toLocaleDateString()
      : createdAt.toLocaleDateString()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Información principal */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">{translations.repository}</h2>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 text-sm"
            >
              {repoUrl}
              <ExternalLink className="size-3.5" />
            </a>
          </div>
          <div className="flex items-center gap-3">
            <AuditStatusBadge status={status as any} />
            {prUrl && (
              <Button asChild size="sm" variant="outline" className="gap-2">
                <a href={prUrl} target="_blank" rel="noopener noreferrer">
                  {translations.viewPR}
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Metadatos */}
        <div className="flex flex-wrap items-center gap-6 text-sm py-4 border-y">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GitBranch className="size-4" />
            <span>
              {translations.branch}: <strong className="text-foreground font-medium">{branchName}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <GitBranch className="size-4" />
            <span>
              {translations.targetBranch}: <strong className="text-foreground font-medium">{targetBranch}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4" />
            <span>
              {translations.createdAt}: <strong className="text-foreground font-medium">{formattedDate}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Error State */}
      {status === 'failed' && errorMessage && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 flex gap-3 text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          <div className="space-y-1">
            <h3 className="font-medium leading-none tracking-tight">{translations.error.title}</h3>
            <p className="text-sm opacity-90">
              <span className="font-semibold mr-1">{translations.error.prefix}:</span>
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-10">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight border-b pb-2">{translations.validation.title}</h3>
          <ValidationSection validationResult={validationResult} translations={translations.validation} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight border-b pb-2">{translations.content.title}</h3>
          <ContentSection generatedContent={generatedContent} translations={translations.content} />
        </div>
      </div>
    </div>
  )
}
