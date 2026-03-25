'use client'

import { useMemo, useState } from 'react'
import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
  Table,
  Updater,
  VisibilityState,
} from '@tanstack/react-table'
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Checkbox } from '@/core/ui/primitives/checkbox'

import type { IDataTableTranslations, TDataTableViewMode } from './data-table.types'
import { getDefaultPaginationState } from './utils'

export interface IUseDataTableReturn<TData, TValue> {
  table: Table<TData>
  rows: Row<TData>[]
  isEmpty: boolean
  showPagination: boolean
  selectedRows: Row<TData>[]
  hasSelection: boolean
  viewMode: TDataTableViewMode
  setViewMode: (mode: TDataTableViewMode) => void
}

export interface IUseDataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  enableSelection?: boolean
  defaultViewMode?: TDataTableViewMode
  pageCount?: number
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  translations?: IDataTableTranslations
}

/**
 * Hook que construye la instancia de TanStack Table y el estado derivado para DataTable.
 * Centraliza estado (paginación, ordenamiento, filtros, selección, modo de vista) y retorna
 * la instancia de tabla más valores computados (rows, isEmpty, showPagination, selectedRows, hasSelection).
 */
export const useDataTable = <TData, TValue extends unknown>({
  data,
  columns,
  enableSelection = false,
  defaultViewMode = 'table',
  pageCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  translations: t,
}: IUseDataTableProps<TData, TValue>): IUseDataTableReturn<TData, TValue> => {
  const [viewMode, setViewMode] = useState<TDataTableViewMode>(defaultViewMode)
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [internalColumnFilters, setInternalColumnFilters] = useState<ColumnFiltersState>([])
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const [internalPagination, setInternalPagination] = useState<PaginationState>(getDefaultPaginationState)

  const selectColumn: ColumnDef<TData, TValue> = useMemo(
    () => ({
      id: 'select',
      header: ({ table: tbl }) => (
        <Checkbox
          checked={tbl.getIsAllPageRowsSelected() || (tbl.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={value => tbl.toggleAllPageRowsSelected(!!value)}
          aria-label={t?.selectAll ?? 'Select all'}
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label={t?.selectRow ?? 'Select row'}
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    [t?.selectAll, t?.selectRow]
  )

  const finalColumns = useMemo(
    () => (enableSelection ? [selectColumn, ...columns] : columns),
    [enableSelection, selectColumn, columns]
  )

  const finalPagination = pagination ?? internalPagination
  const finalSorting = sorting ?? internalSorting
  const finalColumnFilters = columnFilters ?? internalColumnFilters

  const table = useReactTable({
    data,
    columns: finalColumns,
    pageCount: pageCount ?? -1,
    state: {
      pagination: finalPagination,
      sorting: finalSorting,
      columnVisibility,
      rowSelection,
      columnFilters: finalColumnFilters,
    },
    enableRowSelection: enableSelection,
    manualPagination: !!pageCount,
    manualSorting: !!sorting,
    manualFiltering: !!columnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange:
      onPaginationChange ??
      ((updaterOrValue: Updater<PaginationState>) =>
        setInternalPagination(prev => (typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue))),
    onSortingChange:
      onSortingChange ??
      ((updaterOrValue: Updater<SortingState>) =>
        setInternalSorting(prev => (typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue))),
    onColumnFiltersChange:
      onColumnFiltersChange ??
      ((updaterOrValue: Updater<ColumnFiltersState>) =>
        setInternalColumnFilters(prev =>
          typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue
        )),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const rows = table.getRowModel().rows
  const isEmpty = rows.length === 0
  const showPagination = !isEmpty && table.getPageCount() > 1
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const hasSelection = selectedRows.length > 0

  return {
    table,
    rows,
    isEmpty,
    showPagination,
    selectedRows,
    hasSelection,
    viewMode,
    setViewMode,
  }
}
