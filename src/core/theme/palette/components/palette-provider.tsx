'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { setCookie } from '@/core/utils'

import { DEFAULT_THEME_PALETTE, THEME_COOKIE_NAME, THEMES, type TTheme } from '../palette.config'
import { createDarkThemeByBase, getBaseTheme, isDarkTheme } from '../utils'

/** Context value for palette state, setter, dark mode flag, and toggle. */
export interface IThemePaletteContext {
  palette: TTheme
  setPalette: (theme: TTheme) => void
  isDark: boolean
  basePalette: string
  toggleMode: () => void
}

const ThemePaletteContext = createContext<IThemePaletteContext | null>(null)

/** Props for ThemePaletteProvider. */
interface IThemePaletteProviderProps {
  children: React.ReactNode
  initialPalette?: TTheme
}

const applyPalette = (palette: TTheme) => {
  const root = document.documentElement
  THEMES.forEach(t => root.classList.remove(t))
  root.classList.add(palette)

  if (isDarkTheme(palette)) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  root.setAttribute('data-theme', palette)
}

/**
 * Provider for the application's color palette and dark mode.
 * Persists selection in cookies and syncs CSS classes and data-theme to the document root.
 */
export const ThemePaletteProvider = ({
  children,
  initialPalette = DEFAULT_THEME_PALETTE as TTheme,
}: IThemePaletteProviderProps) => {
  const [palette, setPaletteState] = useState<TTheme>(initialPalette)

  const setPalette = useCallback((newPalette: TTheme) => {
    setPaletteState(newPalette)
    applyPalette(newPalette)
    setCookie(THEME_COOKIE_NAME, newPalette)
  }, [])

  const toggleMode = useCallback(() => {
    const base = getBaseTheme(palette)
    const newPalette = isDarkTheme(palette) ? (base as TTheme) : (createDarkThemeByBase(base) as TTheme)
    setPalette(newPalette)
  }, [palette, setPalette])

  useEffect(() => {
    applyPalette(palette)
  }, [])

  const value: IThemePaletteContext = {
    palette,
    setPalette,
    isDark: isDarkTheme(palette),
    basePalette: getBaseTheme(palette),
    toggleMode,
  }

  return <ThemePaletteContext.Provider value={value}>{children}</ThemePaletteContext.Provider>
}

/**
 * Hook to read and update the current palette and dark mode. Must be used within ThemePaletteProvider.
 */
export const useThemePalette = (): IThemePaletteContext => {
  const context = useContext(ThemePaletteContext)
  if (!context) throw new Error('useThemePalette must be used within ThemePaletteProvider')
  return context
}
