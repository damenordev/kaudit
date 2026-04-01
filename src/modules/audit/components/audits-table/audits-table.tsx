'use client'

import { useMemo, startTransition } from 'react'
import { useTranslations } from 'next-intl'
import { type PaginationState, type Updater } from '@tanstack/react-table'
import { type DateRange } from 'react-day-picker'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

import { DataTable, type IDataTableTranslations } from '@/core/ui/data-table'

import { createColumns } from './columns'
import { AuditsTableToolbar } from './audits-table-toolbar'
import { type IAuditStatusResponse } from '../../types/api.types'

export interface IAuditsTableProps {
  data: IAuditStatusResponse[]
  pageCount: number
  translations?: IDataTableTranslations
}

/** Convierte un string ISO a Date para react-day-picker. */
function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined
  const d = new Date(value)
  return isNaN(d.getTime()) ? undefined : d
}

export const AuditsTable = ({ data, pageCount, translations }: IAuditsTableProps) => {
  const tTable = useTranslations('dashboard.audits.table')
  const columns = useMemo(() => createColumns(tTable), [tTable])

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({ shallow: false }))
  const [limit, setLimit] = useQueryState('limit', parseAsInteger.withDefault(10).withOptions({ shallow: false }))
  const [search, setSearch] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({ shallow: false, throttleMs: 500 })
  )
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault('all').withOptions({ shallow: false }))
  const [dateFrom, setDateFrom] = useQueryState('from', parseAsString.withOptions({ shallow: false }))
  const [dateTo, setDateTo] = useQueryState('to', parseAsString.withOptions({ shallow: false }))

  const pagination: PaginationState = { pageIndex: page - 1, pageSize: limit }

  const dateRange: DateRange | undefined = useMemo(() => {
    const from = parseDate(dateFrom)
    const to = parseDate(dateTo)
    if (!from && !to) return undefined
    return { from, to }
  }, [dateFrom, dateTo])

  const hasActiveFilters = !!(search || (status && status !== 'all') || dateRange)

  const handlePaginationChange = (updaterOrValue: Updater<PaginationState>) => {
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue
    startTransition(() => {
      void setPage(next.pageIndex + 1)
      void setLimit(next.pageSize)
    })
  }

  const handleSearchChange = (value: string) => {
    startTransition(() => {
      void setPage(1)
      void setSearch(value || null)
    })
  }

  const handleStatusChange = (value: string) => {
    startTransition(() => {
      void setPage(1)
      void setStatus(value === 'all' ? null : value)
    })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    startTransition(() => {
      void setPage(1)
      void setDateFrom(range?.from?.toISOString() ?? null)
      void setDateTo(range?.to?.toISOString() ?? null)
    })
  }

  const handleClearFilters = () => {
    startTransition(() => {
      void setPage(1)
      void setSearch(null)
      void setStatus(null)
      void setDateFrom(null)
      void setDateTo(null)
    })
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      pagination={pagination}
      onPaginationChange={handlePaginationChange}
      translations={translations}
      toolbarActions={
        <AuditsTableToolbar
          searchValue={search}
          onSearchChange={handleSearchChange}
          statusValue={status ?? 'all'}
          onStatusChange={handleStatusChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      }
    />
  )
}
