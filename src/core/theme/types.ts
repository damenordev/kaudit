import type { TFontGroup } from './font/font.config'
import type { TTheme } from './palette/palette.config'

/**
 * Full theme configuration returned by the server (e.g. from cookies).
 * Used to hydrate AppThemeProvider and avoid FOUC.
 */
export interface IThemeConfig {
  themePalette: TTheme
  themeFontGroup: TFontGroup
  themeRadius: number
  isDark: boolean
}
