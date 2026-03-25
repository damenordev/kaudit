import type { IDataTableTranslations } from '../data-table.types'

/**
 * Devuelve el texto de resumen de selección (ej. "3 de 10 fila(s) seleccionada(s)").
 */
export const getRowsSelectedText = (selected: number, total: number, t?: IDataTableTranslations): string =>
  t?.rowsSelected ? t.rowsSelected({ selected, total }) : `${selected} of ${total} row(s) selected.`

/**
 * Devuelve el texto del indicador de página (ej. "Página 1 de 5").
 */
export const getPageOfText = (currentPage: number, pageCount: number, t?: IDataTableTranslations): string =>
  t?.pageOf ? t.pageOf({ current: currentPage, total: pageCount }) : `Page ${currentPage} of ${pageCount}`
