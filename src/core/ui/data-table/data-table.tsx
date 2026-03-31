'use client'

import type { Cell, Header, HeaderGroup, Row } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'

import { Button } from '@/core/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/ui/table'

import type { IDataTableProps } from './data-table.types'
import { DataTableToolbar } from './data-table-toolbar'
import { DataTablePagination } from './data-table-pagination'
import { DataTableGridView } from './data-table-grid-view'
import { DataTableEmptyState } from './data-table-empty-state'
import { useDataTable } from './use-data-table'

/**
 * DataTable componible y reutilizable construido sobre TanStack Table.
 * Usa useDataTable para estado e instancia de tabla; este componente solo maneja layout y composición.
 */
export const DataTable = <TData, TValue>({
  columns,
  data,
  filters,
  enableSelection = false,
  bulkActions,
  enableViewToggle = false,
  defaultViewMode = 'table',
  renderGridItem,
  emptyState,
  toolbarActions,
  pageCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  searchValue,
  onSearchChange,
  translations: t,
}: IDataTableProps<TData, TValue>) => {
  const { table, rows, isEmpty, showPagination, selectedRows, hasSelection, viewMode, setViewMode } = useDataTable({
    data,
    columns,
    enableSelection,
    defaultViewMode,
    pageCount,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    columnFilters,
    onColumnFiltersChange,
    translations: t,
  })

  const selectionLabel = t?.rowsSelected ?? `${selectedRows.length} selected`

  return (
    <div className="flex h-full flex-col space-y-2 overflow-hidden">
      {hasSelection && bulkActions ? (
        <div className="flex items-center justify-between gap-2 pb-2 shrink-0 rounded-md bg-muted/50 px-3 py-2 border">
          <span className="text-sm text-muted-foreground">{selectionLabel}</span>
          <div className="flex items-center gap-2">
            {bulkActions(selectedRows.map((r: Row<TData>) => r.original))}
            <Button variant="ghost" size="sm" onClick={() => table.toggleAllRowsSelected(false)} className="h-8">
              <XIcon />
              {t?.reset ?? 'Clear'}
            </Button>
          </div>
        </div>
      ) : (
        <DataTableToolbar
          table={table}
          filters={filters}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          enableViewToggle={enableViewToggle}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          translations={t}
        >
          {toolbarActions}
        </DataTableToolbar>
      )}

      <div className="flex-1 overflow-auto relative">
        {isEmpty ? (
          (emptyState ?? (
            <DataTableEmptyState title={t?.noResultsTitle ?? t?.noResults} description={t?.noResultsDescription} />
          ))
        ) : viewMode === 'grid' && renderGridItem ? (
          <div className="p-1">
            <DataTableGridView rows={rows} renderGridItem={renderGridItem} />
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header: Header<TData, unknown>) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows.map((row: Row<TData>) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {showPagination && (
        <div className="shrink-0 bg-background">
          <DataTablePagination table={table} translations={t} />
        </div>
      )}
    </div>
  )
}
