'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { setCookie } from '@/core/utils'
import { DEFAULT_FONT_GROUP, FONT_COOKIE_NAME, FONT_GROUPS, type TFontGroup } from '../font.config'

/** Context value for font group state and setter. */
interface IFontContext {
  fontGroup: TFontGroup
  setFontGroup: (group: TFontGroup) => void
}

const FontContext = createContext<IFontContext | undefined>(undefined)

const applyFontGroup = (group: TFontGroup) => {
  const root = document.documentElement
  FONT_GROUPS.forEach(g => root.classList.remove(`font-${g}`))
  root.classList.add(`font-${group}`)
}

/** Props for ThemeFontProvider. */
interface IFontProviderProps {
  children: React.ReactNode
  initialFontGroup?: TFontGroup
}

/**
 * Provider for managing the application's font group.
 * Persists selection in cookies and applies CSS classes to document root.
 */
export const ThemeFontProvider = ({ children, initialFontGroup = DEFAULT_FONT_GROUP }: IFontProviderProps) => {
  const [fontGroup, setFontGroupState] = useState<TFontGroup>(initialFontGroup)

  const setFontGroup = useCallback((group: TFontGroup) => {
    setFontGroupState(group)
    applyFontGroup(group)
    setCookie(FONT_COOKIE_NAME, group)
  }, [])

  useEffect(() => {
    applyFontGroup(fontGroup)
  }, [])

  return <FontContext.Provider value={{ fontGroup, setFontGroup }}>{children}</FontContext.Provider>
}

/**
 * Hook to read and update the current font group. Must be used within ThemeFontProvider.
 */
export const useThemeFont = (): IFontContext => {
  const context = useContext(FontContext)
  if (!context) throw new Error('useThemeFont must be used within ThemeFontProvider')
  return context
}
