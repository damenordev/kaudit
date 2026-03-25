'use client'

import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { useSidebar, type TSidebarVariant } from '@/core/ui/sidebar'
import { cn } from '@/core/utils/cn.utils'

interface IVariantOption {
  value: TSidebarVariant
}

const OPTIONS: IVariantOption[] = [{ value: 'sidebar' }, { value: 'inset' }, { value: 'floating' }]

const PREVIEW_STYLES: Record<TSidebarVariant, { sidebar: string; content: string }> = {
  sidebar: {
    sidebar: 'w-1/4 rounded-r-none',
    content: 'left-1/4',
  },
  inset: {
    sidebar: 'w-1/4 m-0.5 rounded-sm',
    content: 'left-[28%] m-0.5 rounded-md border border-border/30',
  },
  floating: {
    sidebar: 'w-1/4 m-1 rounded-md shadow-md',
    content: 'left-[28%] m-1 rounded-lg',
  },
}

export function SidebarVariantSwitcher() {
  const t = useTranslations('settings.appearance.layout')
  const { variant, setVariant } = useSidebar()

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {OPTIONS.map(opt => {
        const isSelected = variant === opt.value
        const styles = PREVIEW_STYLES[opt.value]

        return (
          <button
            key={opt.value}
            onClick={() => setVariant(opt.value)}
            className={cn(
              'group relative flex cursor-pointer flex-col items-center gap-3 rounded-xl p-2 transition-all duration-300',
              isSelected
                ? 'bg-linear-to-b from-primary/10 to-primary/5 ring-2 ring-primary/50'
                : 'bg-muted/30 ring-1 ring-border/50 hover:bg-muted/50 hover:ring-border'
            )}
          >
            <div className="relative aspect-5/3 w-full overflow-hidden rounded-lg border border-border/50 bg-background shadow-sm">
              <div className={cn('absolute inset-y-0 left-0 bg-muted/80 transition-all', styles.sidebar)}>
                <div className="flex flex-col gap-0.5 p-1.5">
                  <div className="h-0.5 w-3/4 rounded-full bg-foreground/20" />
                  <div className="h-0.5 w-1/2 rounded-full bg-foreground/10" />
                </div>
              </div>
              <div className={cn('absolute inset-y-0 right-0 bg-background transition-all', styles.content)} />
            </div>

            <span
              className={cn(
                'text-xs font-bold transition-colors',
                isSelected ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {t(`variants.${opt.value}`)}
            </span>

            {isSelected && (
              <div className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary shadow-md transition-transform animate-in zoom-in-50">
                <Check className="size-3 text-primary-foreground" strokeWidth={3} />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
