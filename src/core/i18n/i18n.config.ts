/**
 * Supported locales for internationalization.
 * Add new locales here to extend language support.
 */
export const locales = ['en', 'es'] as const
export type TLocale = (typeof locales)[number]
export const defaultLocale: TLocale = 'en'

/**
 * Type guard to check if a string is a valid locale.
 * @param locale - The locale string to validate
 * @returns True if the locale is supported
 */
export function isValidLocale(locale: string): locale is TLocale {
  return locales.includes(locale as TLocale)
}
