'use client'

import { createContext, useContext, useMemo } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Slot } from 'radix-ui'

import { cn } from '@/core/utils/cn.utils'

import type {
  IKanbanItemContextValue,
  IKanbanItemDragHandleProps,
  IKanbanItemHandleProps,
  IKanbanItemProps,
} from './kanban.types'

// ============================================================================
// Internal Context
// ============================================================================

const KanbanItemContext = createContext<IKanbanItemContextValue | null>(null)

/** Hook interno para acceder a los listeners del item */
function useKanbanItem(): IKanbanItemContextValue {
  const context = useContext(KanbanItemContext)
  if (!context) {
    throw new Error('useKanbanItem debe usarse dentro de KanbanItem')
  }
  return context
}

// ============================================================================
// Components
// ============================================================================

/** Item arrastrable dentro de una columna del Kanban */
export function KanbanItem({ value, disabled = false, className, children }: IKanbanItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: value,
    disabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const itemContextValue = useMemo<IKanbanItemContextValue>(
    () => ({
      attributes: attributes as unknown as Record<string, unknown>,
      listeners: listeners as unknown as Record<string, unknown> | undefined,
      isDragging,
    }),
    [attributes, listeners, isDragging]
  )

  return (
    <KanbanItemContext.Provider value={itemContextValue}>
      <div
        ref={setNodeRef}
        data-slot="kanban-item"
        data-item={value}
        style={style}
        className={cn(
          'bg-background border rounded-md shadow-sm transition-opacity',
          isDragging && 'opacity-50',
          className
        )}
        {...attributes}
      >
        {children}
      </div>
    </KanbanItemContext.Provider>
  )
}

/** Drag handle que recibe los listeners del contexto para permitir arrastrar */
export function KanbanItemDragHandle({ className, children, asChild = false }: IKanbanItemDragHandleProps) {
  const { listeners } = useKanbanItem()
  const Comp = asChild ? Slot.Root : 'div'

  return (
    <Comp
      data-slot="kanban-item-drag-handle"
      className={cn('cursor-grab active:cursor-grabbing', className)}
      {...listeners}
    >
      {children}
    </Comp>
  )
}

/**
 * @deprecated Usar KanbanItemDragHandle para el área arrastrable
 * o envolver el contenido directamente en KanbanItem.
 */
export function KanbanItemHandle({ className, children }: IKanbanItemHandleProps) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'KanbanItemHandle is deprecated. Use KanbanItemDragHandle for draggable areas ' +
        'or wrap content directly in KanbanItem.'
    )
  }

  return (
    <div data-slot="kanban-item-handle" className={cn('p-3', className)}>
      {children}
    </div>
  )
}
