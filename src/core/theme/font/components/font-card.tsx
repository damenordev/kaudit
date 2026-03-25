'use client'

import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { cn } from '@/core/utils'
import { FONT_GROUP_CONFIG, type TFontGroup } from '../font.config'

export interface IFontCardProps {
  group: TFontGroup
  isActive: boolean
  onClick: () => void
}

export const FontCard = ({ group, isActive, onClick }: IFontCardProps) => {
  const t = useTranslations('settings.typography')
  const config = FONT_GROUP_CONFIG[group]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl p-3 transition-all duration-300',
        isActive
          ? 'bg-linear-to-b from-primary/10 to-primary/5 ring-2 ring-primary/50'
          : 'bg-muted/30 ring-1 ring-border/50 hover:bg-muted/50 hover:ring-border'
      )}
    >
      <div className="relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-background shadow-sm">
        <div className="absolute inset-0 bg-linear-to-br from-primary/3 to-transparent opacity-30" />
        <div className="relative grid grid-cols-3 w-full p-3 gap-2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold" style={{ fontFamily: config.fonts.sans }}>
              Ag
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Sans</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-border/50">
            <span className="text-2xl font-bold" style={{ fontFamily: config.fonts.serif }}>
              Ag
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Serif</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-bold pt-1" style={{ fontFamily: config.fonts.mono }}>
              Ag
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Mono</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center text-center">
        <span
          className={cn(
            'text-xs font-bold transition-colors',
            isActive ? 'text-primary' : 'text-foreground/80 group-hover:text-foreground'
          )}
        >
          {t(`fonts.${group}.label`)}
        </span>
        <span className="text-xs text-muted-foreground opacity-60 leading-none mt-0.5 font-medium">
          {t(`fonts.${group}.description`)}
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
