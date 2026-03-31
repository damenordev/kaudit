/**
 * Componentes de UI para el dashboard overview.
 * StatCard y LogItem tipados sin uso de `any`.
 */
import { Badge } from '@/core/ui/badge'
import { Card } from '@/core/ui/card'
import { Avatar, AvatarFallback } from '@/core/ui/avatar'
import { Clock, ArrowUpRight } from 'lucide-react'
import { cn } from '@/core/utils/cn.utils'

export interface IStatCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
  color?: string
}

export interface ILogItemProps {
  user: string
  action: string
  time: string
  status?: string
}

export function StatCard({ title, value, change, icon, color }: IStatCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-3 border-border/40 shadow-xs hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black tracking-widest uppercase opacity-40">{title}</span>
        <div className={cn('p-1.5 rounded-md bg-muted/40 shadow-inner', color)}>{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-black tracking-tighter italic leading-none">{value}</div>
        {change && (
          <div className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
            <ArrowUpRight className="size-3 mr-0.5" /> {change}
          </div>
        )}
      </div>
    </Card>
  )
}

export function LogItem({ user, action, time, status }: ILogItemProps) {
  return (
    <div className="flex items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors group">
      <div className="flex items-center gap-4">
        <Avatar size="sm" className="border border-border/50 shadow-xs">
          <AvatarFallback className="text-[10px] font-black italic">{user[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-[11px] font-black tracking-tight">{user}</span>
          <span className="text-[10px] text-muted-foreground lowercase italic">/ {action}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Clock className="size-3" /> {time}
        </span>
        <Badge variant="outline" className="text-[9px] font-black py-0 px-2 h-5 border-border/50">
          {status || 'SNC'}
        </Badge>
      </div>
    </div>
  )
}
