'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { GitBranch } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'
import { Badge } from '@/core/ui/badge'
import { ScrollArea } from '@/core/ui/scroll-area'
import { Separator } from '@/core/ui/separator'

import type { IAuditCommit } from '../../types/commit.types'
import { CommitTimelineItem } from './commit-timeline-item'
import { groupCommitsByDate } from './commit-timeline.utils'
import type { ICommitTimelineProps, ICommitTimelineTranslations } from './commit-timeline.types'

export type { ICommitTimelineProps, ICommitTimelineTranslations }

const SCROLL_MAX_HEIGHT = '500px'

export function CommitTimeline({
  commits,
  repoUrl,
  translations,
  selectedSha,
  onCommitSelect,
  className,
}: ICommitTimelineProps) {
  const sortedCommits = useMemo(
    () => [...commits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [commits]
  )

  const groups = useMemo(() => groupCommitsByDate(sortedCommits), [sortedCommits])
  const [expandedSha, setExpandedSha] = useState<string | null>(selectedSha ?? null)
  const commitRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const handleCommitClick = useCallback(
    (sha: string) => {
      onCommitSelect?.(sha)
      setExpandedSha(prev => (prev === sha ? null : sha))
      requestAnimationFrame(() => {
        const el = commitRefs.current.get(sha)
        el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    },
    [onCommitSelect]
  )

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 px-1">
        <GitBranch className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">{translations.title}</h3>
        <Badge variant="secondary" className="text-xs">
          {commits.length}
        </Badge>
      </div>

      <Separator />

      {sortedCommits.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{translations.emptyMessage}</p>
      ) : (
        <ScrollArea style={{ maxHeight: SCROLL_MAX_HEIGHT }}>
          <div className="pr-4 space-y-4">
            {groups.map(group => (
              <div key={group.dateKey}>
                <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-1 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">{group.label}</span>
                </div>
                {group.commits.map(commit => (
                  <div
                    key={commit.sha}
                    ref={el => {
                      if (el) commitRefs.current.set(commit.sha, el)
                      else commitRefs.current.delete(commit.sha)
                    }}
                  >
                    <CommitTimelineItem
                      commit={commit}
                      repoUrl={repoUrl}
                      isSelected={commit.sha === selectedSha}
                      isExpanded={commit.sha === expandedSha}
                      onSelect={handleCommitClick}
                      translations={{
                        filesChanged: translations.filesChanged,
                        viewDetails: translations.viewDetails,
                        viewDiff: translations.viewDiff,
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
