import { cn } from '@/core/utils/cn.utils'

import type { IKanbanBoardProps } from './kanban.types'

/** Contenedor horizontal para las columnas del Kanban */
export function KanbanBoard({ className, children }: IKanbanBoardProps) {
  return (
    <div data-slot="kanban-board" className={cn('flex gap-4 w-full overflow-x-auto pb-4', className)}>
      {children}
    </div>
  )
}
