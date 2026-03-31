'use client'

import React, { useState } from 'react'
import { Rocket, Terminal, Copy, Check, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/core/ui/card'
import { Button } from '@/core/ui/button'

interface IDashboardEmptyStateProps {
  translations: {
    title: string
    description: string
    step1: string
    step2: string
    step3: string
    action: string
    command: string
  }
}

export function DashboardEmptyState({ translations }: IDashboardEmptyStateProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(translations.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 py-16 animate-in fade-in slide-in-from-bottom-5 duration-700 max-w-4xl mx-auto text-center">
      <div className="relative size-24 mb-12 flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping blur-3xl" />
        <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-transparent rounded-full shadow-2xl" />
        <Rocket className="size-12 text-primary drop-shadow-lg animate-pulse" />
      </div>

      <header className="space-y-4 mb-12">
        <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
          {translations.title}
        </h2>
        <p className="text-sm text-muted-foreground font-bold tracking-tight max-w-lg mx-auto opacity-70">
          {translations.description}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-border/20 -translate-y-1/2 hidden md:block" />
        
        {/* Step 1 */}
        <div className="flex flex-col items-center gap-4 group relative bg-background p-4 rounded-xl border border-border/10 shadow-xs hover:border-primary/30 transition-all">
          <div className="size-10 rounded-full bg-muted border border-border/40 flex items-center justify-center text-xs font-black font-mono relative z-10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">1</div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60 relative z-10">{translations.step1}</span>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center gap-4 group relative bg-background p-4 rounded-xl border border-border/10 shadow-xs hover:border-primary/30 transition-all">
          <div className="size-10 rounded-full bg-muted border border-border/40 flex items-center justify-center text-xs font-black font-mono relative z-10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">2</div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60 relative z-10">{translations.step2}</span>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center gap-4 group relative bg-background p-4 rounded-xl border border-border/10 shadow-xs hover:border-primary/30 transition-all">
          <div className="size-10 rounded-full bg-muted border border-border/40 flex items-center justify-center text-xs font-black font-mono relative z-10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">3</div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60 relative z-10">{translations.step3}</span>
        </div>
      </div>

      <Card className="w-full max-w-2xl bg-muted/30 border-border/40 p-6 shadow-2xl relative overflow-hidden group/card backdrop-blur-sm">
        <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
        <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-primary" />
            <span className="text-[10px] font-black tracking-widest uppercase opacity-40">Ready to Ship?</span>
          </div>
          <Button variant="link" size="sm" className="text-[10px] font-black uppercase italic p-0 h-auto">
            Documentation <ExternalLink className="size-3 ml-2" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex flex-col md:flex-row items-center gap-4 relative z-10">
          <div className="flex-1 w-full p-4 rounded-xl bg-background/80 border border-border/40 font-mono text-sm font-bold text-primary shadow-inner group/code hover:border-primary/50 transition-colors">
            {translations.command}
          </div>
          <Button 
            className="w-full md:w-auto h-12 px-8 font-black uppercase tracking-tighter italic text-md group/btn"
            onClick={handleCopy}
          >
            {copied ? <Check className="size-5 mr-3" /> : <Copy className="size-5 mr-3 group-hover/btn:scale-110 transition-transform" /> }
            {copied ? 'Copied' : translations.action}
          </Button>
        </CardContent>
      </Card>
      
      <div className="mt-16 w-full max-w-lg mx-auto opacity-[0.03] grayscale pointer-events-none uppercase font-black tracking-[1em] text-4xl text-foreground">
        KAudit Core Active
      </div>
    </div>
  )
}
