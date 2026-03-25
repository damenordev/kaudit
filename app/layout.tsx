import '@/core/styles/globals.css'

import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { Agentation } from 'agentation'

import { I18nProvider, getLocale } from '@/core/i18n'
import { AppThemeProvider } from '@/core/theme'
import { getThemeConfig } from '@/core/theme/server'
import { fontVariables } from '@/core/theme/font'
import { Toaster } from '@/core/ui/feedback/sonner'

import { getTranslations } from 'next-intl/server'
import AgentationProvider from './agentation-provider'

export async function generateMetadata() {
  const t = await getTranslations('metadata')
  return {
    title: t('title'),
    description: t('description'),
    icons: [{ rel: 'icon', url: '/favicon.ico' }],
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const themeConfig = await getThemeConfig()
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      className={`${fontVariables} font-${themeConfig.themeFontGroup} ${themeConfig.themePalette} ${themeConfig.isDark ? 'dark' : ''}`}
      data-theme={themeConfig.themePalette}
      style={{ '--radius': `${themeConfig.themeRadius}rem` } as React.CSSProperties}
      suppressHydrationWarning
    >
      <body>
        <I18nProvider>
          {/* <AgentationProvider /> */}
          <AppThemeProvider config={themeConfig}>
            <NuqsAdapter>{children}</NuqsAdapter>
          </AppThemeProvider>
        </I18nProvider>
        <Toaster />
      </body>
    </html>
  )
}
