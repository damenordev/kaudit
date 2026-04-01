import type { IGeneratedContent } from '../../types/generation.types'

interface IAuditGeneratedContentProps {
  generated: IGeneratedContent
  translations: {
    title: string
    noContent: string
  }
}

/** Sección que muestra el contenido generado (summary, changes, suggestions, checklist) */
export function AuditGeneratedContent({ generated, translations }: IAuditGeneratedContentProps) {
  return (
    <section className="p-4 border rounded-lg">
      <h3 className="text-sm font-semibold mb-3">{translations.title}</h3>
      <div className="prose prose-sm max-w-none">
        <p className="mb-4 text-sm">{generated.summary}</p>
        {generated.changes.length > 0 && <ContentList items={generated.changes} title="Changes" />}
        {generated.suggestions.length > 0 && <ContentList items={generated.suggestions} title="Suggestions" />}
        {generated.checklist.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-1">Checklist</h4>
            <ul className="space-y-1 text-xs bg-muted p-3 rounded">
              {generated.checklist.map((item, idx) => (
                <li key={`checklist-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

/** Lista genérica de items con título */
function ContentList({ items, title }: { items: string[]; title: string }) {
  return (
    <div className="mb-3">
      <h4 className="text-sm font-semibold mb-1">{title}</h4>
      <ul className="list-disc list-inside space-y-1 text-xs">
        {items.map((item, idx) => (
          <li key={`${title.toLowerCase()}-${idx}`}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
