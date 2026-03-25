/**
 * HTML manipulation utilities for sanitizing and processing HTML content.
 *
 * These functions provide basic HTML sanitization and text extraction capabilities.
 * @module html.utils
 */

/**
 * Sanitizes HTML content by removing potentially dangerous elements and attributes.
 *
 * Removes:
 * - All `<script>` tags and their contents
 * - Inline event handlers (onclick, onload, onerror, etc.)
 *
 * @param html - The HTML string to sanitize
 * @returns The sanitized HTML string with dangerous elements removed
 *
 * @example
 * // Remove script tags
 * sanitizeHtml('<p>Hello</p><script>alert("xss")</script>')
 * // Returns: '<p>Hello</p>'
 *
 * @example
 * // Remove event handlers
 * sanitizeHtml('<div onclick="malicious()">Click me</div>')
 * // Returns: '<div>Click me</div>'
 *
 * @warning This is a basic sanitization. For production use, consider using
 * a library like DOMPurify for comprehensive XSS protection.
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
}

/**
 * Strips all HTML tags from a string, returning only the text content.
 *
 * @param html - The HTML string to strip
 * @returns Plain text with all HTML tags removed
 *
 * @example
 * stripHtml('<p>Hello <strong>World</strong></p>')
 * // Returns: 'Hello World'
 *
 * @example
 * stripHtml('<div class="card">Content</div>')
 * // Returns: 'Content'
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Truncates HTML content to a specified character length.
 *
 * First strips all HTML tags, then truncates the plain text if it exceeds
 * the maximum length, adding an ellipsis (...) to indicate truncation.
 *
 * @param html - The HTML string to truncate
 * @param maxLength - Maximum number of characters to include
 * @returns Truncated plain text with ellipsis if truncated, or full text if under limit
 *
 * @example
 * // Truncation occurs when content exceeds limit
 * truncateHtml('<p>This is a very long paragraph</p>', 10)
 * // Returns: 'This is a...'
 *
 * @example
 * // No truncation when under limit
 * truncateHtml('<p>Short</p>', 100)
 * // Returns: 'Short'
 */
export function truncateHtml(html: string, maxLength: number): string {
  const stripped = stripHtml(html)
  if (stripped.length <= maxLength) return stripped
  return stripped.slice(0, maxLength).trim() + '...'
}
