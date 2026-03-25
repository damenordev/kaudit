import { cookies } from 'next/headers'

import { DEFAULT_FONT_GROUP, FONT_COOKIE_NAME, FONT_GROUPS, type TFontGroup } from './font/font.config'
import { RADIUS_COOKIE_NAME } from './radius/radius.config'
import { DEFAULT_THEME_PALETTE, THEME_COOKIE_NAME, THEMES, type TTheme } from './palette/palette.config'
import type { IThemeConfig } from './types'
import { isDarkTheme } from './palette/utils'

/**
 * Reads theme configuration from cookies (palette, font group, radius).
 * Call in a Server Component or layout to pass initial config to AppThemeProvider.
 * @returns Resolved theme config with defaults for missing/invalid cookies.
 */
export async function getThemeConfig(): Promise<IThemeConfig> {
  const cookieStore = await cookies()

  const [theme, font, radius] = await Promise.all([
    cookieStore.get(THEME_COOKIE_NAME)?.value,
    cookieStore.get(FONT_COOKIE_NAME)?.value,
    cookieStore.get(RADIUS_COOKIE_NAME)?.value,
  ])

  const storedTheme = theme
  const themePalette = (
    storedTheme && THEMES.includes(storedTheme as TTheme) ? storedTheme : DEFAULT_THEME_PALETTE
  ) as TTheme

  // Font
  const storedFont = font
  const themeFontGroup = (
    storedFont && FONT_GROUPS.includes(storedFont as TFontGroup) ? storedFont : DEFAULT_FONT_GROUP
  ) as TFontGroup

  // Radius
  const storedRadius = radius
  const themeRadius = storedRadius ? parseFloat(storedRadius) : 0.5

  const isDark = isDarkTheme(themePalette)

  return { themePalette, themeFontGroup, themeRadius, isDark }
}
