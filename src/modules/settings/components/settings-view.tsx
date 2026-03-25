'use client'

import { useTranslations } from 'next-intl'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/ui/navigation/tabs'
import { GeneralTab, AppearanceTab, TypographyTab, ProfileTab } from './tabs'
import type { TDateFormat } from '@/core/i18n/dates'
import type { TUserProfile } from '../models/profile.schema'

export interface ISettingsViewProps {
  timezone: string
  dateFormat: TDateFormat
  profile: TUserProfile | null
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

export function SettingsView({ timezone, dateFormat, profile, user }: ISettingsViewProps) {
  const t = useTranslations('settings')

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full max-w-[500px] grid-cols-4">
        <TabsTrigger value="general">{t('tabs.general')}</TabsTrigger>
        <TabsTrigger value="appearance">{t('tabs.appearance')}</TabsTrigger>
        <TabsTrigger value="typography">{t('tabs.typography')}</TabsTrigger>
        <TabsTrigger value="profile">{t('tabs.profile')}</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralTab timezone={timezone} dateFormat={dateFormat} />
      </TabsContent>

      <TabsContent value="appearance">
        <AppearanceTab />
      </TabsContent>

      <TabsContent value="typography">
        <TypographyTab />
      </TabsContent>

      <TabsContent value="profile">
        <ProfileTab profile={profile} user={user} />
      </TabsContent>
    </Tabs>
  )
}
