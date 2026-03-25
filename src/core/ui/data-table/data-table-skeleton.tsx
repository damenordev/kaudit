import { Skeleton } from '@/core/ui/primitives/skeleton'

export interface IDataTableSkeletonProps {
  /** Número de filas skeleton a mostrar. @default 5 */
  rows?: number
  /** Número de columnas a mostrar. @default 4 */
  columns?: number
  /** Mostrar skeleton de barra de búsqueda en el toolbar. @default true */
  showToolbar?: boolean
}

/**
 * Placeholder skeleton para DataTable mientras cargan los datos.
 * Refleja la estructura real de la tabla: toolbar, header, filas.
 */
export const DataTableSkeleton = ({ rows = 5, columns = 4, showToolbar = true }: IDataTableSkeletonProps) => (
  <div className="flex h-full flex-col overflow-hidden">
    {showToolbar && (
      <div className="flex items-center justify-between gap-2 pb-2 shrink-0">
        <Skeleton className="h-8 w-[250px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-[70px]" />
        </div>
      </div>
    )}

    <div className="flex-1 overflow-hidden rounded-md border">
      <div className="flex items-center gap-4 border-b px-4 h-10">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`h-${i}`} className="h-3.5 flex-1" />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={`r-${rowIdx}`} className="flex items-center gap-4 border-b last:border-0 px-4 h-12">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={`r-${rowIdx}-c-${colIdx}`} className="h-3.5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
)
