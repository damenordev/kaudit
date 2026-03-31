import type { PaginationState } from '@tanstack/react-table'

import type { IDataTableTranslations } from './data-table.types'

/** Tamaño de página por defecto para paginación client-side. */
export const DEFAULT_PAGE_SIZE = 10

/**
 * Retorna el estado de paginación por defecto.
 * Página inicial 0, tamaño de página 10.
 */
export function getDefaultPaginationState(): PaginationState {
  return {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  }
}

/**
 * Genera el texto del indicador de página.
 * Usa el string proporcionado o el default en inglés.
 */
export function getPageOfText(current: number, total: number, translations?: IDataTableTranslations): string {
  if (translations?.pageOf) {
    return translations.pageOf
  }
  return `Page ${current} of ${total}`
}

/**
 * Genera el texto del indicador de filas seleccionadas.
 * Usa el string proporcionado o el default en inglés.
 */
export function getRowsSelectedText(selected: number, total: number, translations?: IDataTableTranslations): string {
  if (translations?.rowsSelected) {
    return translations.rowsSelected
  }
  return `${selected} of ${total} row(s) selected`
}

// Re-exportar desde la carpeta utils/
export * from './utils/toolbar-filter.utils'
