import { type ColumnDef } from '@tanstack/react-table'
import { ExternalLink, Eye } from 'lucide-react'

import { Button } from '@/core/ui/button'
import { DataTableColumnHeader } from '@/core/ui/data-table'

import { AuditStatusBadge } from '../audit-status-badge'
import type { IAuditStatusResponse } from '../../types/api.types'

/**
 * Column definitions for the audits data table.
 * Muestra fecha, repo, estado, PR y acciones.
 */
export const columns = (t: {
  date: string
  repository: string
  status: string
  prUrl: string
  actions: string
  viewDetails: string
}): ColumnDef<IAuditStatusResponse>[] => [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t.date} />,
    cell: ({ row }) => {
      const date = row.original.createdAt
      const formattedDate = date instanceof Date ? date.toLocaleDateString() : new Date(date).toLocaleDateString()
      return <span className="text-muted-foreground text-sm">{formattedDate}</span>
    },
  },
  {
    accessorKey: 'repoUrl',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t.repository} />,
    cell: ({ row }) => {
      const repoUrl = row.original.repoUrl
      const branchName = row.original.branchName
      // Extraer nombre del repo de la URL
      const repoName = repoUrl.split('/').slice(-2).join('/')
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-sm truncate max-w-[200px]">{repoName}</span>
          <span className="text-xs text-muted-foreground">{branchName}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t.status} />,
    cell: ({ row }) => {
      const status = row.original.status as IAuditStatusResponse['status']
      return <AuditStatusBadge status={status as any} />
    },
  },
  {
    accessorKey: 'prUrl',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t.prUrl} />,
    cell: ({ row }) => {
      const prUrl = row.original.prUrl
      if (!prUrl) {
        return <span className="text-muted-foreground text-sm">-</span>
      }
      return (
        <a
          href={prUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
        >
          Ver PR
          <ExternalLink className="size-3" />
        </a>
      )
    },
  },
  {
    id: 'actions',
    header: t.actions,
    cell: ({ row }) => {
      const auditId = row.original.id
      return (
        <Button variant="ghost" size="sm" asChild>
          <a href={`/dashboard/audits/${auditId}`}>
            <Eye className="size-4" />
            {t.viewDetails}
          </a>
        </Button>
      )
    },
  },
]
