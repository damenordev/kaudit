import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines and merges CSS class names using clsx and tailwind-merge.
 *
 * This utility function is essential for conditionally applying Tailwind CSS classes
 * while properly handling class conflicts. It merges classes intelligently so that
 * conflicting Tailwind classes are resolved correctly (last one wins).
 *
 * @param inputs - Variable number of class values (strings, arrays, objects, etc.)
 * @returns A merged string of CSS class names with conflicts resolved
 *
 * @example
 * // Basic usage
 * cn('px-4 py-2', 'bg-blue-500') // 'px-4 py-2 bg-blue-500'
 *
 * @example
 * // Conditional classes with object syntax
 * cn('base-class', { 'active': isActive, 'disabled': isDisabled })
 *
 * @example
 * // Resolving conflicting Tailwind classes
 * cn('p-4', 'p-8') // 'p-8' (conflict resolved, last wins)
 *
 * @example
 * // With arrays and nested values
 * cn(['flex', 'items-center'], condition && 'bg-red-500')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
