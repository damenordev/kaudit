'use client'

import { useTranslations } from 'next-intl'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/ui/navigation/tabs'
import { GeneralTab, AppearanceTab, TypographyTab } from './tabs'

export function SettingsView() {
  const t = useTranslations('settings')

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full max-w-[400px] grid-cols-3">
        <TabsTrigger value="general">{t('tabs.general')}</TabsTrigger>
        <TabsTrigger value="appearance">{t('tabs.appearance')}</TabsTrigger>
        <TabsTrigger value="typography">{t('tabs.typography')}</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralTab />
      </TabsContent>

      <TabsContent value="appearance">
        <AppearanceTab />
      </TabsContent>

      <TabsContent value="typography">
        <TypographyTab />
      </TabsContent>
    </Tabs>
  )
}
