/** Palettes available in the dashboard (user can choose). */
export const DASHBOARD_PALETTES = [
  'amethyst',
  'canvas',
  'citrus',
  'forest',
  'santa-fe',
  'spooky',
  'underground',
] as const
/** Palettes used only on public/landing layouts (fixed, not from cookies). */
export const PUBLIC_PALETTES = ['superdesign'] as const

export const ALL_PALETTES = [...DASHBOARD_PALETTES, ...PUBLIC_PALETTES] as const

/** Base palette name (no -dark suffix). */
export type TThemePaletteBase = (typeof ALL_PALETTES)[number]
export const DEFAULT_THEME_PALETTE: TThemePaletteBase = 'citrus'
export const PALETTE_COOKIE_NAME = 'theme-palette'

/** Full theme class names (base + base-dark for each palette). */
export const THEMES = [
  ...DASHBOARD_PALETTES,
  ...DASHBOARD_PALETTES.map(t => `${t}-dark` as const),
  ...PUBLIC_PALETTES,
  ...PUBLIC_PALETTES.map(t => `${t}-dark` as const),
] as const

/** Full theme value (e.g. 'citrus' or 'citrus-dark'). */
export type TThemePalette = (typeof THEMES)[number]
export const THEME_COOKIE_NAME = 'theme'

export const BASE_THEMES = DASHBOARD_PALETTES
/** Human-readable labels for each base palette. */
export const THEME_LABELS: Record<string, string> = {
  amethyst: 'Amethyst',
  canvas: 'Canvas',
  citrus: 'Citrus',
  forest: 'Forest',
  'santa-fe': 'Santa Fé',
  spooky: 'Spooky',
  underground: 'Underground',
}
