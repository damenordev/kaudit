/**
 * Loading skeleton para el dashboard overview.
 * Se muestra automáticamente mientras la página carga datos.
 */
import { LayoutGrid, Cpu } from 'lucide-react'
import { DashboardStatsSkeleton } from './components/dashboard-stats-content'

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-3 p-3 w-full animate-in fade-in duration-500">
      {/* Header skeleton */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <LayoutGrid className="size-5 text-primary" />
            <div className="h-8 w-48 bg-muted/40 rounded-md animate-pulse" />
          </div>
          <div className="h-4 w-64 bg-muted/30 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-7 w-20 bg-muted/40 rounded-md animate-pulse" />
          <div className="size-9 rounded-lg border border-border/50 bg-muted/30 animate-pulse flex items-center justify-center">
            <Cpu className="size-4 text-muted-foreground/30" />
          </div>
        </div>
      </header>

      {/* Stats skeleton */}
      <DashboardStatsSkeleton />
    </div>
  )
}
