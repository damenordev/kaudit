'use client'

import { startTransition } from 'react'
import { type PaginationState, type Updater } from '@tanstack/react-table'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import { DownloadIcon, Trash2Icon } from 'lucide-react'

import { DataTable, type IDataTableFilterConfig, type IDataTableTranslations } from '@/core/ui/data-table'
import { Button } from '@/core/ui/primitives/button'

import { columns } from './columns'
import { UserCard } from './user-card'
import { type IUser } from '../../types/user.types'

export interface IUsersTableProps {
  data: IUser[]
  pageCount: number
  total: number
}

/**
 * Server-side paginated users table with URL-synced state via nuqs.
 * Demonstrates: pagination, search filtering, view toggle (table/grid), bulk actions.
 */
export const UsersTable = ({ data, pageCount }: IUsersTableProps) => {
  // ── URL State (Server Truth) ────────────────────────────────────
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({ shallow: false }))
  const [limit, setLimit] = useQueryState('limit', parseAsInteger.withDefault(10).withOptions({ shallow: false }))
  const [search, setSearch] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({ shallow: false, throttleMs: 500 })
  )

  // ── Derived State ───────────────────────────────────────────────
  const pagination: PaginationState = { pageIndex: page - 1, pageSize: limit }

  // ── Handlers ────────────────────────────────────────────────────
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

  // ── Bulk Actions ────────────────────────────────────────────────
  const handleBulkExport = (users: IUser[]) => {
    console.log(`Exporting ${users.length} users`)
  }

  const handleBulkDelete = (users: IUser[]) => {
    console.log(`Deleting ${users.length} users`)
  }

  // ── Filter Configuration ────────────────────────────────────────
  const filters: IDataTableFilterConfig[] = [
    {
      id: 'q',
      label: 'Search',
      variant: 'search',
      placeholder: 'Search users...',
    },
  ]

  // ── Translations ────────────────────────────────────────────────
  const translations: IDataTableTranslations = {
    noResultsTitle: 'No users found',
    noResultsDescription: 'Try adjusting your search',
    rowsPerPage: 'Rows per page',
    pageOf: ({ current, total }) => `Page ${current} of ${total}`,
    rowsSelected: ({ selected, total }) => `${selected} of ${total} selected`,
    reset: 'Reset',
    tableView: 'Table',
    gridView: 'Grid',
    goToFirstPage: 'First',
    goToPreviousPage: 'Previous',
    goToNextPage: 'Next',
    goToLastPage: 'Last',
  }

  // ── Render ──────────────────────────────────────────────────────
  return (
    <DataTable
      columns={columns}
      data={data}
      filters={filters}
      enableSelection
      bulkActions={selected => (
        <>
          <Button variant="outline" size="sm" onClick={() => handleBulkExport(selected)}>
            <DownloadIcon />
            Export ({selected.length})
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleBulkDelete(selected)}>
            <Trash2Icon />
            Delete ({selected.length})
          </Button>
        </>
      )}
      pageCount={pageCount}
      pagination={pagination}
      onPaginationChange={handlePaginationChange}
      searchValue={search}
      onSearchChange={handleSearchChange}
      enableViewToggle
      renderGridItem={user => <UserCard user={user} />}
      translations={translations}
    />
  )
}
