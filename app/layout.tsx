import '@/core/styles/globals.css'

import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { I18nProvider } from '@/core/components/i18n-provider'
import { AppThemeProvider } from '@/core/components/theme/app-theme-provider'
import { getThemeConfig } from '@/core/lib/theme'
import { fontVariables } from '@/core/styles/theme/fonts'
import { Toaster } from '@/core/ui/sonner'

import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('metadata')
  return {
    title: t('title'),
    description: t('description'),
    icons: [{ rel: 'icon', url: '/logo.png' }],
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const themeConfig = await getThemeConfig()

  return (
    <html
      lang="en"
      className={`${fontVariables} font-${themeConfig.themeFontGroup} ${themeConfig.themePalette} ${themeConfig.isDark ? 'dark' : ''}`}
      data-theme={themeConfig.themePalette}
      style={{ '--radius': `${themeConfig.themeRadius}rem` } as React.CSSProperties}
      suppressHydrationWarning
    >
      <body>
        <I18nProvider>
          <AppThemeProvider config={themeConfig}>
            <NuqsAdapter>{children}</NuqsAdapter>
          </AppThemeProvider>
        </I18nProvider>
        <Toaster />
      </body>
    </html>
  )
}
