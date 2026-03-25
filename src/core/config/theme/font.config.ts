/**
 * Font Groups Configuration
 * Each group defines a coherent set of sans, serif, and mono fonts.
 */

/** Available font group ids. */
export const FONT_GROUPS = ['modern', 'technical', 'elegant', 'soft'] as const
/** Font group identifier. */
export type TThemeFontGroup = (typeof FONT_GROUPS)[number]
export type TFontGroup = TThemeFontGroup

export const DEFAULT_FONT_GROUP: TThemeFontGroup = 'modern'
export const FONT_COOKIE_NAME = 'font-group'

/** Per-group config: label, description, and CSS font-family for sans/serif/mono. */
export interface IFontGroupConfig {
  label: string
  description: string
  /** CSS font-family strings for each variant */
  fonts: {
    sans: string
    serif: string
    mono: string
  }
}

export const FONT_GROUP_CONFIG: Record<TThemeFontGroup, IFontGroupConfig> = {
  modern: {
    label: 'Moderno',
    description: 'Inter / Lora / Geist Mono',
    fonts: {
      sans: 'var(--font-inter), ui-sans-serif, system-ui',
      serif: 'var(--font-lora), ui-serif, Georgia',
      mono: 'var(--font-geist-mono), ui-monospace, SFMono-Regular',
    },
  },
  technical: {
    label: 'Técnico',
    description: 'Geist Sans / Lora / Geist Mono',
    fonts: {
      sans: 'var(--font-geist-sans), ui-sans-serif, system-ui',
      serif: 'var(--font-lora), ui-serif, Georgia',
      mono: 'var(--font-geist-mono), ui-monospace, SFMono-Regular',
    },
  },
  elegant: {
    label: 'Elegante',
    description: 'Lora / Lora / Geist Mono',
    fonts: {
      sans: 'var(--font-lora), ui-serif, Georgia',
      serif: 'var(--font-lora), ui-serif, Georgia',
      mono: 'var(--font-geist-mono), ui-monospace, SFMono-Regular',
    },
  },
  soft: {
    label: 'Suave',
    description: 'Outfit / Lora / Geist Mono',
    fonts: {
      sans: 'var(--font-outfit), ui-sans-serif, system-ui',
      serif: 'var(--font-lora), ui-serif, Georgia',
      mono: 'var(--font-geist-mono), ui-monospace, SFMono-Regular',
    },
  },
}
