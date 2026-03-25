'use client'

import { Paintbrush, Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Popover, PopoverContent, PopoverTrigger } from '@/core/ui/overlays/popover'
import { Button } from '@/core/ui/primitives/button'
import { cn } from '@/core/utils/cn.utils'
import { useThemePalette } from '@/core/theme/palette/components/palette-provider'
import { BASE_THEMES, THEME_LABELS, type TTheme } from '@/core/theme/palette/palette.config'
import { createDarkThemeByBase } from '@/core/theme/palette/utils'

export function LandingThemeToggle() {
  const { isDark, toggleMode, basePalette, setPalette } = useThemePalette()
  const t = useTranslations('settings.appearance')

  const handlePaletteSelect = (selectedBase: string) => {
    const newPalette = isDark ? createDarkThemeByBase(selectedBase) : selectedBase
    setPalette(newPalette as TTheme)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Paintbrush />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[320px] p-4">
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-medium leading-none">{t('mode.title')}</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={!isDark ? 'default' : 'outline'}
                className="w-full"
                onClick={() => isDark && toggleMode()}
              >
                <Sun className="mr-2 h-4 w-4" />
                {t('mode.light')}
              </Button>
              <Button
                variant={isDark ? 'default' : 'outline'}
                className="w-full"
                onClick={() => !isDark && toggleMode()}
              >
                <Moon className="mr-2 h-4 w-4" />
                {t('mode.dark')}
              </Button>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium leading-none">{t('accent')}</h4>
            <div className="grid grid-cols-3 gap-2">
              {BASE_THEMES.map(theme => {
                const isActive = basePalette === theme
                const previewClass = isDark ? createDarkThemeByBase(theme) : theme
                return (
                  <button
                    key={theme}
                    onClick={() => handlePaletteSelect(theme)}
                    aria-label={`Select ${THEME_LABELS[theme] || theme} palette`}
                    className={cn(
                      'flex flex-col items-center justify-center p-3 rounded-md transition-all border outline-hidden cursor-pointer active:scale-[0.98]',
                      isActive
                        ? 'bg-primary/10 border-primary ring-1 ring-primary/50'
                        : 'hover:bg-accent border-border/50 hover:border-border',
                      previewClass
                    )}
                  >
                    <div className="flex gap-1 h-3 w-10 rounded-full overflow-hidden mb-2 shadow-sm ring-1 ring-black/10 dark:ring-white/10">
                      <div className="w-1/2 bg-primary"></div>
                      <div className="w-1/2 bg-secondary"></div>
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-medium leading-none tracking-tight',
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {THEME_LABELS[theme] || theme}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
