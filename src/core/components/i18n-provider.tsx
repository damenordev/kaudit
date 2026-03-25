import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

export interface II18nProviderProps {
  children: React.ReactNode
}

/**
 * Provider para manejar la internacionalización tanto en Server como en Client Components.
 * Carga los mensajes y el locale actual basado en la configuración de la aplicación.
 */
export async function I18nProvider({ children }: II18nProviderProps) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
