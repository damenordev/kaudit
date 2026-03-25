import { ThemeFontProvider } from './font/components/font-provider'
import { ThemePaletteProvider } from './palette/components/palette-provider'
import { ThemeRadiusProvider } from './radius/components/radius-provider'
import type { TFontGroup } from './font/font.config'
import type { TTheme } from './palette/palette.config'

/**
 * Initial theme state (usually from server/cookies).
 * All fields are optional; defaults are applied when missing.
 */
export interface IAppThemeConfig {
  themePalette?: TTheme
  themeRadius?: number
  themeFontGroup?: TFontGroup
}

/** Props for the root theme provider. */
export interface IAppThemeProviderProps {
  children: React.ReactNode
  config?: IAppThemeConfig
}

/**
 * Global theme provider that wraps font, palette, and radius providers.
 * Initializes settings from the provided config (usually from SSR).
 */
export const AppThemeProvider: React.FC<IAppThemeProviderProps> = ({ children, config }) => {
  return (
    <ThemePaletteProvider initialPalette={config?.themePalette}>
      <ThemeFontProvider initialFontGroup={config?.themeFontGroup}>
        <ThemeRadiusProvider initialRadius={config?.themeRadius}>{children}</ThemeRadiusProvider>
      </ThemeFontProvider>
    </ThemePaletteProvider>
  )
}
