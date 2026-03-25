'use client'

import { Moon, Sun } from 'lucide-react'

import { Button } from '@/core/ui/button'

import { useThemePalette } from '@/core/components/theme/palette/palette-provider'

/**
 * Toggle button component for switching between light and dark modes.
 */
export const ThemeModeToggle = () => {
  const { isDark, toggleMode } = useThemePalette()

  return (
    <Button onClick={toggleMode} size="icon" variant="outline">
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}
