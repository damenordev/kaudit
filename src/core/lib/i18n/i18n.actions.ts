'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { locales, defaultLocale, type TLocale } from './i18n.config'

export async function setLocale(locale: TLocale) {
  const cookieStore = await cookies()
  cookieStore.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  revalidatePath('/', 'layout')
}

export async function getLocale(): Promise<TLocale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value
  return locale && locales.includes(locale as TLocale) ? (locale as TLocale) : defaultLocale
}
