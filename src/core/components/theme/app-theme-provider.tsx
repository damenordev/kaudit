import { ThemeFontProvider } from './font/font-provider'
import { ThemePaletteProvider } from './palette/palette-provider'
import { ThemeRadiusProvider } from './radius/radius-provider'
import type { IAppThemeConfig } from './theme.types'

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
