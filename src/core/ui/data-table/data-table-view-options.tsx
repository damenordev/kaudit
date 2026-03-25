import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { type Table } from '@tanstack/react-table'
import { Settings2Icon } from 'lucide-react'

import { Button } from '@/core/ui/primitives/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/core/ui/overlays/dropdown-menu'

import type { IDataTableTranslations } from './data-table.types'

export interface IDataTableViewOptionsProps<TData> {
  table: Table<TData>
  translations?: IDataTableTranslations
}

/**
 * Dropdown de toggle de visibilidad de columnas.
 * Lista todas las columnas ocultables con checkboxes para mostrar/ocultar.
 */
export const DataTableViewOptions = <TData,>({ table, translations: t }: IDataTableViewOptionsProps<TData>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
          <Settings2Icon />
          {t?.view ?? 'View'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>{t?.toggleColumns ?? 'Toggle columns'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map(column => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={value => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
