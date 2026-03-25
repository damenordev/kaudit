/**
 * Core utility functions for the application.
 *
 * This module re-exports all utility functions from individual utility modules,
 * providing a single entry point for importing common utilities.
 *
 * @module core/utils
 *
 * @example
 * // Import multiple utilities at once
 * import { cn, formatDate, getCookie, stripHtml } from '@/core/utils'
 *
 * @example
 * // Or import from specific modules
 * import { cn } from '@/core/utils/cn.utils'
 * import { formatDate } from '@/core/utils/date'
 *
 * Available utilities:
 * - **cn** - CSS class name merger for Tailwind CSS
 * - **formatDate, formatRelativeDate** - Date formatting with i18n support
 * - **sanitizeHtml, stripHtml, truncateHtml** - HTML processing utilities
 * - **setCookie, getCookie, deleteCookie** - Client-side cookie management
 *
 * @see {@link ../i18n} for locale types and configuration
 */

export * from './cn.utils'
export * from './date'
export * from './html.utils'
export * from './cookies.utils'
