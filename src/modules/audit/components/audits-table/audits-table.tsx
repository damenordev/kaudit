'use client'

import { startTransition } from 'react'
import { type PaginationState, type Updater } from '@tanstack/react-table'
import { parseAsInteger, useQueryState } from 'nuqs'

import { DataTable, type IDataTableTranslations } from '@/core/ui/data-table'

import { columns } from './columns'
import type { IAuditStatusResponse } from '../../types/api.types'

export interface IAuditsTableProps {
  data: IAuditStatusResponse[]
  pageCount: number
  translations: {
    date: string
    repository: string
    status: string
    prUrl: string
    actions: string
    viewDetails: string
    noResultsTitle: string
    noResultsDescription: string
    rowsPerPage: string
    pageOf: string
  }
}

/**
 * Tabla de auditorías con paginación server-side via nuqs.
 * Sincroniza el estado de paginación con la URL.
 */
export function AuditsTable({ data, pageCount, translations }: IAuditsTableProps) {
  // URL State (Server Truth)
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({ shallow: false }))
  const [limit, setLimit] = useQueryState('limit', parseAsInteger.withDefault(10).withOptions({ shallow: false }))

  // Derived State
  const pagination: PaginationState = { pageIndex: page - 1, pageSize: limit }

  // Handlers
  const handlePaginationChange = (updaterOrValue: Updater<PaginationState>) => {
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue
    startTransition(() => {
      void setPage(next.pageIndex + 1)
      void setLimit(next.pageSize)
    })
  }

  // DataTable translations
  const dataTableTranslations: IDataTableTranslations = {
    noResultsTitle: translations.noResultsTitle,
    noResultsDescription: translations.noResultsDescription,
    rowsPerPage: translations.rowsPerPage,
    pageOf: translations.pageOf,
  }

  return (
    <DataTable
      columns={columns({
        date: translations.date,
        repository: translations.repository,
        status: translations.status,
        prUrl: translations.prUrl,
        actions: translations.actions,
        viewDetails: translations.viewDetails,
      })}
      data={data}
      pageCount={pageCount}
      pagination={pagination}
      onPaginationChange={handlePaginationChange}
      translations={dataTableTranslations}
    />
  )
}
