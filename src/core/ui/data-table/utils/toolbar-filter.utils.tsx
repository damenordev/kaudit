import type { Table } from '@tanstack/react-table'

import { Input } from '@/core/ui/input'

import type { IDataTableFilterConfig, IDataTableTranslations } from '../data-table.types'
import { DataTableFacetedFilter } from '../data-table-faceted-filter'

export interface IRenderToolbarFilterOptions<TData> {
  table: Table<TData>
  searchValue?: string
  onSearchChange?: (value: string) => void
  translations?: IDataTableTranslations
}

/**
 * Renders a single toolbar filter control based on its variant.
 * Used by DataTableToolbar to keep filter logic out of the layout component.
 *
 * @param filter - Filter configuration
 * @param options - Table instance, search state and callbacks
 * @returns React node or null if filter cannot be rendered
 */
export const renderToolbarFilter = <TData,>(
  filter: IDataTableFilterConfig,
  options: IRenderToolbarFilterOptions<TData>
): React.ReactNode => {
  const { table, searchValue, onSearchChange } = options

  if (filter.variant === 'search') {
    const isGlobalSearch = !!onSearchChange
    const column = isGlobalSearch ? undefined : table.getColumn(filter.id)
    if (!isGlobalSearch && !column) return null
    return (
      <Input
        key={filter.id}
        aria-label={filter.label}
        placeholder={filter.placeholder ?? `${filter.label}...`}
        value={searchValue ?? (column?.getFilterValue() as string) ?? ''}
        onChange={e => {
          if (onSearchChange) onSearchChange(e.target.value)
          else column?.setFilterValue(e.target.value)
        }}
        className="h-8 w-[150px] lg:w-[250px]"
      />
    )
  }

  if (filter.variant === 'select' || filter.variant === 'multi-select') {
    const column = table.getColumn(filter.id)
    if (!column || !filter.options) return null
    return (
      <DataTableFacetedFilter
        key={filter.id}
        column={column}
        title={filter.label}
        options={filter.options}
        translations={options.translations}
      />
    )
  }

  return null
}
