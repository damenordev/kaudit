import { ShieldCheck, ShieldAlert } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/core/ui/card'
import { Badge } from '@/core/ui/badge'

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

/** Sección de resultado de validación usando Card */
export function AuditValidationSection({ result, translations }: IAuditValidationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {result.isValid ? (
            <ShieldCheck className="size-4 text-emerald-600" />
          ) : (
            <ShieldAlert className="size-4 text-amber-600" />
          )}
          {translations.title}
          {!result.isValid && (
            <Badge variant="destructive" className="ml-auto text-xs">
              {result.issues.length} {translations.issuesFound}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {result.isValid ? (
          <p className="text-sm text-emerald-600">{translations.noIssues}</p>
        ) : (
          <ul className="space-y-2">
            {result.issues.map((issue, index) => (
              <li key={`${issue.type}-${index}`} className="rounded-md bg-muted/50 p-3 text-sm space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{issue.type}</span>
                  {issue.line > 0 && (
                    <Badge variant="outline" className="text-[10px]">
                      {translations.line} {issue.line}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{issue.message}</p>
                {issue.suggestion && (
                  <p className="text-xs text-muted-foreground italic">
                    {translations.suggestion}: {issue.suggestion}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
