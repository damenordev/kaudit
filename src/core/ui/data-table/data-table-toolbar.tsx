import type { ReactNode } from 'react'
import type { Table } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'

import { Button } from '@/core/ui/primitives/button'

import type { IDataTableFilterConfig, IDataTableTranslations, TDataTableViewMode } from './data-table.types'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableViewToggle } from './data-table-view-toggle'
import { renderToolbarFilter } from './utils'

export interface IDataTableToolbarProps<TData> {
  table: Table<TData>
  filters?: IDataTableFilterConfig[]
  searchValue?: string
  onSearchChange?: (value: string) => void
  enableViewToggle?: boolean
  viewMode?: TDataTableViewMode
  onViewModeChange?: (mode: TDataTableViewMode) => void
  translations?: IDataTableTranslations
  children?: ReactNode
}

/**
 * Toolbar: filtros (via config), toggle de vista, visibilidad de columnas y acciones custom.
 * El renderizado de filtros se delega a renderToolbarFilter.
 */
export const DataTableToolbar = <TData,>({
  table,
  filters = [],
  searchValue,
  onSearchChange,
  enableViewToggle,
  viewMode,
  onViewModeChange,
  translations: t,
  children,
}: IDataTableToolbarProps<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0 || (!!searchValue && searchValue.length > 0)

  const handleReset = () => {
    table.resetColumnFilters()
    if (onSearchChange) onSearchChange('')
  }

  const filterOptions = {
    table,
    searchValue,
    onSearchChange,
    translations: t,
  }

  return (
    <div className="flex items-center justify-between gap-2 p-2 shrink-0 bg-card/50 border rounded-xl">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {filters.map(f => renderToolbarFilter(f, filterOptions))}
        {children}
        {isFiltered && (
          <Button variant="ghost" onClick={handleReset} className="h-8 px-2 lg:px-3">
            {t?.reset ?? 'Reset'}
            <XIcon />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {enableViewToggle && viewMode !== undefined && onViewModeChange && (
          <DataTableViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} translations={t} />
        )}
        <DataTableViewOptions table={table} translations={t} />
      </div>
    </div>
  )
}
