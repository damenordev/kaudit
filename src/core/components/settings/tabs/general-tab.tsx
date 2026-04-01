'use client'

import { Languages, Type } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SettingsSection } from '../settings-section'
import { LocaleSwitcher } from '../locale-switcher'
import { FontSwitcher } from '@/core/components/theme/font/font-switcher'

/** Tab general: idioma + tipografía agrupados */
export function GeneralTab() {
  const t = useTranslations('settings')

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-left-1 duration-300">
      <SettingsSection
        icon={Languages}
        title={t('general.title')}
        description={t('general.description')}
        action={<LocaleSwitcher />}
      />
      <SettingsSection icon={Type} title={t('typography.title')} description={t('typography.description')}>
        <FontSwitcher />
      </SettingsSection>
    </div>
  )
}
