/**
 * Loading skeleton para el listado de auditorías.
 * Muestra un placeholder de la tabla mientras cargan los datos.
 */
import { cn } from '@/core/utils/cn.utils'

export default function AuditsLoading() {
  return (
    <section className="flex flex-col gap-4 p-3 h-full" aria-busy="true" aria-label="Cargando auditorías">
      <div className="h-4 w-48 bg-muted/40 rounded animate-pulse" />

      {/* Filtros skeleton */}
      <div className="flex gap-3">
        <div className="h-9 w-40 bg-muted/30 rounded-md animate-pulse" />
        <div className="h-9 w-32 bg-muted/30 rounded-md animate-pulse" />
        <div className="h-9 w-48 bg-muted/30 rounded-md animate-pulse" />
      </div>

      {/* Tabla skeleton */}
      <div className="rounded-lg border border-border/40 overflow-hidden">
        <div className="bg-muted/5 border-b border-border/10 px-4 py-3">
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 flex-1 bg-muted/30 rounded animate-pulse" />
            ))}
          </div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>

      {/* Paginación skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-3 w-32 bg-muted/30 rounded animate-pulse" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn('h-8 w-8 bg-muted/30 rounded animate-pulse', i === 2 && 'bg-muted/50')} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SkeletonRow() {
  return (
    <div className="px-4 py-3 border-b border-border/5">
      <div className="flex gap-4 items-center">
        <div className="h-3 w-8 bg-muted/30 rounded animate-pulse" />
        <div className="h-3 flex-1 bg-muted/30 rounded animate-pulse" />
        <div className="h-3 w-24 bg-muted/30 rounded animate-pulse" />
        <div className="h-5 w-16 bg-muted/30 rounded-full animate-pulse" />
        <div className="h-3 w-20 bg-muted/30 rounded animate-pulse" />
      </div>
    </div>
  )
}
