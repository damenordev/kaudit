'use client'

import { useTranslations } from 'next-intl'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/ui/tabs'
import { GeneralTab, AppearanceTab } from './tabs'

export function SettingsView() {
  const t = useTranslations('settings')

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full max-w-[500px] grid-cols-2">
        <TabsTrigger value="general">{t('tabs.general')}</TabsTrigger>
        <TabsTrigger value="appearance">{t('tabs.appearance')}</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralTab />
      </TabsContent>

      <TabsContent value="appearance">
        <AppearanceTab />
      </TabsContent>
    </Tabs>
  )
}
