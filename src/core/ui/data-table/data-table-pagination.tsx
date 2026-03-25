import type { Table } from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'

import { Button } from '@/core/ui/primitives/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/ui/forms/select'

import type { IDataTableTranslations } from './data-table.types'
import { getPageOfText, getRowsSelectedText } from './utils'

export interface IDataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
  translations?: IDataTableTranslations
}

/**
 * Footer de paginación: selector de tamaño de página, indicador de página, botones de navegación.
 */
export const DataTablePagination = <TData,>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  translations: t,
}: IDataTablePaginationProps<TData>) => {
  const selected = table.getFilteredSelectedRowModel().rows.length
  const total = table.getFilteredRowModel().rows.length
  const currentPage = table.getState().pagination.pageIndex + 1
  const pageCount = table.getPageCount()

  const rowsSelectedText = getRowsSelectedText(selected, total, t)
  const pageOfText = getPageOfText(currentPage, pageCount, t)

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-card/50 rounded-xl border">
      <div className="flex-1 text-sm text-muted-foreground">{rowsSelectedText}</div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t?.rowsPerPage ?? 'Rows per page'}</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={value => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">{pageOfText}</div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t?.goToFirstPage ?? 'Go to first page'}</span>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t?.goToPreviousPage ?? 'Go to previous page'}</span>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t?.goToNextPage ?? 'Go to next page'}</span>
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t?.goToLastPage ?? 'Go to last page'}</span>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
