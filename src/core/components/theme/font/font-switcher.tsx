'use client'

import { FONT_GROUPS } from '@/core/config/theme/font.config'
import { FontCard } from '@/core/components/theme/font/font-card'
import { useThemeFont } from '@/core/components/theme/font/font-provider'

/**
 * Grid component for switching between different font groups.
 */
export const FontSwitcher = () => {
  const { fontGroup, seTThemeFontGroup } = useThemeFont()

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {FONT_GROUPS.map(id => (
        <FontCard key={id} group={id} isActive={fontGroup === id} onClick={() => seTThemeFontGroup(id)} />
      ))}
    </div>
  )
}
