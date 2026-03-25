/**
 * Date formatting utilities using native Intl API.
 *
 * Provides locale-aware date formatting using the centralized i18n configuration.
 * All functions handle multiple date input types (Date, string, number).
 *
 * @module utils/date
 * @see {@link ../../i18n/i18n.config.ts} for locale configuration
 */

export { formatDate } from './format-date.utils'
export { formatRelativeDate } from './format-relative-date.utils'
