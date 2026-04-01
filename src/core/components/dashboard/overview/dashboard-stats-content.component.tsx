import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { FileCode, CheckCircle2, ShieldAlert, Loader, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { getAuditStats } from '@/modules/audit/queries/stats.queries'
import { StatCard, AuditRow } from './dashboard-overview.component'
import { DashboardSeverityChart } from './dashboard-severity-chart.component'
import { DashboardStatusRing } from './dashboard-status-ring.component'
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
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-muted/20" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] rounded-xl bg-muted/20" />
        <div className="space-y-6">
          <div className="h-[200px] rounded-xl bg-muted/20" />
          <div className="h-[200px] rounded-xl bg-muted/20" />
        </div>
      </div>
    </div>
  )
}

async function DashboardStatsGrid() {
  const [t, stats] = await Promise.all([getTranslations('dashboard.overview'), getAuditStats()])

  const severityT = t.raw('issuesBySeverity') as {
    title: string; description: string; critical: string; error: string; warning: string; info: string
  }
  const statusT = t.raw('statusDistribution') as { title: string; description: string }

  const completedCount = stats.auditsByStatus.find((s: { status: string; count: number }) => s.status === 'completed')?.count ?? 0
  const processingCount = stats.auditsByStatus.find((s: { status: string; count: number }) => s.status === 'processing')?.count ?? 0
  const pendingCount = processingCount + (stats.auditsByStatus.find((s: { status: string; count: number }) => s.status === 'pending')?.count ?? 0)

  // Calculemos una tendencia ficticia pero visual para darle vidilla
  const trendAudit = stats.totalAudits > 0 ? 'up' : 'neutral'
  const trendIssues = stats.totalIssues > 10 ? 'down' : 'up'

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Metrics Row: Glassmorphism Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('totalAudits')} value={stats.totalAudits} icon={<FileCode className="size-5" />} trend={trendAudit} color="text-primary" />
        <StatCard 
          title={t('completed')} value={completedCount} icon={<CheckCircle2 className="size-5" />} 
          subtitle={`${stats.approvalRate}% successful resolution rate`} color="text-emerald-500" trend="up" 
        />
        <StatCard title={t('totalIssues')} value={stats.totalIssues} icon={<ShieldAlert className="size-5" />} color="text-amber-500" trend={trendIssues} />
        <StatCard title={t('active')} value={pendingCount} icon={<Loader className="size-5 animate-[spin_3s_linear_infinite]" />} color="text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Auditorías recientes con diseño en panel flotante de vidrio */}
        <div className="lg:col-span-2 rounded-xl border border-border/40 bg-background/50 backdrop-blur-md shadow-sm overflow-hidden flex flex-col h-full transform transition-all duration-300 hover:shadow-md hover:border-border/60">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border/30 bg-muted/5">
            <h3 className="text-sm font-semibold tracking-tight">
              {t('recentAudits.title')}
            </h3>
            <Link
              href={routesConfig.dashboard.audits.list}
              className="group flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium border border-border/30 rounded-full px-3 py-1 bg-background hover:border-primary/50 shadow-xs"
            >
              {t('viewFullAudit')} 
              <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="flex-1 flex flex-col divide-y divide-border/20">
            {stats.recentAudits.slice(0, 5).map((a: any) => (
              <AuditRow
                key={a.id}
                id={a.id}
                repo={extractRepoName(a.repoUrl)}
                branch={a.branchName}
                issues={a.issueCount}
                time={formatTimeAgo(a.createdAt)}
                status={a.status}
              />
            ))}
            {stats.recentAudits.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">No recent audits available</div>
            )}
          </div>
        </div>

        {/* Paneles visuales de estado y gravedad */}
        <div className="space-y-6">
          <DashboardStatusRing stats={stats.auditsByStatus} total={stats.totalAudits} translations={statusT} />
          <DashboardSeverityChart issues={stats.issuesBySeverity} translations={severityT} />
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
