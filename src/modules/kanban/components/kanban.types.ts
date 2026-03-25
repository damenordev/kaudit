import type { UniqueIdentifier } from '@dnd-kit/core'

/** Interfaz base que deben implementar los items del Kanban */
export interface IKanbanItem {
  id: UniqueIdentifier
}

// ============================================================================
// Context Types
// ============================================================================

/** Valor del contexto principal del Kanban */
export interface IKanbanContextValue<T extends IKanbanItem = IKanbanItem> {
  onItemClick?: (item: T) => void
  getItemValue: (item: T) => UniqueIdentifier
  activeItem: T | null
  activeColumn: string | null
}

/** Contexto interno del item para compartir listeners del drag */
export interface IKanbanItemContextValue {
  attributes: Record<string, unknown>
  listeners: Record<string, unknown> | undefined
  isDragging: boolean
}

// ============================================================================
// Component Props
// ============================================================================

export interface IKanbanProps<T extends IKanbanItem> {
  value: Record<string, T[]>
  onValueChange: (value: Record<string, T[]>) => void
  getItemValue: (item: T) => UniqueIdentifier
  onItemClick?: (item: T) => void
  className?: string
  children: React.ReactNode
}

export interface IKanbanBoardProps {
  className?: string
  children: React.ReactNode
}

export interface IKanbanColumnProps {
  value: string
  className?: string
  children: React.ReactNode
}

export interface IKanbanColumnHandleProps {
  className?: string
  children: React.ReactNode
}

export interface IKanbanColumnContentProps<T extends IKanbanItem> {
  value: string
  items: T[]
  /** @deprecated Se obtiene automáticamente del contexto de Kanban */
  getItemValue?: (item: T) => UniqueIdentifier
  className?: string
  children: (item: T) => React.ReactNode
}

export interface IKanbanItemProps {
  value: UniqueIdentifier
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * @deprecated Usar KanbanItemDragHandle para el área arrastrable
 * o envolver el contenido directamente en KanbanItem.
 */
export interface IKanbanItemHandleProps {
  className?: string
  children: React.ReactNode
}

/** Props para el drag handle separado */
export interface IKanbanItemDragHandleProps {
  className?: string
  children?: React.ReactNode
  /** Usa el hijo como elemento raíz en lugar de un div */
  asChild?: boolean
}

export interface IKanbanOverlayProps<T extends IKanbanItem = IKanbanItem> {
  className?: string
  children?: React.ReactNode
  /** Función para renderizar el item activo durante el drag */
  renderItem?: (item: T) => React.ReactNode
}
