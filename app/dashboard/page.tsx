/**
 * Dashboard Overview - Real data from audits.
 * Server Component optimized with Suspense for progressive streaming.
 */
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DashboardStatsContent } from './components/dashboard-stats-content'
import { DashboardQuickAction } from './components/dashboard-quick-action'

export const metadata: Metadata = {
  title: 'Dashboard Overview',
  description: 'Mission Control with historical stats and real-time audit activity.',
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
    <div className="flex flex-col gap-8 p-4 md:p-8 w-full animate-in fade-in duration-700 max-w-(--breakpoint-2xl) mx-auto">
      {/* Header — Static and visible immediately */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">{t('title')}</h1>
          <p className="text-sm md:text-base text-muted-foreground font-bold tracking-tight opacity-50">{t('description')}</p>
        </div>
        <DashboardQuickAction 
          translations={quickActionT} 
          className="w-full lg:w-auto min-w-[320px]" 
        />
      </header>

      {/* Statistics and Charts — Dynamic streaming content via Suspense */}
      <DashboardStatsContent />
    </div>
  )
}
