'use client'

import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { cn } from '@/core/utils'
import { RADIUS_GROUP_CONFIG, type TRadiusGroup } from '../radius.config'

export interface IRadiusCardProps {
  group: TRadiusGroup
  isActive: boolean
  onClick: () => void
}

export const RadiusCard = ({ group, isActive, onClick }: IRadiusCardProps) => {
  const t = useTranslations('settings.appearance')
  const config = RADIUS_GROUP_CONFIG[group]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl p-2 transition-all duration-300',
        isActive
          ? 'bg-linear-to-b from-primary/10 to-primary/5 ring-2 ring-primary/50'
          : 'bg-muted/30 ring-1 ring-border/50 hover:bg-muted/50 hover:ring-border'
      )}
    >
      <div className="relative flex h-16 w-full items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-background shadow-xs">
        <div className="absolute inset-0 bg-linear-to-br from-primary/3 to-transparent opacity-30" />
        <div className="relative flex w-full h-full items-center p-2.5 gap-2">
          <div
            className="aspect-square h-full border border-primary/20 bg-background/50 shadow-xs flex items-center justify-center"
            style={{ borderRadius: config.value }}
          >
            <div className="size-1.5 rounded-full bg-primary/20" />
          </div>

          <div className="flex flex-1 flex-col h-full gap-1.5">
            <div className="w-full flex-1 bg-primary/10" style={{ borderRadius: config.value }} />
            <div
              className="w-full flex-1 border border-primary/20 border-dashed"
              style={{ borderRadius: config.value }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-center">
        <span className={cn('text-xs font-bold transition-colors', isActive ? 'text-primary' : 'text-foreground')}>
          {t(`radiusGroups.${group}.label`)}
        </span>
        <span className="text-xs text-muted-foreground opacity-50 font-medium leading-none">
          {t(`radiusGroups.${group}.description`)}
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
