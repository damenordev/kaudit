import type { TThemePalette } from '@/core/config/theme/palette.config'

/** Context value for palette state, setter, dark mode flag, and toggle. */
export interface IThemePaletteContext {
  palette: TThemePalette
  setPalette: (theme: TThemePalette) => void
  isDark: boolean
  basePalette: string
  toggleMode: () => void
}

/** Props for ThemePaletteProvider. */
export interface IThemePaletteProviderProps {
  children: React.ReactNode
  initialPalette?: TThemePalette
}
