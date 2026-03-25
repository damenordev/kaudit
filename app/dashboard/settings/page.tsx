import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { SettingsView } from '@/modules/settings'
import { getProfile, getCurrentUser } from '@/modules/settings/services'
import {
  TIMEZONE_COOKIE_NAME,
  DATE_FORMAT_COOKIE_NAME,
  DEFAULT_TIMEZONE,
  DEFAULT_DATE_FORMAT,
  type TDateFormat,
} from '@/core/i18n/dates'

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const t = await getTranslations('dashboard.nav')

  const timezone = cookieStore.get(TIMEZONE_COOKIE_NAME)?.value ?? DEFAULT_TIMEZONE
  const dateFormat = (cookieStore.get(DATE_FORMAT_COOKIE_NAME)?.value as TDateFormat) ?? DEFAULT_DATE_FORMAT

  // Obtener datos del usuario y perfil
  const user = await getCurrentUser()
  const profile = await getProfile()

  return (
    <section className="p-3" aria-labelledby="dashboard-settings-heading">
      <h1 id="dashboard-settings-heading" className="sr-only">
        {t('settings')}
      </h1>
      <SettingsView
        timezone={timezone}
        dateFormat={dateFormat}
        profile={profile}
        user={
          user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image ?? null,
              }
            : {
                id: '',
                name: '',
                email: '',
                image: null,
              }
        }
      />
    </section>
  )
}
