/**
 * Radius Groups Configuration
 * Defines border radius values for the application.
 */

/** Available radius preset ids. */
export const RADIUS_GROUPS = ['none', 'sm', 'md', 'lg', 'xl'] as const
/** Radius preset identifier. */
export type TRadiusGroup = (typeof RADIUS_GROUPS)[number]

export const DEFAULT_RADIUS_GROUP: TRadiusGroup = 'md'
export const RADIUS_COOKIE_NAME = 'radius-value'

/** Per-group config: label, CSS value (e.g. '0.5rem'), and short description. */
export interface IRadiusGroupConfig {
  label: string
  /** CSS value (e.g. '0.5rem') */
  value: string
  description: string
}

export const RADIUS_GROUP_CONFIG: Record<TRadiusGroup, IRadiusGroupConfig> = {
  none: {
    label: 'Cuadrado',
    value: '0',
    description: '0px',
  },
  sm: {
    label: 'Sutil',
    value: '0.3rem',
    description: '4px',
  },
  md: {
    label: 'Estándar',
    value: '0.5rem',
    description: '8px',
  },
  lg: {
    label: 'Redondeado',
    value: '0.75rem',
    description: '12px',
  },
  xl: {
    label: 'Suave',
    value: '1rem',
    description: '16px',
  },
}
