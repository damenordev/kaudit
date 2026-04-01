import type { IValidationResult } from '../../types/validation.types'

export interface IAuditValidationTranslations {
  title: string
  noIssues: string
  issuesFound: string
  line: string
  suggestion: string
}

interface IAuditValidationSectionProps {
  result: IValidationResult
  translations: IAuditValidationTranslations
}

/** Sección colapsable que muestra el resultado de la validación de seguridad */
export function AuditValidationSection({ result, translations }: IAuditValidationSectionProps) {
  return (
    <section className="p-4 border rounded-lg">
      <h3 className="text-sm font-semibold mb-3">{translations.title}</h3>
      {result.isValid ? (
        <p className="text-sm text-emerald-600">{translations.noIssues}</p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-amber-600 font-medium">
            {translations.issuesFound}: {result.issues.length}
          </p>
          <ul className="list-disc list-inside space-y-1">
            {result.issues.map((issue, index) => (
              <li key={`${issue.type}-${index}`} className="text-sm">
                <span className="font-medium">{issue.type}:</span> {issue.message}
                {issue.line > 0 && (
                  <span className="text-muted-foreground ml-2">
                    ({translations.line} {issue.line})
                  </span>
                )}
                {issue.suggestion && (
                  <p className="text-muted-foreground ml-4 text-xs italic">
                    {translations.suggestion}: {issue.suggestion}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
