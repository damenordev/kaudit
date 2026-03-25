'use client'

import { Languages } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SettingsSection } from '../settings-section'
import { LocaleSwitcher } from '../locale-switcher'
export function GeneralTab() {
  const t = useTranslations('settings.general')

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-left-1 duration-300">
      <SettingsSection icon={Languages} title={t('title')} description={t('description')} action={<LocaleSwitcher />} />
    </div>
  )
}
