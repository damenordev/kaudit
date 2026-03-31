'use client'

import React, { useState } from 'react'
import { Terminal, Copy, Check } from 'lucide-react'
import { Card } from '@/core/ui/card'
import { Button } from '@/core/ui/button'
import { cn } from '@/core/utils/cn.utils'

interface IDashboardQuickActionProps {
  translations: {
    title: string
    description: string
    command: string
    copy: string
    copied: string
  }
  className?: string
}

export function DashboardQuickAction({ translations, className }: IDashboardQuickActionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(translations.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className={cn('p-4 bg-muted/40 border-border/40 shadow-xs flex flex-row items-center justify-between gap-4 overflow-hidden relative group', className)}>
      <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Terminal className="size-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black tracking-widest uppercase opacity-80">{translations.title}</span>
          <p className="text-[10px] text-muted-foreground font-medium">{translations.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-background/50 border border-border/50 rounded-lg p-1 pl-3 relative z-10 max-md:hidden">
        <code className="text-[10px] font-mono font-bold text-primary">{translations.command}</code>
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-7 hover:bg-primary/10 hover:text-primary"
          onClick={handleCopy}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        </Button>
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        className="md:hidden text-[10px] font-black uppercase h-8"
        onClick={handleCopy}
      >
        {copied ? translations.copied : translations.copy}
      </Button>
    </Card>
  )
}
