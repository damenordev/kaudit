import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/core/ui/badge'
import { DataTableColumnHeader } from '@/core/ui/data-table'
import { type IUser } from '../../types/user.types'

/**
 * Column definitions for the users data table.
 * Demonstrates sortable columns, custom cell renderers, and status badges.
 */
export const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    enableSorting: false,
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="First Name" />,
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Name" />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const role = row.original.role
      return (
        <Badge variant={role === 'admin' ? 'default' : 'secondary'} className="capitalize">
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status
      const variant = status === 'active' ? 'default' : status === 'inactive' ? 'destructive' : 'outline'
      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const date = row.original.createdAt
      return <span className="text-muted-foreground">{date.toLocaleDateString()}</span>
    },
  },
]
