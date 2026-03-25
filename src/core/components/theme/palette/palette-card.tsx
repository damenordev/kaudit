'use client'

import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { cn } from '@/core/utils'

export interface IPaletteCardProps {
  baseTheme: string
  isActive: boolean
  previewThemeClass: string
  onClick: () => void
}

export const PaletteCard = ({ baseTheme, isActive, previewThemeClass, onClick }: IPaletteCardProps) => {
  const t = useTranslations('settings.appearance')

  return (
    <button
      type="button"
      aria-label={t(`themeLabels.${baseTheme}`)}
      onClick={onClick}
      className={cn(
        'group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl p-3 transition-all duration-300',
        previewThemeClass,
        isActive
          ? 'bg-linear-to-b from-primary/10 to-primary/5 ring-2 ring-primary/50'
          : 'bg-muted/30 ring-1 ring-border/50 hover:bg-muted/50 hover:ring-border'
      )}
    >
      <div className="flex h-10 w-full gap-0.5 overflow-hidden rounded-lg border border-border/10 shadow-sm">
        <div className="h-full flex-1 bg-primary" />
        <div className="h-full flex-1 bg-secondary" />
        <div className="h-full flex-1 bg-muted" />
      </div>

      <span className={cn('text-xs font-bold transition-colors', isActive ? 'text-primary' : 'text-foreground')}>
        {t(`themeLabels.${baseTheme}`)}
      </span>

      {isActive && (
        <div className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary shadow-md transition-transform animate-in zoom-in-50">
          <Check className="size-3 text-primary-foreground" strokeWidth={3} />
        </div>
      )}
    </button>
  )
}
