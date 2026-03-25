import { type TThemePalette } from '@/core/config/theme/palette.config'

/** Returns the base palette name (e.g. 'citrus' from 'citrus-dark'). */
export const getBaseTheme = (theme: string) => theme.replace('-dark', '') as TThemePalette

/** True if the theme string is a dark variant (ends with '-dark'). */
export const isDarkTheme = (theme: string) => theme.endsWith('-dark')

/** Builds the dark theme class name from a base palette (e.g. 'citrus' -> 'citrus-dark'). */
export const createDarkThemeByBase = (base: string) => `${base}-dark`
