'use client'

import { useTranslations } from 'next-intl'
import { Palette, Scaling, LayoutTemplate } from 'lucide-react'
import { ThemeSwitcher, ThemeModeToggle } from '@/core/theme/palette'
import { RadiusSwitcher } from '@/core/theme/radius'
import { SidebarVariantPicker } from '../sidebar-variant-picker'
import type { TSidebarVariant } from '@/core/ui/navigation/sidebar.constants'

export interface IAppearanceStepProps {
  sidebarVariant: TSidebarVariant
}

export function AppearanceStep({ sidebarVariant }: IAppearanceStepProps) {
  const t = useTranslations('onboarding.appearance')

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black tracking-tight">{t('title')}</h2>
        <p className="text-muted-foreground text-sm">{t('description')}</p>
      </div>

      <div className="space-y-6">
        <div className="p-4 rounded-lg border border-border/40 bg-card/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                <Palette className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">{t('theme')}</h3>
                <p className="text-muted-foreground text-[11px]">{t('themeDescription')}</p>
              </div>
            </div>
            <ThemeModeToggle />
          </div>
          <ThemeSwitcher />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-card/50">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <Scaling className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">{t('radius')}</h3>
              <p className="text-muted-foreground text-[11px]">{t('radiusDescription')}</p>
            </div>
          </div>
          <RadiusSwitcher />
        </div>

        <div className="p-4 rounded-lg border border-border/40 bg-card/50 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <LayoutTemplate className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">{t('sidebar')}</h3>
              <p className="text-muted-foreground text-[11px]">{t('sidebarDescription')}</p>
            </div>
          </div>
          <SidebarVariantPicker initialVariant={sidebarVariant} />
        </div>
      </div>
    </div>
  )
}
