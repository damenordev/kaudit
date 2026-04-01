import type { IIssuesBySeverity } from '@/modules/audit/types/stats.types'
import { cn } from '@/core/utils/cn.utils'
import { AlertCircle, AlertTriangle, ShieldAlert, Info } from 'lucide-react'

interface IDashboardSeverityChartProps {
  issues: IIssuesBySeverity
  translations: {
    title: string
    description: string
    critical: string
    error: string
    warning: string
    info: string
  }
}

const SEVERITY_LEVELS = [
  { key: 'critical' as const, color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20', icon: ShieldAlert },
  { key: 'error' as const, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', icon: AlertCircle },
  { key: 'warning' as const, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', icon: AlertTriangle },
  { key: 'info' as const, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', icon: Info },
]

/** Panel Premium de Severidad: Grid cards glowing */
export function DashboardSeverityChart({ issues, translations }: IDashboardSeverityChartProps) {
  const items = SEVERITY_LEVELS.map(s => ({
    ...s,
    label: translations[s.key],
    count: issues?.[s.key] ?? 0,
  }))

  return (
    <div className="rounded-xl border border-border/40 bg-background/50 backdrop-blur-md p-6 overflow-hidden relative shadow-sm hover:shadow-md transition-shadow">
      {/* Subtle glow background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

      <h3 className="text-sm font-semibold mb-1">{translations.title}</h3>
      <p className="text-xs text-muted-foreground/80 mb-6">{translations.description}</p>
      
      <div className="grid grid-cols-2 gap-3">
        {items.map(item => {
          const Icon = item.icon
          return (
            <div 
              key={item.key} 
              className="group relative flex flex-col gap-3 p-4 rounded-xl border border-border/30 bg-card shadow-xs transition-all duration-300 hover:border-border/60 hover:-translate-y-0.5 overflow-hidden"
            >
              {/* Internal glow for each card based on severity color */}
              <div className={cn("absolute -bottom-6 -right-6 size-16 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40", item.color?.replace('text-', 'bg-'))} />
              
              <div className="flex items-center gap-3">
                <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg border", item.bg, item.color)}>
                  <Icon className="size-4" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className={cn("text-3xl font-bold tracking-tighter drop-shadow-sm", item.count > 0 ? item.color : 'text-muted-foreground/30')}>
                  {item.count}
                </span>
                {item.count > 0 && (
                  <span className="text-[10px] font-medium text-muted-foreground mb-1.5 bg-muted/50 px-2 py-0.5 rounded-full">
                    issues
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
