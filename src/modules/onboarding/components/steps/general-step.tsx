'use client'

import { useTranslations } from 'next-intl'
import { Languages, Globe, CalendarDays } from 'lucide-react'
import { LocaleSwitcher } from '@/modules/settings/components/locale-switcher'
import { TimezoneSwitcher, DateFormatSwitcher, type TDateFormat } from '@/core/i18n/dates'

export interface IGeneralStepProps {
  timezone: string
  dateFormat: TDateFormat
}

export function GeneralStep({ timezone, dateFormat }: IGeneralStepProps) {
  const t = useTranslations('onboarding.general')

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black tracking-tight">{t('title')}</h2>
        <p className="text-muted-foreground text-sm">{t('description')}</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-card/50">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <Languages className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">{t('language')}</h3>
              <p className="text-muted-foreground text-[11px]">{t('languageDescription')}</p>
            </div>
          </div>
          <LocaleSwitcher />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-card/50">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <Globe className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">{t('timezone')}</h3>
              <p className="text-muted-foreground text-[11px]">{t('timezoneDescription')}</p>
            </div>
          </div>
          <TimezoneSwitcher initialValue={timezone} />
        </div>

        <div className="p-4 rounded-lg border border-border/40 bg-card/50 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">{t('dateFormat')}</h3>
              <p className="text-muted-foreground text-[11px]">{t('dateFormatDescription')}</p>
            </div>
          </div>
          <DateFormatSwitcher initialValue={dateFormat} />
        </div>
      </div>
    </div>
  )
}
