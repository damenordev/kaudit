import { cn } from '@/core/utils/cn.utils'
import { Badge } from '@/core/ui/badge'

import type { IAuditStatusResponse } from '../../types/api.types'

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
    <div className={cn('space-y-6', className)}>
      {/* Indicador de estado */}
      <div className="flex items-center gap-2">
        <Badge variant={badgeVariant} className="capitalize">
          {audit.status}
        </Badge>
      </div>

      {/* Información del repositorio */}
      <section className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-3">{translations.repository}</h2>
        <dl className="grid grid-cols-1 gap-2 text-sm">
          <div>
            <dt className="text-muted-foreground">{translations.branch}</dt>
            <dd className="font-mono">{audit.branchName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{translations.targetBranch}</dt>
            <dd className="font-mono">{audit.targetBranch}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{translations.createdAt}</dt>
            <dd>{new Date(audit.createdAt).toLocaleString()}</dd>
          </div>
        </dl>
        {audit.prUrl && translations.viewPR && (
          <a
            className="inline-block mt-3 text-blue-500 hover:underline"
            href={audit.prUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {translations.viewPR}
          </a>
        )}
      </section>

      {/* Resultado de validación */}
      {audit.validationResult && validation && (
        <section className="p-4 border rounded-lg">
          <h3 className="text-md font-semibold mb-3">{validation.title}</h3>
          {audit.validationResult.isValid ? (
            <p className="text-emerald-500">{validation.noIssues}</p>
          ) : (
            <div className="space-y-2">
              <p className="text-amber-500 font-medium">
                {validation.issuesFound}: {audit.validationResult.issues.length}
              </p>
              <ul className="list-disc list-inside space-y-1">
                {audit.validationResult.issues.map((issue, index) => (
                  <li key={`${issue.type}-${index}`} className="text-sm">
                    <span className="font-medium">{issue.type}:</span> {issue.message}
                    {issue.line && (
                      <span className="text-muted-foreground ml-2">
                        ({validation.line} {issue.line})
                      </span>
                    )}
                    {issue.suggestion && (
                      <p className="text-muted-foreground ml-4 text-xs italic">
                        {validation.suggestion}: {issue.suggestion}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Contenido generado */}
      {audit.generatedContent && content && (
        <section className="p-4 border rounded-lg">
          <h3 className="text-md font-semibold mb-3">{content.title}</h3>
          <div className="prose prose-sm max-w-none">
            <p className="mb-4">{audit.generatedContent.summary}</p>
            {audit.generatedContent.changes.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold mb-1">Changes</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  {audit.generatedContent.changes.map((change, idx) => (
                    <li key={`change-${idx}`}>{change}</li>
                  ))}
                </ul>
              </div>
            )}
            {audit.generatedContent.suggestions.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold mb-1">Suggestions</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  {audit.generatedContent.suggestions.map((suggestion, idx) => (
                    <li key={`suggestion-${idx}`}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
            {audit.generatedContent.checklist.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Checklist</h4>
                <ul className="space-y-1 text-xs bg-muted p-3 rounded">
                  {audit.generatedContent.checklist.map((item, idx) => (
                    <li key={`checklist-${idx}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Mensaje de error */}
      {audit.errorMessage && error && (
        <section className="p-4 border rounded-lg border-red-200 bg-red-50">
          <h3 className="text-md font-semibold mb-2 text-red-700">{error.title}</h3>
          <p className="text-sm text-red-600">
            {error.prefix}: {audit.errorMessage}
          </p>
        </section>
      )}
    </div>
  )
}
