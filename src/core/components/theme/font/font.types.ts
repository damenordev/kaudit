import type { TThemeFontGroup } from '@/core/config/theme/font.config'

/** Context value for font group state and setter. */
export interface IThemeFontContext {
  fontGroup: TThemeFontGroup
  seTThemeFontGroup: (group: TThemeFontGroup) => void
}

/** Props for ThemeFontProvider. */
export interface IThemeFontProviderProps {
  children: React.ReactNode
  initialFontGroup?: TThemeFontGroup
}
