import type { IDataTableTranslations } from '../data-table.types'

/**
 * Devuelve el texto de resumen de selección (ej. "3 de 10 fila(s) seleccionada(s)").
 * Usa el string proporcionado o el default en inglés.
 */
export const getRowsSelectedText = (selected: number, total: number, t?: IDataTableTranslations): string =>
  t?.rowsSelected ?? `${selected} of ${total} row(s) selected.`

/**
 * Devuelve el texto del indicador de página (ej. "Página 1 de 5").
 * Usa el string proporcionado o el default en inglés.
 */
export const getPageOfText = (currentPage: number, pageCount: number, t?: IDataTableTranslations): string =>
  t?.pageOf ?? `Page ${currentPage} of ${pageCount}`
