'use client'

import { useTranslations } from 'next-intl'
import { CheckCircle2, PartyPopper } from 'lucide-react'
import { Button } from '@/core/ui/primitives/button'
import { completeOnboardingAction } from '../../actions/onboarding.actions'

export function CompleteStep() {
  const t = useTranslations('onboarding.complete')

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-12">
      <div className="relative">
        <div className="size-24 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="size-12 text-emerald-500" />
        </div>
        <div className="absolute -top-2 -right-2 size-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
          <PartyPopper className="size-4" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-black tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground max-w-md">{t('description')}</p>
      </div>

      <div className="pt-4">
        <form action={completeOnboardingAction}>
          <Button type="submit" size="lg" className="px-8 gap-2">
            {t('goToDashboard')}
          </Button>
        </form>
      </div>
    </div>
  )
}
