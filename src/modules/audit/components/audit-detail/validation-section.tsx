import { CheckCircle2, AlertTriangle } from 'lucide-react'

import { Badge } from '@/core/ui/badge'
import { cn } from '@/core/utils/cn.utils'

import type { IValidationResult, IValidationIssue } from '../../types'

export interface IValidationSectionProps {
  validationResult?: IValidationResult
  translations: {
    title: string
    noIssues: string
    issuesFound: string
    line: string
    suggestion: string
  }
}

// Colores por severidad
const SEVERITY_STYLES: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-600 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  low: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
}

// Etiquetas por severidad
const SEVERITY_LABELS: Record<string, string> = {
  critical: 'Crítico',
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
}

/**
 * Sección que muestra los resultados de validación de una auditoría.
 */
export function ValidationSection({ validationResult, translations }: IValidationSectionProps) {
  if (!validationResult) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg border-dashed text-muted-foreground text-sm">
        {translations.noIssues}
      </div>
    )
  }

  const { isValid, issues } = validationResult

  if (isValid || issues.length === 0) {
    return (
      <div className="flex items-center gap-3 py-4 px-4 rounded-lg border bg-emerald-500/10 text-emerald-600">
        <CheckCircle2 className="size-5 shrink-0" />
        <span className="font-medium">{translations.noIssues}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-amber-600">
        <AlertTriangle className="size-5 shrink-0" />
        <span className="font-medium">
          {translations.issuesFound}: {issues.length}
        </span>
      </div>

      <div className="grid gap-3">
        {issues.map((issue: IValidationIssue, index: number) => (
          <ValidationIssueCard key={index} issue={issue} translations={translations} />
        ))}
      </div>
    </div>
  )
}

interface IValidationIssueCardProps {
  issue: IValidationIssue
  translations: IValidationSectionProps['translations']
}

function ValidationIssueCard({ issue, translations }: IValidationIssueCardProps) {
  const severityStyle = SEVERITY_STYLES[issue.severity] || SEVERITY_STYLES.low
  const severityLabel = SEVERITY_LABELS[issue.severity] || issue.severity

  return (
    <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn('border shadow-none rounded-md px-2', severityStyle)}>
              {severityLabel}
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground shadow-none rounded-md">
              {issue.type}
            </Badge>
          </div>
          <p className="text-sm leading-relaxed">{issue.message}</p>
        </div>
        
        <div className="flex shrink-0">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {translations.line}: {issue.line}
          </span>
        </div>
      </div>

      {issue.suggestion && (
        <div className="text-sm text-muted-foreground bg-background rounded p-3 border">
          <span className="font-medium mr-1">{translations.suggestion}:</span> 
          {issue.suggestion}
        </div>
      )}
    </div>
  )
}
