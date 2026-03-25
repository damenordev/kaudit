import type { UniqueIdentifier } from '@dnd-kit/core'

import type { IKanbanItem } from './kanban.types'

/**
 * Encuentra la columna que contiene un item, o devuelve el ID si es una columna
 */
export function findColumnByItemId<T extends IKanbanItem>(
  columns: Record<string, T[]>,
  itemId: UniqueIdentifier,
  getItemValue: (item: T) => UniqueIdentifier
): string | null {
  const columnId = String(itemId)
  if (columnId in columns) {
    return columnId
  }

  for (const [colId, items] of Object.entries(columns)) {
    if (items.some(item => getItemValue(item) === itemId)) {
      return colId
    }
  }
  return null
}

/** Encuentra un item por su ID en todas las columnas */
export function findItemById<T extends IKanbanItem>(
  columns: Record<string, T[]>,
  itemId: UniqueIdentifier,
  getItemValue: (item: T) => UniqueIdentifier
): T | null {
  for (const items of Object.values(columns)) {
    const foundItem = items.find(i => getItemValue(i) === itemId)
    if (foundItem) return foundItem
  }
  return null
}
