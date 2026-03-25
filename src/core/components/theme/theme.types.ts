import type { TThemeFontGroup } from '@/core/config/theme/font.config'
import type { TThemePalette } from '@/core/config/theme/palette.config'

/**
 * Initial theme state (usually from server/cookies).
 * All fields are optional; defaults are applied when missing.
 */
export interface IAppThemeConfig {
  themePalette?: TThemePalette
  themeRadius?: number
  themeFontGroup?: TThemeFontGroup
}

/**
 * Full theme configuration returned by the server (e.g. from cookies).
 * Used to hydrate AppThemeProvider and avoid FOUC.
 */
export interface IThemeConfig {
  themePalette: TThemePalette
  themeFontGroup: TThemeFontGroup
  themeRadius: number
  isDark: boolean
}
