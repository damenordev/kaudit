'use client'

import { createContext, useContext } from 'react'

import type { IKanbanContextValue, IKanbanItem } from './kanban.types'

export const KanbanContext = createContext<IKanbanContextValue<IKanbanItem> | null>(null)

/** Hook para acceder al contexto del Kanban */
export function useKanbanContext<T extends IKanbanItem = IKanbanItem>(): IKanbanContextValue<T> {
  const context = useContext(KanbanContext)
  if (!context) {
    throw new Error('Los componentes de Kanban deben usarse dentro de <Kanban>')
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return context as any
}
