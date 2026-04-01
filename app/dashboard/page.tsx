/**
 * Dashboard Overview — Server Component con Suspense para streaming.
 */
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DashboardStatsContent } from '@/core/components/dashboard/overview/dashboard-stats-content.component'
import { DashboardEmptyState } from '@/core/components/dashboard/overview/dashboard-empty-state.component'

export const metadata: Metadata = {
  title: 'Dashboard | KAudit',
  description: 'Monitorización de sistemas y métricas críticas en tiempo real.',
}

interface IOnboardingTranslations {
  title: string
  description: string
  step1: string
  step2: string
  step3: string
  step4: string
  action: string
  command: string
}

export default async function DashboardPage() {
  const t = await getTranslations('dashboard.overview')
  const onboardingT = t.raw('onboarding') as IOnboardingTranslations

  return (
    <div className="flex flex-col gap-6 p-3 w-full animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-black tracking-tight uppercase italic text-white">{t('title')}</h1>
          <p className="text-[11px] font-medium text-muted-foreground/60">{t('description')}</p>
        </div>
        <DashboardEmptyState translations={onboardingT} />
      </header>

      <DashboardStatsContent />
    </div>
  )
}
