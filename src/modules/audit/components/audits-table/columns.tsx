import Link from 'next/link'
import { type ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/core/ui/badge'
import { DataTableColumnHeader } from '@/core/ui/data-table'

import { type IAuditStatusResponse } from '../../types/api.types'

const STATUS_VARIANT_MAP: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  completed: 'default',
  failed: 'destructive',
  processing: 'secondary',
  pending: 'outline',
  validating: 'secondary',
  generating: 'secondary',
  blocked: 'destructive',
}

export const columns: ColumnDef<IAuditStatusResponse>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const date = row.original.createdAt
      return <span className="text-muted-foreground">{new Date(date).toLocaleDateString()}</span>
    },
  },
  {
    accessorKey: 'repoUrl',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Repository" />,
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.repoUrl}</span>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status
      const variant = STATUS_VARIANT_MAP[status] ?? 'outline'
      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'prUrl',
    header: ({ column }) => <DataTableColumnHeader column={column} title="PR" />,
    cell: ({ row }) => {
      const prUrl = row.original.prUrl
      if (!prUrl) return <span className="text-muted-foreground">-</span>
      return (
        <a href={prUrl} className="text-blue-500 hover:underline" rel="noopener noreferrer" target="_blank">
          View PR
        </a>
      )
    },
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
    cell: ({ row }) => (
      <Link className="text-blue-500 hover:underline" href={`/dashboard/audits/${row.original.id}`}>
        Details
      </Link>
    ),
  },
]
