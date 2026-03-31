/**
 * Loading skeleton para el detalle de una auditoría.
 * Muestra placeholders del layout principal mientras carga.
 */
export default function AuditDetailLoading() {
  return (
    <section className="p-3 h-full max-w-[1600px] mx-auto" aria-busy="true" aria-label="Cargando auditoría">
      {/* Header skeleton */}
      <div className="rounded-lg border border-border/40 p-4 mb-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-muted/40 rounded animate-pulse" />
            <div className="h-4 w-32 bg-muted/40 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-16 bg-muted/30 rounded animate-pulse" />
                <div className="h-4 w-28 bg-muted/40 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Diff viewer skeleton */}
      <div className="flex gap-0 rounded-lg border border-border/40 overflow-hidden h-[calc(100vh-12rem)]">
        {/* Sidebar skeleton */}
        <div className="w-64 shrink-0 border-r border-border/10 bg-muted/5 p-3 space-y-2 hidden md:block">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-7 bg-muted/30 rounded animate-pulse" />
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 p-6 space-y-3">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-muted/20 rounded animate-pulse"
              style={{ width: `${60 + Math.random() * 40}%` }}
            />
          ))}
        </div>

        {/* Issues panel skeleton */}
        <div className="w-80 shrink-0 border-l border-border/10 p-3 space-y-3 hidden lg:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/30 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
}
