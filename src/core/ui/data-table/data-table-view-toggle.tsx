import { LayoutGridIcon, TableIcon } from 'lucide-react'

import { cn } from '@/core/utils/cn.utils'
import { Button } from '@/core/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/core/ui/tooltip'

import type { IDataTableTranslations, TDataTableViewMode } from './data-table.types'

export interface IDataTableViewToggleProps {
  viewMode: TDataTableViewMode
  onViewModeChange: (mode: TDataTableViewMode) => void
  translations?: IDataTableTranslations
}

/**
 * Grupo de botones toggle para cambiar entre modos de vista tabla y grid.
 * Muestra botones de icono con tooltips para cada modo.
 */
export const DataTableViewToggle = ({ viewMode, onViewModeChange, translations: t }: IDataTableViewToggleProps) => {
  const modes: { value: TDataTableViewMode; icon: typeof TableIcon; label: string }[] = [
    { value: 'table', icon: TableIcon, label: t?.tableView ?? 'Table view' },
    { value: 'grid', icon: LayoutGridIcon, label: t?.gridView ?? 'Grid view' },
  ]

  return (
    <div className="flex items-center rounded-md border">
      {modes.map(({ value, icon: Icon, label }) => (
        <Tooltip key={value}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 w-8 rounded-none p-0 first:rounded-l-md last:rounded-r-md',
                viewMode === value && 'bg-muted'
              )}
              onClick={() => onViewModeChange(value)}
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
