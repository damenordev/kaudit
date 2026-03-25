/**
 * Date formatting utility using native Intl API.
 *
 * @module utils/date/format-date
 */

import { defaultLocale, type TLocale } from '@/core/i18n'

/**
 * Pre-configured date formatters for each locale.
 * Uses Intl.DateTimeFormat for optimal performance (formatter caching).
 */
const dateFormatters: Record<TLocale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat('en', { dateStyle: 'long' }),
  es: new Intl.DateTimeFormat('es', { dateStyle: 'long' }),
}

/**
 * Normalizes a date input to a Date object.
 */
function toDate(date: Date | string | number): Date {
  return typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
}

/**
 * Formats a date using the specified locale and options.
 *
 * Uses native Intl.DateTimeFormat for zero-dependency date formatting.
 *
 * @param date - The date to format (Date object, ISO string, or timestamp)
 * @param locale - The locale to use for formatting, defaults to i18n defaultLocale
 * @param options - Intl.DateTimeFormatOptions for custom formatting
 * @returns The formatted date string
 *
 * @example
 * // Default formatting (long date style)
 * formatDate(new Date()) // 'February 22, 2026' (en) / '22 de febrero de 2026' (es)
 *
 * @example
 * // Custom format options
 * formatDate(new Date(), 'es', { day: '2-digit', month: '2-digit', year: 'numeric' })
 * // '22/02/2026'
 *
 * @example
 * // Short format
 * formatDate(new Date(), 'en', { dateStyle: 'short' }) // '2/22/26'
 */
export function formatDate(
  date: Date | string | number,
  locale: TLocale = defaultLocale,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = toDate(date)

  if (options) {
    return new Intl.DateTimeFormat(locale, options).format(dateObj)
  }

  return dateFormatters[locale].format(dateObj)
}
