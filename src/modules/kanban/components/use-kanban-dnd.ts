import { useCallback, useRef } from 'react'

import type { DragEndEvent, DragOverEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core'

import { findColumnByItemId, findItemById } from './kanban-dnd.utils'
import type { IKanbanItem } from './kanban.types'

export interface IUseKanbanDndParams<T extends IKanbanItem> {
  columns: Record<string, T[]>
  onValueChange: (columns: Record<string, T[]>) => void
  getItemValue: (item: T) => UniqueIdentifier
  setActiveItem: (item: T | null) => void
  setActiveColumn: (column: string | null) => void
}

export interface IUseKanbanDndReturn {
  handleDragStart: (event: DragStartEvent) => void
  handleDragOver: (event: DragOverEvent) => void
  handleDragEnd: (event: DragEndEvent) => void
}

/** Hook para manejar la lógica de drag & drop del Kanban */
export function useKanbanDnd<T extends IKanbanItem>(params: IUseKanbanDndParams<T>): IUseKanbanDndReturn {
  const { columns, onValueChange, getItemValue, setActiveItem, setActiveColumn } = params

  const movedToColumnRef = useRef<string | null>(null)

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      movedToColumnRef.current = null
      const { active } = event
      const item = findItemById(columns, active.id, getItemValue)
      if (item) {
        setActiveItem(item)
        setActiveColumn(findColumnByItemId(columns, active.id, getItemValue))
      }
    },
    [columns, getItemValue, setActiveItem, setActiveColumn]
  )

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over) return

      const activeId = active.id
      const overId = over.id
      const activeColumnId = findColumnByItemId(columns, activeId, getItemValue)
      const overColumnId = findColumnByItemId(columns, overId, getItemValue)

      if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) return

      if (movedToColumnRef.current === overColumnId) return

      const activeItems = columns[activeColumnId] || []
      const overItems = columns[overColumnId] || []
      const activeIndex = activeItems.findIndex(i => getItemValue(i) === activeId)
      const movedItem = activeItems[activeIndex]

      if (!movedItem) return

      const newColumns = { ...columns }
      newColumns[activeColumnId] = activeItems.filter((_, i) => i !== activeIndex)

      const overIndex = overItems.findIndex(i => getItemValue(i) === overId)
      const insertIndex = overIndex >= 0 ? overIndex : overItems.length
      const newOverItems = [...overItems]
      newOverItems.splice(insertIndex, 0, movedItem)
      newColumns[overColumnId] = newOverItems

      movedToColumnRef.current = overColumnId
      onValueChange(newColumns)
    },
    [columns, getItemValue, onValueChange]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      movedToColumnRef.current = null
      setActiveItem(null)
      setActiveColumn(null)

      if (!over) return

      const activeId = active.id
      const overId = over.id
      const activeColumnId = findColumnByItemId(columns, activeId, getItemValue)
      const overColumnId = findColumnByItemId(columns, overId, getItemValue)

      if (!activeColumnId || !overColumnId || activeColumnId !== overColumnId) return

      if (activeId === overId) return

      const columnItems = columns[activeColumnId] || []
      const oldIndex = columnItems.findIndex(i => getItemValue(i) === activeId)
      const newIndex = columnItems.findIndex(i => getItemValue(i) === overId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newColumnItems = [...columnItems]
        const [removed] = newColumnItems.splice(oldIndex, 1)
        if (removed) {
          newColumnItems.splice(newIndex, 0, removed)
          const newColumns = { ...columns }
          newColumns[activeColumnId] = newColumnItems
          onValueChange(newColumns)
        }
      }
    },
    [columns, getItemValue, onValueChange, setActiveItem, setActiveColumn]
  )

  return { handleDragStart, handleDragOver, handleDragEnd }
}
