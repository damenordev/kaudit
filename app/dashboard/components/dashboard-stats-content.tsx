/**
 * Dashboard Stats Content - Streaming via Suspense.
 */
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { CheckCircle2, ShieldAlert, Activity, ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { getAuditStats } from '@/modules/audit/queries/stats.queries'
import { StatCard, AuditRow } from './dashboard-overview.components'
import { DashboardSeverityChart } from './dashboard-severity-chart'
import { DashboardStatusRing } from './dashboard-status-ring'
import { DashboardEmptyState } from './dashboard-empty-state'
import { routesConfig } from '@/core/config/routes.config'

function formatTimeAgo(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

function extractRepoName(repoUrl: string): string {
  return repoUrl.replace(/\.git$/, '').split('/').slice(-2).join('/') || repoUrl
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-32 rounded-xl border border-border/40 bg-muted/20" />
      ))}
      <div className="md:col-span-12 h-64 rounded-xl border border-border/40 bg-muted/20" />
    </div>
  )
}

async function DashboardStatsGrid() {
  const [t, stats] = await Promise.all([getTranslations('dashboard.overview'), getAuditStats()])
  
  const onboardingTranslations = t.raw('onboarding') as { title: string; description: string; step1: string; step2: string; step3: string; action: string; command: string }
  const severityTranslations = t.raw('issuesBySeverity') as { title: string; description: string; critical: string; error: string; warning: string; info: string }
  const statusTranslations = t.raw('statusDistribution') as { title: string; description: string }

  if (stats.totalAudits === 0) {
    return <DashboardEmptyState translations={onboardingTranslations} />
  }

  const completedCount = stats.auditsByStatus.find(s => s.status === 'completed')?.count ?? 0
  const pendingCount = stats.auditsByStatus.find(s => s.status === 'pending')?.count ?? 0

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard title={t('totalAudits')} value={stats.totalAudits} icon={<Activity className="size-4" />} />
        <StatCard title={t('completed')} value={completedCount} change={`${stats.approvalRate}%`} icon={<CheckCircle2 className="size-4" />} color="text-emerald-500" />
        <StatCard title={t('totalIssues')} value={stats.totalIssues} icon={<ShieldAlert className="size-4" />} color="text-amber-500" />
        <StatCard title={t('active')} value={pendingCount} icon={<Activity className="size-4" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full items-stretch">
        <DashboardSeverityChart issues={stats.issuesBySeverity} translations={severityTranslations} className="md:col-span-8" />
        <DashboardStatusRing stats={stats.auditsByStatus} total={stats.totalAudits} translations={statusTranslations} />
      </div>

      <div className="rounded-xl border border-border/40 bg-card overflow-hidden shadow-xs">
        <div className="p-4 px-6 border-b border-border/10 flex items-center justify-between bg-muted/5">
          <h3 className="text-xs font-black tracking-widest uppercase opacity-60 italic">{t('recentAudits.title')}</h3>
          <Link href={routesConfig.dashboard.audits.list} className="text-[10px] font-black uppercase italic text-primary hover:underline flex items-center gap-1 group">
            {t('viewFullAudit')} <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="divide-y divide-border/5">
          {stats.recentAudits.slice(0, 5).map(a => (
            <AuditRow key={a.id} id={a.id} user={extractRepoName(a.repoUrl)} action={`${a.branchName} (${a.issueCount} issues)`} time={formatTimeAgo(a.createdAt)} status={a.status.toUpperCase()} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardStatsContent() {
  return (
    <Suspense fallback={<DashboardStatsSkeleton />}>
      <DashboardStatsGrid />
    </Suspense>
  )
}
