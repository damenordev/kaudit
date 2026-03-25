'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { setCookie } from '@/core/utils'
import { RADIUS_COOKIE_NAME, RADIUS_GROUP_CONFIG, type TRadiusGroup } from '../radius.config'

/** Context value for radius state (rem), setter, and preset group. */
interface IRadiusContext {
  radius: number
  setRadius: (value: number) => void
  radiusGroup: TRadiusGroup | 'custom'
  setRadiusGroup: (group: TRadiusGroup) => void
}

const RadiusContext = createContext<IRadiusContext | undefined>(undefined)

const applyRadiusValue = (value: number): void => {
  document.documentElement.style.setProperty('--radius', `${value}rem`)
}

/** Props for ThemeRadiusProvider. */
interface IRadiusProviderProps {
  children: React.ReactNode
  initialRadius?: number
}

/**
 * Provider for the application's border-radius. Persists value in cookies and sets --radius on the document root.
 */
export const ThemeRadiusProvider = ({ children, initialRadius = 0.5 }: IRadiusProviderProps) => {
  const [radius, setRadiusState] = useState<number>(initialRadius)

  const radiusGroup =
    (Object.keys(RADIUS_GROUP_CONFIG).find(
      key => parseFloat(RADIUS_GROUP_CONFIG[key as TRadiusGroup].value) === radius
    ) as TRadiusGroup) || 'custom'

  const setRadius = useCallback((value: number) => {
    setRadiusState(value)
    applyRadiusValue(value)
    setCookie(RADIUS_COOKIE_NAME, value.toString())
  }, [])

  const setRadiusGroup = useCallback((group: TRadiusGroup) => {
    const value = parseFloat(RADIUS_GROUP_CONFIG[group].value)
    setRadiusState(value)
    applyRadiusValue(value)
    setCookie(RADIUS_COOKIE_NAME, value.toString())
  }, [])

  useEffect(() => {
    applyRadiusValue(radius)
  }, [])

  return (
    <RadiusContext.Provider value={{ radius, setRadius, radiusGroup, setRadiusGroup }}>
      {children}
    </RadiusContext.Provider>
  )
}

/**
 * Hook to read and update the current radius. Must be used within ThemeRadiusProvider.
 */
export const useThemeRadius = (): IRadiusContext => {
  const context = useContext(RadiusContext)
  if (!context) throw new Error('useThemeRadius must be used within ThemeRadiusProvider')
  return context
}
