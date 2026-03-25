'use client'

import { BASE_THEMES, type TThemePaletteBase, type TThemePalette } from '@/core/config/theme/palette.config'
import { createDarkThemeByBase } from '@/core/styles/theme/palette.utils'
import { PaletteCard } from '@/core/components/theme/palette/palette-card'
import { useThemePalette } from '@/core/components/theme/palette/palette-provider'

/**
 * Grid component for switching between different color palettes.
 */
export const ThemeSwitcher = () => {
  const { basePalette, isDark, setPalette } = useThemePalette()

  const handlePaletteSelect = (selectedBase: string) => {
    const newPalette = isDark ? createDarkThemeByBase(selectedBase) : selectedBase
    setPalette(newPalette as TThemePaletteBase)
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
      {BASE_THEMES.map((base: string) => (
        <PaletteCard
          key={base}
          baseTheme={base as TThemePalette}
          isActive={basePalette === base}
          previewThemeClass={isDark ? createDarkThemeByBase(base) : (base as TThemePalette)}
          onClick={() => handlePaletteSelect(base)}
        />
      ))}
    </div>
  )
}
