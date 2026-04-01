'use client'

import { useState } from 'react'
import { Terminal, Copy, Check, Rocket, Sparkles } from 'lucide-react'

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

/** Estado vacío Premium — Glowing hero box */
export function DashboardEmptyState({ translations }: IDashboardEmptyStateProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(translations.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const steps = [translations.step1, translations.step2, translations.step3]

  return (
    <div className="relative flex flex-col items-center justify-center p-12 max-w-2xl mx-auto mt-10 rounded-2xl border border-border/40 bg-background/50 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-700 ease-out overflow-hidden group hover:border-border/60 transition-all">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 group-hover:bg-primary/20 transition-colors duration-1000" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] -z-10" />

      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-6 shadow-xs relative">
        <Rocket className="size-8" />
        <Sparkles className="absolute -top-2 -right-2 size-5 text-amber-400 animate-pulse" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-3 text-center text-foreground/90">{translations.title}</h2>
      <p className="text-sm text-muted-foreground/80 mb-10 text-center max-w-md mx-auto leading-relaxed">{translations.description}</p>

      <div className="w-full max-w-md space-y-4 mb-10">
        {steps.map((step, i) => (
          <div key={`step-${i}`} className="flex items-center gap-4 text-left p-3 rounded-xl border border-border/30 bg-muted/10 hover:bg-muted/30 transition-colors shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary shrink-0 shadow-inner">
              {i + 1}
            </span>
            <span className="text-sm text-foreground/80 font-medium">{step}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleCopy}
        className="group/btn relative overflow-hidden flex items-center gap-3 px-6 py-3.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/15 transition-all shadow-[0_0_20px_rgba(var(--primary),0.1)] hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] hover:-translate-y-0.5 w-full max-w-md justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover/btn:opacity-100 transition-opacity translate-x-[-100%] group-hover/btn:translate-x-[100%] duration-1000 ease-in-out" />
        
        <Terminal className="size-4 text-primary shrink-0" />
        <code className="text-[14px] font-mono font-bold text-primary tracking-tight">
          {translations.command}
        </code>
        {copied
          ? <Check className="size-4 text-emerald-500 shrink-0 ml-2" />
          : <Copy className="size-4 text-primary/60 group-hover/btn:text-primary transition-colors shrink-0 ml-2" />
        }
      </button>
    </div>
  )
}
