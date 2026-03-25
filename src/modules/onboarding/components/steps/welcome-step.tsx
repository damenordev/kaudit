'use client'

import { useTranslations } from 'next-intl'
import { Rocket, Sparkles } from 'lucide-react'
import { Button } from '@/core/ui/primitives/button'

export interface IWelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: IWelcomeStepProps) {
  const t = useTranslations('onboarding.welcome')

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-12">
      <div className="relative">
        <div className="size-24 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Rocket className="size-12 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          <Sparkles className="size-4" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-black tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground max-w-md">{t('description')}</p>
      </div>

      <div className="space-y-4 pt-4">
        <Button size="lg" onClick={onNext} className="px-8 gap-2">
          {t('getStarted')}
        </Button>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('takesMinutes')}</p>
      </div>
    </div>
  )
}
