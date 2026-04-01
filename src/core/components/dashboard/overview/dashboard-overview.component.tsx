import { cn } from '@/core/utils/cn.utils'
import { Badge } from '@/core/ui/badge'
import Link from 'next/link'
import { routesConfig } from '@/core/config/routes.config'
import { ArrowUpRight } from 'lucide-react'

export interface IStatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  subtitle?: string
  color?: string
  trend?: 'up' | 'down' | 'neutral'
}

/** StatCard Premium con Glassmorphism y sutiles gradientes */
export function StatCard({ title, value, icon, subtitle, color, trend }: IStatCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-xl border border-border/40 bg-background/50 backdrop-blur-md p-5 transition-all duration-300 hover:border-border/80 hover:shadow-lg hover:-translate-y-0.5">
      {/* Background Glow */}
      <div className={cn("absolute -right-8 -top-8 size-32 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20", color?.replace('text-', 'bg-'))} />
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className={cn('flex size-10 items-center justify-center rounded-lg bg-background shadow-xs border border-border/30 transition-transform group-hover:scale-110 duration-300', color)}>
            {icon}
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">{value}</span>
            {trend === 'up' && <span className="text-xs font-semibold text-emerald-500 flex items-center">↑ 12%</span>}
            {trend === 'down' && <span className="text-xs font-semibold text-destructive flex items-center">↓ 4%</span>}
          </div>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
      </div>
    </div>
  )
}

export interface IAuditRowProps {
  id: string
  repo: string
  branch: string
  issues: number
  time: string
  status: string
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  completed: 'default',
  failed: 'destructive',
  processing: 'secondary',
  pending: 'outline',
  blocked: 'destructive',
}

/** Fila de auditoría moderna con estados visuales mejorados */
export function AuditRow({ id, repo, branch, issues, time, status }: IAuditRowProps) {
  const variant = STATUS_VARIANT[status] ?? 'outline'
  const isFailed = status === 'failed'

  return (
    <Link
      href={routesConfig.dashboard.audits.detail(id)}
      className="group relative flex items-center justify-between gap-4 p-4 transition-all duration-300 hover:bg-muted/10 border-b border-border/20 last:border-0"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full border shadow-xs transition-colors duration-300",
          isFailed ? "bg-destructive/10 border-destructive/20 text-destructive group-hover:bg-destructive/20" : "bg-primary/10 border-primary/20 text-primary group-hover:bg-primary/20"
        )}>
          <span className="text-sm font-bold">{repo.slice(0,2).toUpperCase()}</span>
        </div>
        
        <div className="grid gap-1 min-w-0">
          <span className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{repo}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate max-w-[120px]">{branch}</span>
            <span>•</span>
            <span className={cn(issues > 0 && "text-amber-500 font-medium")}>{issues} issues</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden sm:flex flex-col items-end gap-1">
          <Badge variant={variant} className="capitalize shadow-xs">{status}</Badge>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{time}</span>
        </div>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background border border-border/30 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:border-primary/30 group-hover:text-primary shadow-xs">
          <ArrowUpRight className="size-4" />
        </div>
      </div>
    </Link>
  )
}
