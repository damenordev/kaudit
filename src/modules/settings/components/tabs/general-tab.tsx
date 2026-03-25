'use client'

import { Languages, Globe, CalendarDays } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SettingsSection } from '../settings-section'
import { LocaleSwitcher } from '../locale-switcher'
import { TimezoneSwitcher, DateFormatSwitcher, type TDateFormat } from '@/core/i18n/dates'

export interface IGeneralTabProps {
  timezone: string
  dateFormat: TDateFormat
}

export function GeneralTab({ timezone, dateFormat }: IGeneralTabProps) {
  const t = useTranslations('settings.general')

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-left-1 duration-300">
      <SettingsSection icon={Languages} title={t('title')} description={t('description')} action={<LocaleSwitcher />} />

      <SettingsSection
        icon={Globe}
        title={t('timezone')}
        description={t('timezoneDescription')}
        action={<TimezoneSwitcher initialValue={timezone} />}
      />

      <SettingsSection icon={CalendarDays} title={t('dateFormat')} description={t('dateFormatDescription')}>
        <DateFormatSwitcher initialValue={dateFormat} />
      </SettingsSection>
    </div>
  )
}
