import { getTranslations } from 'next-intl/server'

import { SettingsView } from '@/core/settings'

export default async function SettingsPage() {
  const t = await getTranslations('dashboard.nav')

  return (
    <section className="p-3" aria-labelledby="dashboard-settings-heading">
      <h1 id="dashboard-settings-heading" className="sr-only">
        {t('settings')}
      </h1>
      <SettingsView />
    </section>
  )
}
