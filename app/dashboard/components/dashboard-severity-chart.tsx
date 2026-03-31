'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/core/ui/card'
import { TrendingUp, Activity } from 'lucide-react'
import { cn } from '@/core/utils/cn.utils'

interface IIssueSeverity {
  label: string
  count: number
  color: string
}

interface IDashboardSeverityChartProps {
  issues: {
    critical: number
    error: number
    warning: number
    info: number
  }
  translations: {
    title: string
    description: string
    critical: string
    error: string
    warning: string
    info: string
  }
  className?: string
}

export function DashboardSeverityChart({ issues, translations, className }: IDashboardSeverityChartProps) {
  const items: IIssueSeverity[] = [
    { label: translations.critical, count: issues.critical, color: 'bg-destructive' },
    { label: translations.error, count: issues.error, color: 'bg-orange-500' },
    { label: translations.warning, count: issues.warning, color: 'bg-amber-500' },
    { label: translations.info, count: issues.info, color: 'bg-blue-500' },
  ]

  const maxVal = Math.max(...items.map(i => i.count), 1)

  return (
    <Card className={cn('md:col-span-12 border-border/40 bg-card/50 shadow-xs overflow-hidden h-full flex flex-col', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/10">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-black tracking-widest uppercase opacity-70 italic flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            {translations.title}
          </CardTitle>
          <CardDescription className="text-[10px] font-bold text-primary tracking-tight opacity-50">
            {translations.description}
          </CardDescription>
        </div>
        <TrendingUp className="size-4 text-primary opacity-30" />
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col justify-center gap-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-size-[20px_20px] bg-[radial-gradient(circle,var(--primary)_1px,transparent_1px)]" />
        
        {items.map(item => (
          <div key={item.label} className="flex flex-col gap-1.5 relative z-10 group">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
              <span className="text-xs font-black italic tracking-tighter text-primary">
                {item.count}
              </span>
            </div>
            <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden border border-border/20 shadow-inner">
              <div 
                className={cn('h-full transition-all duration-1000 ease-out-expo rounded-full shadow-lg', item.color)}
                style={{ width: `${(item.count / maxVal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
