import { Type } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SettingsSection } from '../settings-section'
import { FontSwitcher } from '@/core/theme/font'

export function TypographyTab() {
  const t = useTranslations('settings.typography')

  return (
    <div className="space-y-4 animate-in fade-in-50 slide-in-from-left-1 duration-300">
      <SettingsSection icon={Type} title={t('title')} description={t('description')}>
        <FontSwitcher />
      </SettingsSection>
    </div>
  )
}
