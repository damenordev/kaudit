'use client'

import { useTranslations } from 'next-intl'
import { CalendarIcon, XIcon } from 'lucide-react'
import { type DateRange } from 'react-day-picker'

import { cn } from '@/core/utils/cn.utils'
import { Button } from '@/core/ui/button'
import { Calendar } from '@/core/ui/calendar'
import { Input } from '@/core/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/core/ui/popover'

import { auditStatusEnum } from '../../models/audit.constants'
import { FixStaleAuditsButton } from './fix-stale-audits-button'

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

/** Formatea una fecha a string corto (mes día, año). */
function formatDate(date: Date | undefined): string {
  if (!date) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Filtros de auditoría: búsqueda, status, rango de fechas y botón limpiar.
 * Se renderiza dentro del toolbar genérico de DataTable como toolbarActions,
 * compartiendo la misma fila que el selector de columnas.
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
  const tFilters = useTranslations('dashboard.audits.filters')
  const tStatuses = useTranslations('dashboard.audits.statuses')

  // Opciones de status para el filtro, derivadas del enum con traducciones
  const statusOptions = [
    { label: tFilters('allStatuses'), value: 'all' },
    ...auditStatusEnum.map(s => ({ label: tStatuses(s), value: s })),
  ]

  return (
    <>
      {/* Búsqueda por repo */}
      <Input
        aria-label={tFilters('searchAriaLabel')}
        placeholder={tFilters('searchPlaceholder')}
        value={searchValue}
        onChange={e => onSearchChange(e.target.value)}
        className="h-8 w-[150px] lg:w-[250px]"
      />

      {/* Filtro por status */}
      <Select value={statusValue} onValueChange={onStatusChange}>
        <SelectTrigger size="sm" className="h-8 w-[160px]">
          <SelectValue placeholder={tFilters('statusPlaceholder')} />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(opt => (
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
              tFilters('dateRange')
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="range" selected={dateRange} onSelect={onDateRangeChange} numberOfMonths={2} />
          {dateRange && (
            <div className="flex justify-end p-2">
              <Button variant="ghost" size="sm" onClick={() => onDateRangeChange(undefined)}>
                {tFilters('clearDates')}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Botón limpiar filtros */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={onClearFilters} className="h-8 px-2 lg:px-3">
          {tFilters('clear')}
          <XIcon />
        </Button>
      )}

      {/* Botón para limpiar auditorías atascadas */}
      <FixStaleAuditsButton />
    </>
  )
}
