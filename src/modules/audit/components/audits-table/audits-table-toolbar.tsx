'use client'

import { CalendarIcon, XIcon } from 'lucide-react'
import { type DateRange } from 'react-day-picker'

import { cn } from '@/core/utils/cn.utils'
import { Button } from '@/core/ui/button'
import { Calendar } from '@/core/ui/calendar'
import { Input } from '@/core/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/core/ui/popover'

import { auditStatusEnum } from '../../models/audit.constants'

export interface IAuditsTableToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  statusValue: string
  onStatusChange: (value: string) => void
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

/** Opciones de status para el filtro, derivadas del enum del schema. */
const STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  ...auditStatusEnum.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s })),
]

/** Formatea una fecha a string ISO corto (YYYY-MM-DD). */
function formatDate(date: Date | undefined): string {
  if (!date) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Toolbar personalizado para la tabla de auditorías.
 * Incluye búsqueda por repo, filtro por status, rango de fechas y botón de limpiar.
 */
export const AuditsTableToolbar = ({
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
  hasActiveFilters,
}: IAuditsTableToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-2 p-2 shrink-0 bg-card/50 border rounded-xl">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Búsqueda por repo */}
        <Input
          aria-label="Search by repository"
          placeholder="Search by repository..."
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* Filtro por status */}
        <Select value={statusValue} onValueChange={onStatusChange}>
          <SelectTrigger size="sm" className="h-8 w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro por rango de fechas */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn('h-8 justify-start text-left font-normal', !dateRange && 'text-muted-foreground')}
            >
              <CalendarIcon className="mr-1 h-3.5 w-3.5" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                  </>
                ) : (
                  formatDate(dateRange.from)
                )
              ) : (
                'Date range'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="range" selected={dateRange} onSelect={onDateRangeChange} numberOfMonths={2} />
            {dateRange && (
              <div className="flex justify-end p-2">
                <Button variant="ghost" size="sm" onClick={() => onDateRangeChange(undefined)}>
                  Clear dates
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearFilters} className="h-8 px-2 lg:px-3">
            Clear
            <XIcon />
          </Button>
        )}
      </div>
    </div>
  )
}
