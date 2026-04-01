'use client'

import { useState } from 'react'
import { Copy, Check, Sparkles, Github, Key, LogIn, SearchCode, Rocket } from 'lucide-react'
import { cn } from '@/core/utils/cn.utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/core/ui/dialog'
import { Button } from '@/core/ui/button'

interface IDashboardEmptyStateProps {
  translations: {
    title: string
    description: string
    step1: string
    step2: string
    step3: string
    step4: string
    action: string
    command: string
  }
}

/** 
 * Onboarding Dialog Premium.
 * Sustituye el banner invasivo por un trigger elegante que abre una guía detallada.
 */
export function DashboardEmptyState({ translations }: IDashboardEmptyStateProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(translations.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const steps = [
    { 
      title: 'GitHub App',
      text: translations.step1, 
      icon: <Github className="size-5" />, 
      color: 'from-blue-500/20 to-indigo-500/20',
      textShadow: 'shadow-blue-500/20'
    },
    { 
      title: 'API Key',
      text: translations.step2, 
      icon: <Key className="size-5" />, 
      color: 'from-amber-500/20 to-orange-500/20',
      textShadow: 'shadow-amber-500/20'
    },
    { 
      title: 'Login CLI',
      text: translations.step3, 
      icon: <LogIn className="size-5" />, 
      color: 'from-primary/20 to-primary/5',
      textShadow: 'shadow-primary/20'
    },
    { 
      title: 'Audit',
      text: translations.step4, 
      icon: <SearchCode className="size-5" />, 
      color: 'from-emerald-500/20 to-teal-500/20',
      textShadow: 'shadow-emerald-500/20'
    }
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="font-bold gap-2 px-6"
        >
          <Rocket className="size-4" />
          Como usar
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] bg-black/90 backdrop-blur-3xl border-white/10 p-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 size-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 size-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <DialogHeader className="p-8 pb-4 relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-lg">
              <Sparkles className="size-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight text-white uppercase italic">
                {translations.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium text-sm">
                Sigue estos pasos para configurar tu entorno de auditoría.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-8 pb-8 space-y-4 relative z-10">
          <div className="grid grid-cols-1 gap-3">
            {steps.map((step, i) => (
              <div 
                key={i} 
                className="group/step relative flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <div className={cn(
                  "flex size-12 items-center justify-center rounded-xl bg-linear-to-br border border-white/10 text-white shadow-xl shrink-0 transition-transform group-hover/step:scale-110",
                  step.color
                )}>
                  {step.icon}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Paso 0{i + 1} • {step.title}</span>
                  <p className="text-sm font-bold text-white/90 leading-tight">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Ejecución Rápida</span>
                <code className="text-sm font-mono font-bold text-white tracking-tight">
                  {translations.command}
                </code>
              </div>
              <Button
                onClick={handleCopy}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-lg active:scale-95"
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
                <span className="ml-2">{copied ? 'Copiado' : 'Copiar'}</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
