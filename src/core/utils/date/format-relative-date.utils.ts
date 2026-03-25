/**
 * Relative date formatting utility using native Intl API.
 *
 * @module utils/date/format-relative-date
 */

import { defaultLocale, type TLocale } from '@/core/lib/i18n'

/**
 * Relative time formatters for each locale.
 */
const relativeTimeFormatters: Record<TLocale, Intl.RelativeTimeFormat> = {
  en: new Intl.RelativeTimeFormat('en', { numeric: 'auto' }),
  es: new Intl.RelativeTimeFormat('es', { numeric: 'auto' }),
}

/**
 * Helper to check if a date is today.
 */
function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Normalizes a date input to a Date object.
 */
function toDate(date: Date | string | number): Date {
  return typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
}

/**
 * Formats a date relative to the current time with localized strings.
 *
 * Uses Intl.RelativeTimeFormat for native localization:
 * - 'today' is handled specially (Intl returns 'now' for 0 days)
 * - 'yesterday' / 'ayer' handled natively by Intl
 * - Other dates use relative format (e.g., '2 days ago', 'in 3 days')
 *
 * @param date - The date to format (Date object, ISO string, or timestamp)
 * @param locale - The locale to use for formatting, defaults to i18n defaultLocale
 * @returns A human-readable relative date string
 *
 * @example
 * formatRelativeDate(new Date()) // 'today' (en) / 'hoy' (es)
 * formatRelativeDate(new Date(Date.now() - 86400000)) // 'yesterday' (en) / 'ayer' (es)
 * formatRelativeDate(new Date(Date.now() - 3 * 86400000)) // '3 days ago' (en)
 */
export function formatRelativeDate(date: Date | string | number, locale: TLocale = defaultLocale): string {
  const dateObj = toDate(date)

  // Intl.RelativeTimeFormat returns "now" for 0 days, but we want "today"
  if (isToday(dateObj)) {
    return relativeTimeFormatters[locale].format(0, 'day').replace('now', 'today').replace('ahora', 'hoy')
  }

  const now = new Date()
  const diffInMs = dateObj.getTime() - now.getTime()
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24))

  return relativeTimeFormatters[locale].format(diffInDays, 'day')
}
