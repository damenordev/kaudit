/**
 * Dashboard Overview con datos reales de auditorías.
 * Server Component optimizado con Suspense para streaming progresivo.
 * El header se renderiza inmediatamente mientras las estadísticas cargan.
 */
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Badge } from '@/core/ui/badge'
import { LayoutGrid, Cpu } from 'lucide-react'

import { DashboardStatsContent } from './components/dashboard-stats-content'

export const metadata: Metadata = {
  title: 'Dashboard Overview',
  description: 'Panel de control con estadísticas de auditorías',
}

export default async function DashboardPage() {
  const t = await getTranslations('dashboard.overview')

  return (
    <div className="flex flex-col gap-3 p-3 w-full animate-in fade-in duration-500">
      {/* Header — se renderiza inmediatamente */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayoutGrid className="size-5 text-primary" />
            <h1 className="text-3xl font-black tracking-tighter uppercase">{t('title')}</h1>
          </div>
          <p className="text-sm text-muted-foreground font-medium">{t('description')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="font-bold px-3 py-1 bg-primary/5 text-primary border-primary/20">
            AUDITS
          </Badge>
          <div className="size-9 rounded-lg border border-border/50 flex items-center justify-center bg-card shadow-xs">
            <Cpu className="size-4 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Estadísticas — cargan vía Suspense con streaming */}
      <DashboardStatsContent />
    </div>
  )
}
