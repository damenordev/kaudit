'use client'

import { Toaster as SileoToaster } from 'sileo'
import { useTheme } from 'next-themes'

export const Toaster = () => {
  const { theme = 'system' } = useTheme()

  return (
    <SileoToaster
      position="top-center"
      theme={theme as 'light' | 'dark' | 'system'}
      options={{
        fill: 'var(--color-popover)',
        roundness: 16,
        styles: {
          title: 'text-foreground! font-medium',
          description: 'text-muted-foreground!',
          badge: 'bg-muted!',
          button: 'bg-primary! text-primary-foreground! hover:opacity-90',
        },
      }}
    />
  )
}
