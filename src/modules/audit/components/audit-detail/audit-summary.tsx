import { FileCode2, AlertTriangle, GitCommitHorizontal, Plus, Minus } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'
import { Card, CardContent } from '@/core/ui/card'

import type { IChangedFile } from '../../types/diff.types'
import type { IEnrichedIssue } from '../../types/issue.types'
import type { IAuditCommit } from '../../types/commit.types'

export interface IAuditSummaryProps {
  changedFiles: IChangedFile[]
  issues: IEnrichedIssue[]
  commits: IAuditCommit[]
  className?: string
}

/** Tarjeta individual de estadística */
function StatCard({
  icon,
  label,
  value,
  detail,
  variant = 'default',
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  detail?: string
  variant?: 'default' | 'warning' | 'danger'
}) {
  const colorMap = {
    default: 'text-muted-foreground',
    warning: 'text-amber-600',
    danger: 'text-red-600',
  }

  return (
    <Card className="py-3">
      <CardContent className="flex items-center gap-3 px-4 py-0">
        <div className={cn('shrink-0', colorMap[variant])}>{icon}</div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={cn('text-lg font-semibold leading-tight', colorMap[variant])}>{value}</p>
          {detail && <p className="text-xs text-muted-foreground truncate">{detail}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

/** Resumen estadístico de la auditoría: archivos, issues, commits, líneas */
export function AuditSummary({ changedFiles, issues, commits, className }: IAuditSummaryProps) {
  const totalAdditions = changedFiles.reduce((sum, f) => sum + f.additions, 0)
  const totalDeletions = changedFiles.reduce((sum, f) => sum + f.deletions, 0)
  const criticalIssues = issues.filter(i => i.severity === 'critical' || i.severity === 'error').length

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-3', className)}>
      <StatCard
        icon={<FileCode2 className="size-5" />}
        label="Archivos"
        value={changedFiles.length}
        detail={`${totalAdditions + totalDeletions} líneas cambiadas`}
      />
      <StatCard
        icon={<AlertTriangle className="size-5" />}
        label="Issues"
        value={issues.length}
        detail={`${criticalIssues} críticos`}
        variant={criticalIssues > 0 ? 'danger' : 'default'}
      />
      <StatCard icon={<GitCommitHorizontal className="size-5" />} label="Commits" value={commits.length} />
      <StatCard
        icon={
          <span className="flex items-center gap-1">
            <Plus className="size-3.5 text-emerald-600" />
            <Minus className="size-3.5 text-red-500" />
          </span>
        }
        label="Cambios"
        value={`+${totalAdditions} / -${totalDeletions}`}
      />
    </div>
  )
}
