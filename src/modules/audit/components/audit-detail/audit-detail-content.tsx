import { FileText } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/core/ui/card'

import type { IGeneratedContent } from '../../types/generation.types'

interface IAuditGeneratedContentProps {
  generated: IGeneratedContent
  translations: {
    title: string
    noContent: string
  }
}

/** Sección que muestra el contenido generado usando Card */
export function AuditGeneratedContent({ generated, translations }: IAuditGeneratedContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="size-4 text-muted-foreground" />
          {translations.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{generated.summary}</p>
        {generated.changes.length > 0 && <ContentList items={generated.changes} title="Changes" />}
        {generated.suggestions.length > 0 && <ContentList items={generated.suggestions} title="Suggestions" />}
        {generated.checklist.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Checklist</h4>
            <ul className="space-y-1.5 bg-muted p-3 rounded-md">
              {generated.checklist.map((item, idx) => (
                <li key={`checklist-${idx}`} className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground mt-0.5">&#8226;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/** Lista genérica de items con título */
function ContentList({ items, title }: { items: string[]; title: string }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item, idx) => (
          <li key={`${title.toLowerCase()}-${idx}`} className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground mt-0.5">&#8226;</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
