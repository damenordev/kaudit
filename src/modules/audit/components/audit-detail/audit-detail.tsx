import { cn } from '@/core/utils/cn.utils'
import { Alert, AlertDescription, AlertTitle } from '@/core/ui/alert'
import { AlertCircle } from 'lucide-react'

import type { IAuditStatusResponse } from '../../types/api.types'
import { AuditGeneratedContent } from './audit-detail-content'
import { AuditValidationSection } from './audit-detail-validation'

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
    <div className={cn('space-y-6', className)}>

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
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/5 text-destructive">
          <AlertCircle className="size-4" />
          <AlertTitle className="mb-1 font-semibold">{error.title}</AlertTitle>
          <AlertDescription className="text-destructive/80 text-xs">
            {error.prefix}: {audit.errorMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
