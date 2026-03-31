'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/core/ui/card'
import { PieChart, Circle } from 'lucide-react'
import { cn } from '@/core/utils/cn.utils'

interface IDashboardStatusRingProps {
  stats: { status: string, count: number }[]
  total: number
  translations: {
    title: string
    description: string
  }
}

export function DashboardStatusRing({ stats, total, translations }: IDashboardStatusRingProps) {
  const statusColors: Record<string, string> = {
    completed: 'text-emerald-500 bg-emerald-500',
    failed: 'text-destructive bg-destructive',
    pending: 'text-amber-500 bg-amber-500',
    processing: 'text-blue-500 bg-blue-500',
    validating: 'text-purple-500 bg-purple-500',
    generating: 'text-cyan-500 bg-cyan-500',
    blocked: 'text-muted-foreground bg-muted-foreground',
  }

  // Prepara los datos para el gradiente cónico mediante un cálculo puro
  const pieData = stats.reduce((acc: { parts: string[], total: number }, s) => {
    const start = acc.total
    const percentage = (s.count / (total || 1)) * 100
    const end = start + percentage
    const colorClass = statusColors[s.status]?.split(' ')[1] ?? 'bg-muted'
    
    return {
      parts: [...acc.parts, `${colorClass} ${start}% ${end}%`],
      total: end
    }
  }, { parts: [], total: 0 })

  const gradientParts = pieData.parts.join(', ')

  return (
    <Card className="md:col-span-4 border-border/40 bg-card/60 shadow-xs flex flex-col justify-between overflow-hidden relative group">
      <CardHeader className="p-4 pb-2 border-b border-border/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-black tracking-widest uppercase opacity-70 flex items-center gap-2">
            <PieChart className="size-4 text-primary" />
            {translations.title}
          </CardTitle>
          <Circle className="size-4 text-muted-foreground opacity-20" />
        </div>
        <CardDescription className="text-[10px] font-bold text-muted-foreground tracking-tight italic">
          {translations.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 pt-0 flex flex-col items-center justify-center gap-6 relative flex-1">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-size-[20px_20px] bg-[radial-gradient(circle,var(--primary)_1px,transparent_1px)]" />

        <div className="size-32 rounded-full relative shadow-lg flex items-center justify-center p-2 isolate group-hover:scale-105 transition-transform duration-500">
           <div 
             className="absolute inset-0 rounded-full opacity-30 blur-xl group-hover:blur-2xl transition-all"
             style={{ background: `conic-gradient(${gradientParts || '#888 0 100%'})` }}
           />
           <div 
             className="size-full rounded-full ring-4 ring-background z-10" 
             style={{ background: `conic-gradient(${gradientParts || '#888 0 100%'})` }}
           />
           <div className="absolute size-24 rounded-full bg-card z-20 flex flex-col items-center justify-center shadow-inner">
             <span className="text-2xl font-black italic tracking-tighter leading-none">{total}</span>
             <span className="text-[10px] font-black uppercase opacity-40">Audits</span>
           </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-x-6 gap-y-2 relative z-10">
          {stats.map(s => (
            <div key={s.status} className="flex items-center justify-between py-1 border-b border-border/10 group/item">
              <div className="flex items-center gap-2">
                <div className={cn('size-1.5 rounded-full ring-2 ring-background', statusColors[s.status]?.split(' ')[1] ?? 'bg-muted')} />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover/item:opacity-100 transition-opacity">
                  {s.status}
                </span>
              </div>
              <span className="text-[10px] font-black italic text-primary">{s.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
