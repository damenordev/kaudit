'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { type ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/core/ui/badge'
import { DataTableColumnHeader } from '@/core/ui/data-table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/core/ui/tooltip'

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

/** Badge de estado con tooltip para auditorías fallidas */
function StatusBadge({ status, errorMessage }: { status: string; errorMessage?: string }) {
  const t = useTranslations('dashboard.audits.statuses')
  const variant = STATUS_VARIANT_MAP[status] ?? 'outline'
  const label = t(status) ?? status

  // Mostrar tooltip con mensaje de error cuando el status es "failed"
  if (status === 'failed' && errorMessage) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={variant} className="cursor-help">
              {label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            {errorMessage}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return <Badge variant={variant}>{label}</Badge>
}

/**
 * Crea las columnas de la tabla de auditorías con traducciones.
 * Recibe una función traductora para los encabezados de columna.
 */
export function createColumns(t: (key: string) => string): ColumnDef<IAuditStatusResponse>[] {
  return [
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('date')} />,
      cell: ({ row }) => {
        const date = row.original.createdAt
        return <span className="text-muted-foreground">{new Date(date).toLocaleDateString()}</span>
      },
    },
    {
      accessorKey: 'repoUrl',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('repository')} />,
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.repoUrl}</span>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('status')} />,
      cell: ({ row }) => <StatusBadge status={row.original.status} errorMessage={row.original.errorMessage} />,
    },
    {
      accessorKey: 'prUrl',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('prUrl')} />,
      cell: ({ row }) => {
        const prUrl = row.original.prUrl
        if (!prUrl) return <span className="text-muted-foreground">-</span>
        return (
          <a href={prUrl} className="text-blue-500 hover:underline" rel="noopener noreferrer" target="_blank">
            {t('viewPR')}
          </a>
        )
      },
    },
    {
      id: 'actions',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('actions')} />,
      cell: ({ row }) => (
        <Link className="text-blue-500 hover:underline" href={`/dashboard/audits/${row.original.id}`}>
          {t('viewDetails')}
        </Link>
      ),
    },
  ]
}
