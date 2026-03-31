/**
 * Dashboard Overview con datos reales de auditorías.
 * Server Component que obtiene estadísticas desde la base de datos.
 */
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/core/ui/card'
import { Badge } from '@/core/ui/badge'
import { Separator } from '@/core/ui/separator'
import { Users, Activity, CheckCircle2, Zap, TrendingUp, Cpu, LayoutGrid, ShieldAlert } from 'lucide-react'

import { getAuditStats } from '@/modules/audit/queries/stats.queries'
import { StatCard, LogItem } from './components/dashboard-overview.components'

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

export default async function DashboardPage() {
  const t = await getTranslations('dashboard.overview')
  const stats = await getAuditStats()

  const pendingCount = stats.auditsByStatus.find(s => s.status === 'pending')?.count ?? 0
  const completedCount = stats.auditsByStatus.find(s => s.status === 'completed')?.count ?? 0
  const failedCount = stats.auditsByStatus.find(s => s.status === 'failed')?.count ?? 0

  return (
    <div className="flex flex-col gap-3 p-3 w-full animate-in fade-in duration-500">
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
            {stats.totalAudits} AUDITS
          </Badge>
          <div className="size-9 rounded-lg border border-border/50 flex items-center justify-center bg-card shadow-xs">
            <Cpu className="size-4 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Stats reales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard
          title={t('totalUsers') ?? 'Total Audits'}
          value={stats.totalAudits}
          icon={<Users className="size-4" />}
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

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full items-stretch">
        {/* Issues por severidad */}
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
            {[
              { label: 'Critical', count: stats.issuesBySeverity.critical, color: 'from-red-500/40 to-red-500/5' },
              { label: 'Error', count: stats.issuesBySeverity.error, color: 'from-orange-500/40 to-orange-500/5' },
              { label: 'Warning', count: stats.issuesBySeverity.warning, color: 'from-amber-500/40 to-amber-500/5' },
              { label: 'Info', count: stats.issuesBySeverity.info, color: 'from-blue-500/40 to-blue-500/5' },
            ].map(item => {
              const maxVal = Math.max(
                stats.issuesBySeverity.critical,
                stats.issuesBySeverity.error,
                stats.issuesBySeverity.warning,
                stats.issuesBySeverity.info,
                1
              )
              return (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-1 z-10">
                  <span className="text-[10px] font-bold">{item.count}</span>
                  <div
                    className={`w-full bg-linear-to-t ${item.color} border-t border-primary/30 rounded-t-sm transition-colors`}
                    style={{ height: `${Math.max((item.count / maxVal) * 180, 4)}px` }}
                  />
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">{item.label}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Approval Rate */}
        <Card className="md:col-span-4 bg-primary text-primary-foreground border-none flex flex-col justify-between overflow-hidden relative shadow-lg pb-0">
          <Zap className="absolute -top-6 -right-6 size-32 opacity-10 rotate-12" />
          <CardHeader className="p-3">
            <p className="text-[10px] font-black tracking-[0.25em] uppercase opacity-60">Approval Rate</p>
            <div className="text-6xl font-black italic tracking-tighter mt-4">{stats.approvalRate}%</div>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <p className="text-sm font-bold leading-tight opacity-90 italic">
              {failedCount} failed / {stats.totalAudits} total audits
            </p>
            <Separator className="bg-white/20" />
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span>Status</span>
              <Badge className="bg-white/20 text-white border-none text-[8px] py-0 px-1.5">
                {stats.totalAudits > 0 ? 'ACTIVE' : 'IDLE'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Auditorías recientes */}
        <Card className="md:col-span-12 border-border/40 bg-card shadow-xs p-0 pt-2 gap-0">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black tracking-widest uppercase opacity-70">Recent Audits</CardTitle>
              <button className="text-[10px] font-black bg-foreground text-background px-4 py-1.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all uppercase tracking-tighter">
                {t('viewFullAudit')}
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/10">
              {stats.recentAudits.length > 0 ? (
                stats.recentAudits
                  .slice(0, 5)
                  .map(audit => (
                    <LogItem
                      key={audit.id}
                      user={extractRepoName(audit.repoUrl)}
                      action={`${audit.branchName} (${audit.issueCount} issues)`}
                      time={formatTimeAgo(audit.createdAt)}
                      status={audit.status.toUpperCase()}
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
      </div>
    </div>
  )
}
