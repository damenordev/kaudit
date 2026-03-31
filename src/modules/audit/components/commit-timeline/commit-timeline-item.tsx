'use client'

import { useState } from 'react'
import { GitCommitHorizontal, ChevronDown, ChevronRight, FileText, ExternalLink } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'
import { Badge } from '@/core/ui/badge'
import { Separator } from '@/core/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/core/ui/avatar'
import { formatRelativeDate } from '@/core/utils/date'

import type { IAuditCommit } from '../../types/commit.types'

export interface ICommitTimelineItemProps {
  commit: IAuditCommit
  repoUrl: string
  isSelected: boolean
  isExpanded: boolean
  onSelect: (sha: string) => void
  translations: {
    filesChanged: string
    viewDetails: string
    viewDiff: string
  }
}

const MAX_MESSAGE_LENGTH = 120

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export function CommitTimelineItem({
  commit,
  repoUrl,
  isSelected,
  isExpanded,
  onSelect,
  translations,
}: ICommitTimelineItemProps) {
  const sha7 = commit.sha.slice(0, 7)
  const commitUrl = `${repoUrl}/commit/${commit.sha}`
  const message = truncate(commit.message.split('\n')[0] ?? '', MAX_MESSAGE_LENGTH)
  const initials = getInitials(commit.author.name)

  return (
    <div className={cn('group relative flex gap-3 pb-4 last:pb-0', isSelected && 'bg-accent/30 rounded-md')}>
      <div className="flex flex-col items-center">
        <div className="rounded-full border bg-background p-1 text-muted-foreground">
          <GitCommitHorizontal className="size-3.5" />
        </div>
        <div className="w-px flex-1 bg-border group-last:hidden" />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <button type="button" onClick={() => onSelect(commit.sha)} className="w-full text-left cursor-pointer">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-tight">{message}</p>
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5"
              >
                {sha7}
                <ExternalLink className="size-2.5" />
              </a>
              {isExpanded ? (
                <ChevronDown className="size-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="size-3.5 text-muted-foreground" />
              )}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Avatar size="sm">
              {commit.author.avatar ? <AvatarImage src={commit.author.avatar} alt={commit.author.name} /> : null}
              <AvatarFallback className="text-[8px]">{initials}</AvatarFallback>
            </Avatar>
            <span>{commit.author.name}</span>
          </div>
          <span>·</span>
          <time dateTime={commit.date}>{formatRelativeDate(commit.date)}</time>
        </div>

        {commit.files.length > 0 && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {commit.files.length} {translations.filesChanged}
          </Badge>
        )}

        {isExpanded && commit.files.length > 0 && <ExpandedFiles files={commit.files} translations={translations} />}
      </div>
    </div>
  )
}

interface IExpandedFilesProps {
  files: string[]
  translations: ICommitTimelineItemProps['translations']
}

function ExpandedFiles({ files, translations }: IExpandedFilesProps) {
  const [hoveredFile, setHoveredFile] = useState<string | null>(null)

  return (
    <div className="mt-2 space-y-1">
      <Separator />
      <p className="text-xs font-medium text-muted-foreground pt-1">{translations.viewDetails}</p>
      <ul className="space-y-0.5">
        {files.map(path => (
          <li
            key={path}
            onMouseEnter={() => setHoveredFile(path)}
            onMouseLeave={() => setHoveredFile(null)}
            className="flex items-center gap-2 px-2 py-1 rounded text-xs hover:bg-accent/50 transition-colors"
          >
            <FileText className="size-3.5 text-muted-foreground shrink-0" />
            <span className="font-mono truncate flex-1 text-muted-foreground">{path}</span>
            {hoveredFile === path && (
              <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 shrink-0">
                {translations.viewDiff}
              </Badge>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
