import Link from 'next/link'
import { Badge } from '@/core/ui/badge'
import { Card } from '@/core/ui/card'
import { Avatar, AvatarFallback } from '@/core/ui/avatar'
import { Clock, ArrowUpRight, ChevronRight } from 'lucide-react'
import { cn } from '@/core/utils/cn.utils'
import { routesConfig } from '@/core/config/routes.config'

export interface IStatCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
  color?: string
}

export interface IAuditRowProps {
  id: string
  user: string
  action: string
  time: string
  status?: string
}

export function StatCard({ title, value, change, icon, color }: IStatCardProps) {
  return (
    <Card className="p-5 flex flex-col gap-4 border-border/40 shadow-xs hover:border-primary/40 transition-all group overflow-hidden relative isolate">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black tracking-widest uppercase opacity-40 group-hover:opacity-80 transition-opacity">
            {title}
          </span>
          <div className="text-3xl font-black tracking-tighter italic leading-none text-foreground">{value}</div>
        </div>
        <div
          className={cn(
            'p-2.5 rounded-xl bg-muted/60 shadow-inner group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 scale-95 group-hover:scale-100',
            color
          )}
        >
          {icon}
        </div>
      </div>

      {change && (
        <div className="flex items-center gap-1.5 relative z-10">
          <div className="flex items-center text-[10px] font-black italic text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10 shadow-sm">
            <ArrowUpRight className="size-3 mr-0.5" /> {change}
          </div>
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
            Progress
          </span>
        </div>
      )}
    </Card>
  )
}

export function AuditRow({ id, user, action, time, status }: IAuditRowProps) {
  const statusColors: Record<string, string> = {
    COMPLETED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5',
    FAILED: 'bg-destructive/10 text-destructive border-destructive/20 shadow-destructive/5',
    PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5',
    PROCESSING: 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/5',
    VALIDATING: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 shadow-indigo-500/5',
    GENERATING: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20 shadow-cyan-500/5',
  }

  const statusLabel = status ?? 'SNC'

  return (
    <Link
      href={routesConfig.dashboard.audits.detail(id)}
      className="flex items-center justify-between p-4 px-6 hover:bg-muted/40 transition-all group/row border-b border-border last:border-0 relative isolate"
    >
      <div className="absolute left-0 top-0 w-1 h-full bg-primary opacity-0 group-hover/row:opacity-100 transition-opacity" />
      <div className="flex items-center gap-4 relative z-10">
        <Avatar
          size="sm"
          className="border border-border/50 shadow-xs ring-4 ring-transparent group-hover/row:ring-primary/5 transition-all"
        >
          <AvatarFallback className="text-[10px] font-black italic bg-muted">{user[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-xs font-black tracking-tight group-hover/row:text-primary transition-colors">
            {user}
          </span>
          <span className="text-[10px] text-muted-foreground lowercase italic font-medium">/ {action}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Clock className="size-3" /> {time}
        </span>
        <Badge variant="outline" className="text-[9px] font-black py-0 px-2 h-5 border-border/50">
          {status ?? 'SNC'}
        </Badge>
      </div>
    </Link>
  )
}
