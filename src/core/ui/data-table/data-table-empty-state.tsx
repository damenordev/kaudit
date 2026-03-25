import { type ReactNode } from 'react'
import { InboxIcon } from 'lucide-react'

export interface IDataTableEmptyStateProps {
  /** Icono a mostrar. Por defecto InboxIcon. */
  icon?: ReactNode
  /** Texto del título principal. */
  title?: string
  /** Texto de descripción secundaria. */
  description?: string
}

/**
 * Estado vacío moderno para la tabla de datos.
 * Muestra un icono centrado, título y descripción cuando no hay datos.
 */
export const DataTableEmptyState = ({
  icon,
  title = 'No results',
  description = 'Try adjusting your search or filters.',
}: IDataTableEmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="flex size-16 items-center justify-center rounded-full bg-muted/50 mb-4">
      {icon ?? <InboxIcon className="size-8 text-muted-foreground/60" />}
    </div>
    <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground text-center max-w-[280px]">{description}</p>
  </div>
)
