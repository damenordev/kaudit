'use client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Settings, Moon, Sun } from 'lucide-react'
import { useNavbar } from './use-navbar'
import { Popover, PopoverContent, PopoverTrigger } from '@/core/ui/popover'
import { Button } from '@/core/ui/button'
import { LocaleSwitcher } from '@/core/components/settings/locale-switcher'

import { useTranslations } from 'next-intl'
import { useThemePalette } from '@/core/components/theme/palette/palette-provider'
import { BASE_THEMES, THEME_LABELS, type TThemePaletteBase } from '@/core/config/theme/palette.config'
import { createDarkThemeByBase } from '@/core/styles/theme/palette.utils'
import { cn } from '@/core/utils/cn.utils'
import { routesConfig } from '@/core/config'

const MusicToggle = dynamic(() => import('../music-toggle').then(m => m.MusicToggle), {
  ssr: false,
})

export function Navbar() {
  const { time } = useNavbar()

  const { isDark, toggleMode, basePalette, setPalette } = useThemePalette()
  const t = useTranslations('settings.appearance')

  const handlePaletteSelect = (selectedBase: string) => {
    const newPalette = isDark ? createDarkThemeByBase(selectedBase) : selectedBase
    setPalette(newPalette as TThemePaletteBase)
  }

  return (
    <header className="fixed top-0 left-0 w-full z-100000000 p-2 md:px-6 md:py-4 pointer-events-none">
      <div className="mx-auto w-full max-w-7xl">
        <div className="pointer-events-auto flex items-center justify-between p-2.5 bg-background dark:bg-background/50 dark:backdrop-blur-lg border border-border/40 shadow-lg rounded-2xl transition-all duration-300">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 overflow-hidden group-hover:scale-105 transition-transform">
                <img src="/logo.png" alt="KAudit Logo" className="w-6 h-6 object-contain" />
              </div>
              <h3 className="font-mono font-medium text-xl md:text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                KAudit
              </h3>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href={routesConfig.dashboard.root}
              className="text-xs md:text-sm font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/docs"
              className="text-xs md:text-sm font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
            <Link
              href={routesConfig.auth.signIn}
              className="text-xs md:text-sm font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Acceso
            </Link>
          </nav>

          {/* Right Actions (Time, Sound, Settings) */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block relative top-0.5 font-mono text-xs md:text-sm text-foreground/80 tracking-widest">
              {time}
            </div>

            <div className="h-5 w-px bg-border/50 hidden md:block" />

            <div className="flex items-center gap-2">
              <MusicToggle />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-[36px] h-[36px] rounded-full bg-primary/10 hover:bg-primary/20 text-foreground transition-colors border border-transparent hover:border-primary/20"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  sideOffset={16}
                  align="end"
                  className="w-[340px] p-5 rounded-3xl bg-background border border-border shadow-2xl"
                >
                  <div className="space-y-6">
                    {/* Locale section */}
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Idioma</h4>
                      <LocaleSwitcher className="w-full justify-between bg-muted/50 border-border hover:bg-muted transition-colors" />
                    </div>

                    <div className="h-px w-full bg-border" />

                    {/* Theme section inline */}
                    <div className="space-y-4">
                      <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Apariencia</h4>

                      <div className="space-y-4">
                        <div>
                          <h5 className="mb-2 text-xs font-semibold leading-none text-foreground">{t('mode.title')}</h5>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              size="sm"
                              variant={!isDark ? 'default' : 'outline'}
                              className="w-full transition-colors"
                              onClick={() => isDark && toggleMode()}
                            >
                              <Sun className="mr-2 h-4 w-4" />
                              {t('mode.light')}
                            </Button>
                            <Button
                              size="sm"
                              variant={isDark ? 'default' : 'outline'}
                              className="w-full transition-colors"
                              onClick={() => !isDark && toggleMode()}
                            >
                              <Moon className="mr-2 h-4 w-4" />
                              {t('mode.dark')}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h5 className="mb-2 text-xs font-semibold leading-none text-foreground">{t('accent')}</h5>
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
                                    'flex flex-col items-center justify-center p-3 rounded-xl transition-all border outline-hidden cursor-pointer active:scale-[0.98]',
                                    isActive
                                      ? 'bg-primary/10 border-primary ring-1 ring-primary/50'
                                      : 'bg-muted/50 border-border hover:bg-muted hover:border-foreground/20',
                                    previewClass
                                  )}
                                >
                                  <div className="flex gap-1 h-3 w-10 rounded-full overflow-hidden mb-2 shadow-sm ring-1 ring-black/10 dark:ring-white/10">
                                    <div className="w-1/2 bg-primary"></div>
                                    <div className="w-1/2 bg-secondary"></div>
                                  </div>
                                  <span
                                    className={cn(
                                      'text-[10px] font-medium leading-none tracking-tight pt-1',
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
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
