import { Palette, Scaling, LayoutTemplate } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SettingsSection } from '../settings-section'
import { ThemeSwitcher } from '@/core/components/theme/palette/palette-switcher'
import { ThemeModeToggle } from '@/core/components/theme/palette/theme-mode-toggle'
import { RadiusSwitcher } from '@/core/components/theme/radius/radius-switcher'
import { SidebarVariantSwitcher } from '../sidebar-variant-switcher'

export function AppearanceTab() {
  const t = useTranslations('settings.appearance')

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-left-1 duration-300">
      <SettingsSection icon={Palette} title={t('title')} description={t('description')} action={<ThemeModeToggle />}>
        <ThemeSwitcher />
      </SettingsSection>

      <SettingsSection icon={Scaling} title={t('radius')} description={t('radiusDescription')}>
        <RadiusSwitcher />
      </SettingsSection>

      <SettingsSection icon={LayoutTemplate} title={t('layout.title')} description={t('layout.description')}>
        <SidebarVariantSwitcher />
      </SettingsSection>
    </div>
  )
}
