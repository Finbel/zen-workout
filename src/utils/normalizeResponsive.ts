/**
 * Utility for creating responsive normalization functions
 */

import type { Responsive, ResponsiveObject } from './Responsive'
import { isResponsiveObject } from './Responsive'
import { breakpointOrder } from '../tokens/breakpoints'

/**
 * Creates a normalization function for responsive props
 *
 * @param toCSS - Function that converts a single value to its CSS representation
 * @returns A function that normalizes responsive values (single value or responsive object) to CSS values
 *
 * @example
 * ```ts
 * const normalizeResponsiveGap = createNormalizeResponsive((gap: GridGap) => {
 *   const mapping: Record<GridGap, string> = {
 *     none: '0',
 *     sm: 'var(--grid-gap-sm)',
 *     md: 'var(--grid-gap-md)',
 *   }
 *   return mapping[gap]
 * })
 * ```
 */
export function createNormalizeResponsive<T>(
  toCSS: (value: T) => string,
): (value: Responsive<T> | undefined) => Responsive<string> | undefined {
  return (value: Responsive<T> | undefined): Responsive<string> | undefined => {
    if (value === undefined) return undefined

    if (isResponsiveObject(value)) {
      const normalized: ResponsiveObject<string> = {}
      for (const breakpoint of breakpointOrder) {
        if (value[breakpoint] !== undefined) {
          normalized[breakpoint] = toCSS(value[breakpoint])
        }
      }
      return normalized
    }

    return toCSS(value)
  }
}

