'use client'

import { useMemo, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { cn } from '@/core/utils/cn.utils'
import { Badge } from '@/core/ui/badge'
import { Card, CardContent } from '@/core/ui/card'
import { ScrollArea } from '@/core/ui/scroll-area'
import { Separator } from '@/core/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/core/ui/tabs'

import type { IEnrichedIssue, TIssueSeverity } from '../../types/issue.types'

export interface IIssuesPanelProps {
  issues: IEnrichedIssue[]
  onIssueClick?: (issue: IEnrichedIssue) => void
  selectedIssueId?: string
  className?: string
}

const SEVERITY_CONFIG: Record<
  TIssueSeverity,
  { label: string; color: string; badgeVariant: 'destructive' | 'default' | 'secondary' | 'outline'; dotColor: string }
> = {
  critical: { label: 'Crítico', color: 'text-red-600', badgeVariant: 'destructive', dotColor: 'bg-red-500' },
  error: { label: 'Error', color: 'text-orange-600', badgeVariant: 'destructive', dotColor: 'bg-orange-500' },
  warning: { label: 'Advertencia', color: 'text-yellow-600', badgeVariant: 'secondary', dotColor: 'bg-yellow-500' },
  info: { label: 'Info', color: 'text-blue-600', badgeVariant: 'outline', dotColor: 'bg-blue-500' },
}

const SEVERITIES: TIssueSeverity[] = ['critical', 'error', 'warning', 'info']

function countBySeverity(issues: IEnrichedIssue[]): Record<TIssueSeverity, number> {
  const counts: Record<TIssueSeverity, number> = { critical: 0, error: 0, warning: 0, info: 0 }
  for (const issue of issues) counts[issue.severity]++
  return counts
}

function getSeverityConfig(severity: TIssueSeverity | undefined) {
  if (!severity)
    return { label: 'N/A', color: 'text-gray-500', badgeVariant: 'outline' as const, dotColor: 'bg-gray-400' }
  return SEVERITY_CONFIG[severity]
}

function IssueCard({
  issue,
  isSelected,
  onClick,
}: {
  issue: IEnrichedIssue
  isSelected: boolean
  onClick: () => void
}) {
  const config = getSeverityConfig(issue.severity)

  return (
    <Card
      className={cn('cursor-pointer py-3 transition-colors hover:bg-accent/50', isSelected && 'ring-2 ring-primary')}
      onClick={onClick}
    >
      <CardContent className="space-y-1.5 px-4 py-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium leading-tight line-clamp-1">{issue.title}</span>
          <Badge variant={config.badgeVariant} className="shrink-0 text-[10px] px-1.5 py-0">
            <span className={cn('size-1.5 rounded-full mr-1', config.dotColor)} />
            {config.label}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="font-mono truncate">{issue.file || 'N/A'}</span>
          {issue.line > 0 && (
            <>
              <span>:</span>
              <span className="shrink-0">{issue.line}</span>
            </>
          )}
        </div>
        {issue.message && <p className="text-xs text-muted-foreground line-clamp-2">{issue.message}</p>}
      </CardContent>
    </Card>
  )
}

function IssueList({
  issues,
  selectedIssueId,
  onIssueClick,
}: {
  issues: IEnrichedIssue[]
  selectedIssueId?: string
  onIssueClick?: (issue: IEnrichedIssue) => void
}) {
  if (issues.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Sin issues en esta categoría</p>
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2 pr-2">
        {issues.map(issue => (
          <IssueCard
            key={issue.id}
            issue={issue}
            isSelected={issue.id === selectedIssueId}
            onClick={() => onIssueClick?.(issue)}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

export function IssuesPanel({ issues, onIssueClick, selectedIssueId, className }: IIssuesPanelProps) {
  const counts = useMemo(() => countBySeverity(issues), [issues])
  const grouped = useMemo(() => {
    const map: Record<TIssueSeverity, IEnrichedIssue[]> = { critical: [], error: [], warning: [], info: [] }
    for (const issue of issues) map[issue.severity].push(issue)
    return map
  }, [issues])

  const [activeTab, setActiveTab] = useState<string>('critical')

  if (issues.length === 0) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2 px-1">
          <h3 className="text-sm font-semibold">Issues</h3>
          <Badge variant="secondary" className="text-xs">
            0
          </Badge>
        </div>
        <Separator />
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
          <ShieldCheck className="size-8 opacity-40" />
          <p className="text-sm">No se encontraron issues</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 px-1">
        <h3 className="text-sm font-semibold">Issues</h3>
        <Badge variant="secondary" className="text-xs">
          {issues.length}
        </Badge>
      </div>

      <Separator />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          {SEVERITIES.map(sev => (
            <TabsTrigger key={sev} value={sev} className="flex-1 text-xs">
              {SEVERITY_CONFIG[sev].label}
              {counts[sev] > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1 text-[10px]">
                  {counts[sev]}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {SEVERITIES.map(sev => (
          <TabsContent key={sev} value={sev}>
            <IssueList issues={grouped[sev]} selectedIssueId={selectedIssueId} onIssueClick={onIssueClick} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
