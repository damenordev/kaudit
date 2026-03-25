'use client'

import { RADIUS_GROUPS, type TRadiusGroup } from '../radius.config'
import { useThemeRadius } from './radius-provider'
import { RadiusCard } from './radius-card'

/**
 * Grid component for switching between different border-radius options,
 * including a precision adjustment slider for custom values.
 */
export const RadiusSwitcher = () => {
  const { radiusGroup, setRadiusGroup } = useThemeRadius()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {RADIUS_GROUPS.map((group: TRadiusGroup) => (
        <RadiusCard key={group} group={group} isActive={radiusGroup === group} onClick={() => setRadiusGroup(group)} />
      ))}
    </div>
  )
}
