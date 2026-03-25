import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/core/ui/card'
import { Badge } from '@/core/ui/badge'
import { Avatar, AvatarFallback } from '@/core/ui/avatar'
import { Separator } from '@/core/ui/separator'
import { Users, Activity, CheckCircle2, Zap, Clock, TrendingUp, Cpu, LayoutGrid, ArrowUpRight } from 'lucide-react'
import { cn } from '@/core/utils/cn.utils'

export default async function DashboardPage() {
  const t = await getTranslations('dashboard.overview')

  return (
    <div className="flex flex-col gap-3 p-3 w-full animate-in fade-in duration-500">
      {/* Header Uniforme */}
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
            SYST_OK
          </Badge>
          <div className="size-9 rounded-lg border border-border/50 flex items-center justify-center bg-card shadow-xs">
            <Cpu className="size-4 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Row 1: Stats Primordiales (intl) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard title={t('totalUsers')} value="12.8k" change="+12%" icon={<Users className="size-4" />} />
        <StatCard
          title={t('revenue')}
          value="$14.2k"
          change="+8.4%"
          icon={<Zap className="size-4" />}
          color="text-amber-500"
        />
        <StatCard title={t('activeNodes')} value="24/24" icon={<Activity className="size-4" />} />
        <StatCard
          title={t('uptime')}
          value="99.9%"
          icon={<CheckCircle2 className="size-4" />}
          color="text-emerald-500"
        />
      </div>

      {/* Bento Grid: Compacto y W-Full */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full items-stretch">
        {/* Gráfico Principal (8/12) */}
        <Card className="md:col-span-8 border-border/40 bg-card/50 shadow-xs overflow-hidden pb-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/10 bg-muted/5">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-black tracking-widest uppercase opacity-70 italic">
                {t('trafficAnalysis')}
              </CardTitle>
              <CardDescription className="text-[10px] font-bold text-primary tracking-tight">
                {t('trafficDescription')}
              </CardDescription>
            </div>
            <TrendingUp className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="h-[240px] p-6 flex items-end gap-2 relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-size-[18px_18px] bg-[radial-gradient(circle,var(--primary)_1px,transparent_1px)]" />
            {[45, 75, 55, 100, 85, 95, 65, 45, 60, 80, 90, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-linear-to-t from-primary/20 to-primary/5 border-t border-primary/30 rounded-t-sm z-10 transition-colors hover:from-primary/40"
                style={{ height: `${h}%` }}
              />
            ))}
          </CardContent>
        </Card>

        {/* Status Secundario (4/12) */}
        <Card className="md:col-span-4 bg-primary text-primary-foreground border-none flex flex-col justify-between overflow-hidden relative shadow-lg pb-0">
          <Zap className="absolute -top-6 -right-6 size-32 opacity-10 rotate-12" />
          <CardHeader className="p-3">
            <p className="text-[10px] font-black tracking-[0.25em] uppercase opacity-60">{t('complianceScore')}</p>
            <div className="text-6xl font-black italic tracking-tighter mt-4">A+</div>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <p className="text-sm font-bold leading-tight opacity-90 italic">{t('complianceDescription')}</p>
            <Separator className="bg-white/20" />
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span>{t('securityLevel')}</span>
              <Badge className="bg-white/20 text-white border-none text-[8px] py-0 px-1.5">MAX_SEC</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Logs Técnicos (md:12) */}
        <Card className="md:col-span-12 border-border/40 bg-card shadow-xs p-0 pt-2 gap-0">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black tracking-widest uppercase opacity-70">
                {t('infrastructureEvents')}
              </CardTitle>
              <button className="text-[10px] font-black bg-foreground text-background px-4 py-1.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all uppercase tracking-tighter">
                {t('viewFullAudit')}
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/10">
              <LogItem user="ARIVERA" action="Partition Sync" time="2m ago" />
              <LogItem user="ELopez" action="S3 Optimization" time="15m ago" />
              <LogItem user="SYSTEM" action="Kernel Re-build" time="1h ago" status="OK" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon, color }: any) {
  return (
    <Card className="p-4 flex flex-col gap-3 border-border/40 shadow-xs hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black tracking-widest uppercase opacity-40">{title}</span>
        <div className={cn('p-1.5 rounded-md bg-muted/40 shadow-inner', color)}>{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-black tracking-tighter italic leading-none">{value}</div>
        <div className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
          <ArrowUpRight className="size-3 mr-0.5" /> {change}
        </div>
      </div>
    </Card>
  )
}

function LogItem({ user, action, time, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors group">
      <div className="flex items-center gap-4">
        <Avatar size="sm" className="border border-border/50 shadow-xs">
          <AvatarFallback className="text-[10px] font-black italic">{user[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-[11px] font-black tracking-tight">{user}</span>
          <span className="text-[10px] text-muted-foreground lowercase italic">/ {action}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Clock className="size-3" /> {time}
        </span>
        <Badge variant="outline" className="text-[9px] font-black py-0 px-2 h-5 border-border/50">
          {status || 'SNC'}
        </Badge>
      </div>
    </div>
  )
}
