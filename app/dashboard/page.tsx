/**
 * Dashboard Overview — Server Component con Suspense para streaming.
 */
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DashboardStatsContent } from './components/dashboard-stats-content'
import { DashboardQuickAction } from './components/dashboard-quick-action'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Monitorización de sistemas y métricas críticas en tiempo real.',
}

interface IQuickActionTranslations {
  title: string
  description: string
  command: string
  copy: string
  copied: string
}

export default async function DashboardPage() {
  const t = await getTranslations('dashboard.overview')
  const quickActionT = t.raw('quickAction') as IQuickActionTranslations

  return (
    <div className="flex flex-col gap-6 p-3 w-full">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{t('title')}</h1>
          <p className="text-xs text-muted-foreground/60">{t('description')}</p>
        </div>
        <DashboardQuickAction translations={quickActionT} />
      </header>

      <DashboardStatsContent />
    </div>
  )
}
