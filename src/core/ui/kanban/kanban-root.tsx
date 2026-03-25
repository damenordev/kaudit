'use client'

import { useMemo, useState } from 'react'

import {
  DndContext,
  type CollisionDetection,
  pointerWithin,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import { cn } from '@/core/utils/cn.utils'

import { KanbanContext } from './kanban.context'
import type { IKanbanItem, IKanbanProps } from './kanban.types'
import { useKanbanDnd } from './use-kanban-dnd'

/** Componente raíz del Kanban que provee contexto y maneja el estado de drag & drop */
export function Kanban<T extends IKanbanItem>({
  value,
  onValueChange,
  getItemValue,
  onItemClick,
  className,
  children,
}: IKanbanProps<T>) {
  const [activeItem, setActiveItem] = useState<T | null>(null)
  const [activeColumn, setActiveColumn] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const { handleDragStart, handleDragOver, handleDragEnd } = useKanbanDnd({
    columns: value,
    onValueChange,
    getItemValue,
    setActiveItem,
    setActiveColumn,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contextValue = useMemo<any>(
    () => ({
      onItemClick,
      getItemValue,
      activeItem,
      activeColumn,
    }),
    [onItemClick, getItemValue, activeItem, activeColumn]
  )

  const collisionDetection: CollisionDetection = args => {
    const pointerCollisions = pointerWithin(args)
    if (pointerCollisions.length > 0) {
      return pointerCollisions
    }
    return closestCenter(args)
  }

  return (
    <KanbanContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div data-slot="kanban" className={cn('w-full', className)}>
          {children}
        </div>
      </DndContext>
    </KanbanContext.Provider>
  )
}
