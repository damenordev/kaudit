'use client'

import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { cn } from '@/core/utils'
import { type TDateFormat, DATE_FORMAT_TO_INTL_OPTIONS } from '../config'

export interface IDateFormatCardProps {
  formatValue: TDateFormat
  isActive: boolean
  onClick: () => void
  disabled?: boolean
}

const formatDate = (date: Date, format: TDateFormat): string => {
  const options = DATE_FORMAT_TO_INTL_OPTIONS[format]
  return new Intl.DateTimeFormat('en', options).format(date)
}

export const DateFormatCard = ({ formatValue, isActive, onClick, disabled }: IDateFormatCardProps) => {
  const t = useTranslations('settings.general')
  const now = new Date()

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl p-3 transition-all duration-300',
        isActive
          ? 'bg-linear-to-b from-primary/10 to-primary/5 ring-2 ring-primary/50'
          : 'bg-muted/30 ring-1 ring-border/50 hover:bg-muted/50 hover:ring-border',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <div className="relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-background py-4 shadow-sm">
        <div className="absolute inset-0 bg-linear-to-br from-primary/3 to-transparent opacity-50" />
        <span
          className={cn(
            'text-center text-sm font-bold tracking-tight transition-transform duration-300 group-hover:scale-105 md:text-xl',
            isActive ? 'text-primary' : 'text-foreground'
          )}
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {formatDate(now, formatValue)}
        </span>
      </div>

      <div className="flex flex-col items-center text-center">
        <span className={cn('text-xs font-bold transition-colors', isActive ? 'text-primary' : 'text-foreground')}>
          {t(`dateFormats.${formatValue}.label`)}
        </span>
        <span className="mt-0.5 text-xs font-medium leading-none text-muted-foreground opacity-60">
          {t(`dateFormats.${formatValue}.description`)}
        </span>
      </div>

      {isActive && (
        <div className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary shadow-md transition-transform animate-in zoom-in-50">
          <Check className="size-3 text-primary-foreground" strokeWidth={3} />
        </div>
      )}
    </button>
  )
}
