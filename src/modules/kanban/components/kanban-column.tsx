'use client'

import { useMemo } from 'react'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { cn } from '@/core/utils/cn.utils'

import { useKanbanContext } from './kanban.context'
import type {
  IKanbanColumnProps,
  IKanbanColumnHandleProps,
  IKanbanColumnContentProps,
  IKanbanItem,
} from './kanban.types'

export function KanbanColumn({ value, className, children }: IKanbanColumnProps) {
  return (
    <div
      data-slot="kanban-column"
      data-column={value}
      className={cn('flex flex-col w-80 min-w-[320px] shrink-0 bg-muted/50 rounded-lg', className)}
    >
      {children}
    </div>
  )
}

export function KanbanColumnHandle({ className, children }: IKanbanColumnHandleProps) {
  return (
    <div
      data-slot="kanban-column-handle"
      className={cn('flex items-center justify-between p-3 font-medium border-b', className)}
    >
      {children}
    </div>
  )
}

export function KanbanColumnContent<T extends IKanbanItem>({
  value,
  items,
  getItemValue: getItemValueProp,
  className,
  children,
}: IKanbanColumnContentProps<T>) {
  const context = useKanbanContext<T>()
  const getItemValue = getItemValueProp ?? context.getItemValue

  const itemIds = useMemo(() => items.map(item => getItemValue(item)), [items, getItemValue])

  const { setNodeRef, isOver } = useDroppable({
    id: value,
    data: { columnId: value },
  })

  return (
    <SortableContext id={value} items={itemIds} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        data-slot="kanban-column-content"
        data-column={value}
        className={cn('flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px]', isOver && 'bg-primary/5', className)}
      >
        {items.map(item => children(item))}
      </div>
    </SortableContext>
  )
}
