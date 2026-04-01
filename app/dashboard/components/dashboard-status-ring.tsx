import { cn } from '@/core/utils/cn.utils'
import { CheckCircle2, CircleDashed, Target, AlertTriangle, AlertOctagon } from 'lucide-react'

interface IAuditStatus {
  status: string
  count: number
}

interface IDashboardStatusRingProps {
  stats: IAuditStatus[]
  total: number
  translations: { title: string; description: string }
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  completed: { color: 'text-emerald-500', bg: 'bg-emerald-500', icon: <CheckCircle2 className="size-4" /> },
  pending: { color: 'text-blue-500', bg: 'bg-blue-500', icon: <CircleDashed className="size-4 animate-[spin_4s_linear_infinite]" /> },
  processing: { color: 'text-amber-500', bg: 'bg-amber-500', icon: <Target className="size-4" /> },
  failed: { color: 'text-destructive', bg: 'bg-destructive', icon: <AlertOctagon className="size-4" /> },
  blocked: { color: 'text-destructive', bg: 'bg-destructive', icon: <AlertTriangle className="size-4" /> },
}

/** Panel Premium de Distribución de Estado: Barras de progresión flotantes */
export function DashboardStatusRing({ stats, total, translations }: IDashboardStatusRingProps) {
  const sorted = [...stats].filter(s => s.count > 0).sort((a, b) => b.count - a.count)

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/40 bg-background/50 backdrop-blur-md p-6 shadow-sm transition-all hover:shadow-md hover:border-border/60">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

      <h3 className="text-sm font-semibold mb-1">{translations.title}</h3>
      <p className="text-xs text-muted-foreground/80 mb-6">{translations.description}</p>

      {/* Stacked Progress Bar */}
      <div className="relative flex h-3 w-full overflow-hidden rounded-full bg-muted/20 mb-6 group ring-1 ring-border/30">
        {sorted.map((s, i) => {
          const pct = total > 0 ? (s.count / total) * 100 : 0
          const config = STATUS_CONFIG[s.status] ?? { color: 'text-muted-foreground', bg: 'bg-muted-foreground' }
          // The hover logic reveals the individual pct on hover but keeps it simple
          return (
            <div
              key={s.status}
              className={cn(
                'relative h-full transition-all duration-1000 origin-left hover:brightness-110 active:brightness-90',
                config.bg,
                i > 0 && 'border-l border-background/50'
              )}
              style={{ width: `${pct}%` }}
              title={`${s.status}: ${pct.toFixed(1)}%`}
            >
              {/* Sutil glow dentro de la barra */}
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )
        })}
      </div>

      {/* Legend Grid */}
      <div className="grid gap-3">
        {sorted.map(s => {
          const config = STATUS_CONFIG[s.status] ?? { color: 'text-muted-foreground', bg: 'bg-muted-foreground', icon: <CircleDashed className="size-4" /> }
          const pct = total > 0 ? ((s.count / total) * 100).toFixed(0) : '0'
          return (
            <div key={s.status} className="group flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-border/40 hover:bg-muted/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/20 shadow-xs", config.bg.replace('bg-', 'bg-').concat('/10'), config.color)}>
                  {config.icon}
                </div>
                <div className="flex flex-col">
                  <span className="capitalize text-sm font-medium">{s.status}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{pct}% of total</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className={cn("text-xl font-bold tabular-nums tracking-tight", config.color)}>{s.count}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
