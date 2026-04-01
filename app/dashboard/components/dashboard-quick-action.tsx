'use client'

import { useState } from 'react'
import { Terminal, Copy, Check } from 'lucide-react'
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

/** Dashboard Quick Action - Botón Copy-Paste Premium */
export function DashboardQuickAction({ translations, className }: IDashboardQuickActionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(translations.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'group relative overflow-hidden flex items-center gap-3 px-4 py-2 rounded-xl border border-border/40',
        'bg-background/80 backdrop-blur-xl shadow-sm transition-all duration-300',
        'hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--primary),0.2)] hover:-translate-y-0.5',
        className
      )}
    >
      {/* Interactive glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000 ease-in-out" />
      
      <div className="flex size-6 items-center justify-center rounded-md bg-muted/50 border border-border/30 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
        <Terminal className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      
      <code className="text-[13px] font-mono font-medium text-foreground/80 group-hover:text-foreground transition-colors tracking-tight">
        {translations.command}
      </code>
      
      <div className="ml-2 flex items-center justify-center w-5 h-5 rounded-full bg-muted/20 border border-border/10 group-hover:bg-background transition-colors">
        {copied ? (
          <Check className="size-3 text-emerald-500 scale-100 transition-transform" />
        ) : (
          <Copy className="size-3 text-muted-foreground/60 group-hover:text-primary transition-colors hover:scale-110" />
        )}
      </div>
    </button>
  )
}
