'use client'

import { DragOverlay } from '@dnd-kit/core'

import { cn } from '@/core/utils/cn.utils'

import { useKanbanContext } from './kanban.context'
import type { IKanbanItem, IKanbanOverlayProps } from './kanban.types'

/** Elemento fantasma que se muestra durante la operación de arrastre */
export function KanbanOverlay<T extends IKanbanItem>({ className, children, renderItem }: IKanbanOverlayProps<T>) {
  const { activeItem } = useKanbanContext<T>()

  return (
    <DragOverlay>
      <div data-slot="kanban-overlay" className={cn('opacity-80', className)}>
        {activeItem && renderItem ? renderItem(activeItem) : children}
      </div>
    </DragOverlay>
  )
}
