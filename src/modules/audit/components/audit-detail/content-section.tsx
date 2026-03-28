'use client'

import ReactMarkdown from 'react-markdown'

import type { IGeneratedContent } from '../../types'

export interface IContentSectionProps {
  generatedContent?: IGeneratedContent
  translations: {
    title: string
    noContent: string
  }
}

/**
 * Genera markdown combinado a partir de los campos estructurados.
 */
function generateCombinedMarkdown(content: IGeneratedContent): string {
  const parts: string[] = []

  if (content.title) {
    parts.push(`## ${content.title}\n`)
  }

  if (content.summary) {
    parts.push(`### Resumen\n\n${content.summary}\n`)
  }

  if (content.changes) {
    parts.push(`### Cambios\n\n${content.changes}\n`)
  }

  if (content.suggestions) {
    parts.push(`### Sugerencias\n\n${content.suggestions}\n`)
  }

  if (content.checklist) {
    parts.push(`### Checklist\n\n${content.checklist}\n`)
  }

  return parts.join('\n')
}

/**
 * Sección que renderiza el contenido Markdown generado por la auditoría.
 * Usa react-markdown para renderizar de forma segura.
 */
export function ContentSection({ generatedContent, translations }: IContentSectionProps) {
  if (!generatedContent) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg border-dashed text-muted-foreground text-sm">
        {translations.noContent}
      </div>
    )
  }

  // Usar rawMarkdown si existe, sino generar desde campos estructurados
  const markdownContent = generatedContent.rawMarkdown ?? generateCombinedMarkdown(generatedContent)

  if (!markdownContent) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg border-dashed text-muted-foreground text-sm">
        {translations.noContent}
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-a:text-primary hover:prose-a:text-primary/80 prose-pre:border">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </article>
    </div>
  )
}
