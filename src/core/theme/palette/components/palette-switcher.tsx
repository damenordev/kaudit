'use client'

import { BASE_THEMES, type TTheme, type TThemePalette } from '../palette.config'
import { createDarkThemeByBase } from '../utils'
import { PaletteCard } from './palette-card'
import { useThemePalette } from './palette-provider'

/**
 * Grid component for switching between different color palettes.
 */
export const ThemeSwitcher = () => {
  const { basePalette, isDark, setPalette } = useThemePalette()

  const handlePaletteSelect = (selectedBase: string) => {
    const newPalette = isDark ? createDarkThemeByBase(selectedBase) : selectedBase
    setPalette(newPalette as TTheme)
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
      {BASE_THEMES.map((base: TThemePalette) => (
        <PaletteCard
          key={base}
          baseTheme={base}
          isActive={basePalette === base}
          previewThemeClass={isDark ? createDarkThemeByBase(base) : base}
          onClick={() => handlePaletteSelect(base)}
        />
      ))}
    </div>
  )
}
