'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { setCookie } from '@/core/utils'
import {
  DEFAULT_FONT_GROUP,
  FONT_COOKIE_NAME,
  FONT_GROUPS,
  type TThemeFontGroup,
} from '@/core/config/theme/font.config'
import type { IThemeFontContext, IThemeFontProviderProps } from './font.types'

const FontContext = createContext<IThemeFontContext | undefined>(undefined)

const applyFontGroup = (group: TThemeFontGroup) => {
  const root = document.documentElement
  FONT_GROUPS.forEach(g => root.classList.remove(`font-${g}`))
  root.classList.add(`font-${group}`)
}

/**
 * Provider for managing the application's font group.
 * Persists selection in cookies and applies CSS classes to document root.
 */
export const ThemeFontProvider = ({ children, initialFontGroup = DEFAULT_FONT_GROUP }: IThemeFontProviderProps) => {
  const [fontGroup, seTThemeFontGroupState] = useState<TThemeFontGroup>(initialFontGroup)

  const seTThemeFontGroup = useCallback((group: TThemeFontGroup) => {
    seTThemeFontGroupState(group)
    applyFontGroup(group)
    setCookie(FONT_COOKIE_NAME, group)
  }, [])

  useEffect(() => {
    applyFontGroup(fontGroup)
  }, [])

  return <FontContext.Provider value={{ fontGroup, seTThemeFontGroup }}>{children}</FontContext.Provider>
}

/**
 * Hook to read and update the current font group. Must be used within ThemeFontProvider.
 */
export const useThemeFont = (): IThemeFontContext => {
  const context = useContext(FontContext)
  if (!context) throw new Error('useThemeFont must be used within ThemeFontProvider')
  return context
}
