'use client'

import { useTranslations } from 'next-intl'
import { Type } from 'lucide-react'
import { FontSwitcher } from '@/core/theme/font'

export function TypographyStep() {
  const t = useTranslations('onboarding.typography')

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black tracking-tight">{t('title')}</h2>
        <p className="text-muted-foreground text-sm">{t('description')}</p>
      </div>

      <div className="p-4 rounded-lg border border-border/40 bg-card/50 space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
            <Type className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">{t('font')}</h3>
            <p className="text-muted-foreground text-[11px]">{t('fontDescription')}</p>
          </div>
        </div>
        <FontSwitcher />
      </div>
    </div>
  )
}
