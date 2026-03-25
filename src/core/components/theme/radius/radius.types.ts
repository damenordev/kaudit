import type { TRadiusGroup } from '@/core/config/theme/radius.config'

/** Context value for radius state (rem), setter, and preset group. */
export interface IThemeRadiusContext {
  radius: number
  setRadius: (value: number) => void
  radiusGroup: TRadiusGroup | 'custom'
  setRadiusGroup: (group: TRadiusGroup) => void
}

/** Props for ThemeRadiusProvider. */
export interface IThemeRadiusProviderProps {
  children: React.ReactNode
  initialRadius?: number
}
