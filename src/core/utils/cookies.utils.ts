/**
 * Cookie management utilities for client-side cookie operations.
 *
 * These functions provide a unified API for cookie management that:
 * - Works in browser environments only (SSR-safe)
 * - Uses the modern Cookie Store API when available
 * - Falls back to document.cookie for broader compatibility
 * @module cookies.utils
 */

/**
 * Checks if the modern Cookie Store API is available in the current environment.
 * @returns True if cookieStore is available, false otherwise
 */
const hasCookieStore = () => typeof globalThis.cookieStore !== 'undefined'

/**
 * Sets a cookie with the specified name, value, and expiration.
 *
 * The cookie is set with:
 * - Path: '/' (available site-wide)
 * - SameSite: 'lax' (reasonable security default)
 * - Max-Age: Calculated from the days parameter
 *
 * @param name - The name of the cookie to set
 * @param value - The value to store in the cookie
 * @param days - Number of days until the cookie expires (default: 365)
 *
 * @example
 * // Set a cookie that expires in 7 days
 * setCookie('theme', 'dark', 7)
 *
 * @example
 * // Set a session-like cookie (expires in 1 year by default)
 * setCookie('user-preference', 'enabled')
 */
export const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') return

  const maxAge = days * 24 * 60 * 60

  if (hasCookieStore()) {
    cookieStore.set({ name, value, path: '/', expires: Date.now() + maxAge * 1000, sameSite: 'lax' })
    return
  }

  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; samesite=lax`
}

/**
 * Retrieves the value of a cookie by its name.
 *
 * This function is async because the Cookie Store API returns a Promise.
 * When falling back to document.cookie, the Promise resolves immediately.
 *
 * @param name - The name of the cookie to retrieve
 * @returns A Promise that resolves to the cookie value, or null if not found
 *
 * @example
 * // Get a cookie value
 * const theme = await getCookie('theme')
 * if (theme) {
 *   console.log(`Current theme: ${theme}`)
 * }
 *
 * @example
 * // Check if a cookie exists
 * const hasConsent = await getCookie('consent') !== null
 */
export const getCookie = async (name: string): Promise<string | null> => {
  if (typeof document === 'undefined') return null

  if (hasCookieStore()) {
    const cookie = await cookieStore.get(name)
    return cookie?.value ?? null
  }

  const raw = `; ${document.cookie}`
  const parts = raw.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

/**
 * Deletes a cookie by setting its max-age to 0.
 *
 * This effectively removes the cookie from the browser's storage.
 * The cookie is deleted from the root path '/'.
 *
 * @param name - The name of the cookie to delete
 *
 * @example
 * // Remove user preferences
 * deleteCookie('user-preferences')
 *
 * @example
 * // Clear authentication token on logout
 * deleteCookie('auth-token')
 */
export const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return

  if (hasCookieStore()) {
    cookieStore.delete(name)
    return
  }

  document.cookie = `${name}=; path=/; max-age=0`
}
