/**
 * Responsive prop utilities for type-safe responsive design
 */

import type { Breakpoint } from '../tokens/breakpoints'

/**
 * A responsive object with breakpoint-specific values
 */
export type ResponsiveObject<T> = Partial<Record<Breakpoint, T>>

/**
 * A responsive value that can be either:
 * - A single value of type T
 * - An object with breakpoint-specific values
 */
export type Responsive<T> = T | ResponsiveObject<T>

/**
 * Check if a value is a responsive object
 */
export function isResponsiveObject<T>(
  value: Responsive<T>,
): value is ResponsiveObject<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    ('base' in value ||
      'xs' in value ||
      'sm' in value ||
      'md' in value ||
      'lg' in value)
  )
}

/**
 * Keys that should never be made responsive
 */
type NonResponsiveKeys = 'children' | 'ref' | `on${string}`

/**
 * Make all properties in an interface responsive, excluding non-visual props
 */
export type MakeResponsive<P> = {
  [K in keyof P]: K extends NonResponsiveKeys
    ? P[K]
    : P[K] extends Responsive<infer T>
    ? Responsive<T>
    : Responsive<P[K]>
}
