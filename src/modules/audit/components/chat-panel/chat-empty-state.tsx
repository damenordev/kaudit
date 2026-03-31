import { Bot } from 'lucide-react'

import type { IChangedFile, IEnrichedIssue } from '../../types'

interface IChatEmptyStateProps {
  changedFiles?: IChangedFile[]
  issues?: IEnrichedIssue[]
  translations: {
    placeholder: string
    contextInfo: string
    filesCount: string
    issuesCount: string
  }
}

export function ChatEmptyState({ changedFiles, issues, translations }: IChatEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground py-8">
      <Bot className="size-8 opacity-40" />
      <p className="text-sm">{translations.placeholder}</p>
      <p className="text-xs">{translations.contextInfo}</p>
      {(changedFiles || issues) && (
        <div className="flex gap-2 mt-1">
          {changedFiles && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded">
              {translations.filesCount.replace('{count}', String(changedFiles.length))}
            </span>
          )}
          {issues && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded">
              {translations.issuesCount.replace('{count}', String(issues.length))}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
