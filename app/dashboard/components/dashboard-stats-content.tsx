/**
 * Dashboard Stats Content - Componente async para streaming vía Suspense.
 * Obtiene estadísticas del dashboard y renderiza las secciones de stats.
 * Al estar envuelto en Suspense, permite que el header se muestre inmediatamente
 * mientras las estadísticas cargan en paralelo.
 */
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/core/ui/card'
import { Badge } from '@/core/ui/badge'
import { Separator } from '@/core/ui/separator'
import { CheckCircle2, TrendingUp, Zap, ShieldAlert, Activity } from 'lucide-react'

import { getAuditStats } from '@/modules/audit/queries/stats.queries'
import type { IIssuesBySeverity, IRecentAudit } from '@/modules/audit/types/stats.types'
import { StatCard, LogItem } from './dashboard-overview.components'

function formatTimeAgo(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function extractRepoName(repoUrl: string): string {
  const parts = repoUrl.replace(/\.git$/, '').split('/')
  return parts.slice(-2).join('/') || repoUrl
}

/** Skeleton visible mientras cargan las estadísticas */
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 rounded-lg border border-border/40 bg-muted/30" />
      ))}
      <div className="md:col-span-12 h-64 rounded-lg border border-border/40 bg-muted/30" />
    </div>
  )
}

/** Componente async que obtiene y renderiza las estadísticas */
async function DashboardStatsGrid() {
  const t = await getTranslations('dashboard.overview')
  const stats = await getAuditStats()

  const pendingCount = stats.auditsByStatus.find(s => s.status === 'pending')?.count ?? 0
  const completedCount = stats.auditsByStatus.find(s => s.status === 'completed')?.count ?? 0
  const failedCount = stats.auditsByStatus.find(s => s.status === 'failed')?.count ?? 0

  return (
    <>
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard
          title={t('totalUsers') ?? 'Total Audits'}
          value={stats.totalAudits}
          icon={<Activity className="size-4" />}
        />
        <StatCard
          title="Completed"
          value={completedCount}
          change={`${stats.approvalRate}%`}
          icon={<CheckCircle2 className="size-4" />}
          color="text-emerald-500"
        />
        <StatCard
          title="Total Issues"
          value={stats.totalIssues}
          icon={<ShieldAlert className="size-4" />}
          color="text-amber-500"
        />
        <StatCard title="Active" value={pendingCount} icon={<Activity className="size-4" />} />
      </div>

      {/* Bento Grid: Severidad + Approval Rate */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full items-stretch">
        <SeverityChart issues={stats.issuesBySeverity} />
        <ApprovalCard approvalRate={stats.approvalRate} failedCount={failedCount} totalAudits={stats.totalAudits} />
        <RecentAuditsList audits={stats.recentAudits} viewFullAuditText={t('viewFullAudit')} />
      </div>
    </>
  )
}

function SeverityChart({ issues }: { issues: IIssuesBySeverity }) {
  const items = [
    { label: 'Critical', count: issues.critical ?? 0, color: 'from-red-500/40 to-red-500/5' },
    { label: 'Error', count: issues.error ?? 0, color: 'from-orange-500/40 to-orange-500/5' },
    { label: 'Warning', count: issues.warning ?? 0, color: 'from-amber-500/40 to-amber-500/5' },
    { label: 'Info', count: issues.info ?? 0, color: 'from-blue-500/40 to-blue-500/5' },
  ]
  const maxVal = Math.max(...items.map(i => i.count), 1)

  return (
    <Card className="md:col-span-8 border-border/40 bg-card/50 shadow-xs overflow-hidden pb-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/10 bg-muted/5">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-black tracking-widest uppercase opacity-70 italic">
            Issues by Severity
          </CardTitle>
          <CardDescription className="text-[10px] font-bold text-primary tracking-tight">
            Distribution across all audits
          </CardDescription>
        </div>
        <TrendingUp className="size-4 text-primary" />
      </CardHeader>
      <CardContent className="h-[240px] p-6 flex items-end gap-2 relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-size-[18px_18px] bg-[radial-gradient(circle,var(--primary)_1px,transparent_1px)]" />
        {items.map(item => (
          <div key={item.label} className="flex-1 flex flex-col items-center gap-1 z-10">
            <span className="text-[10px] font-bold">{item.count}</span>
            <div
              className={`w-full bg-linear-to-t ${item.color} border-t border-primary/30 rounded-t-sm`}
              style={{ height: `${Math.max((item.count / maxVal) * 180, 4)}px` }}
            />
            <span className="text-[8px] font-bold text-muted-foreground uppercase">{item.label}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ApprovalCard({
  approvalRate,
  failedCount,
  totalAudits,
}: {
  approvalRate: number
  failedCount: number
  totalAudits: number
}) {
  return (
    <Card className="md:col-span-4 bg-primary text-primary-foreground border-none flex flex-col justify-between overflow-hidden relative shadow-lg pb-0">
      <Zap className="absolute -top-6 -right-6 size-32 opacity-10 rotate-12" />
      <CardHeader className="p-3">
        <p className="text-[10px] font-black tracking-[0.25em] uppercase opacity-60">Approval Rate</p>
        <div className="text-6xl font-black italic tracking-tighter mt-4">{approvalRate}%</div>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <p className="text-sm font-bold leading-tight opacity-90 italic">
          {failedCount} failed / {totalAudits} total audits
        </p>
        <Separator className="bg-white/20" />
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <span>Status</span>
          <Badge className="bg-white/20 text-white border-none text-[8px] py-0 px-1.5">
            {totalAudits > 0 ? 'ACTIVE' : 'IDLE'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentAuditsList({ audits, viewFullAuditText }: { audits: IRecentAudit[]; viewFullAuditText: string }) {
  return (
    <Card className="md:col-span-12 border-border/40 bg-card shadow-xs p-0 pt-2 gap-0">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-black tracking-widest uppercase opacity-70">Recent Audits</CardTitle>
          <button className="text-[10px] font-black bg-foreground text-background px-4 py-1.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all uppercase tracking-tighter">
            {viewFullAuditText}
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/10">
          {audits.length > 0 ? (
            audits
              .slice(0, 5)
              .map(a => (
                <LogItem
                  key={a.id}
                  user={extractRepoName(a.repoUrl)}
                  action={`${a.branchName} (${a.issueCount} issues)`}
                  time={formatTimeAgo(a.createdAt)}
                  status={a.status.toUpperCase()}
                />
              ))
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No audits yet. Create your first audit to see data here.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/** Wrapper con Suspense para el contenido de estadísticas */
export function DashboardStatsContent() {
  return (
    <Suspense fallback={<DashboardStatsSkeleton />}>
      <DashboardStatsGrid />
    </Suspense>
  )
}
