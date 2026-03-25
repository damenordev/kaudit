import type { PaginationState } from '@tanstack/react-table'

/** Tamaño de página por defecto para paginación client-side. */
export const DEFAULT_PAGE_SIZE = 10

/**
 * Devuelve el estado inicial de paginación para modo client-side.
 * @returns Estado de paginación por defecto
 */
export const getDefaultPaginationState = (): PaginationState => ({
  pageIndex: 0,
  pageSize: DEFAULT_PAGE_SIZE,
})
