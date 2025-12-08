/**
 * Utility for generating data attributes for responsive props
 */

import type { Responsive } from './Responsive'
import { isResponsiveObject } from './Responsive'
import { breakpointOrder } from '../tokens/breakpoints'

/**
 * Options for generating responsive data attributes
 */
export interface ResponsiveDataAttributesOptions {
  /**
   * Whether to include breakpoint-specific data attributes with their values
   * (e.g., `data-gap-base="sm"`, `data-gap-md="md"`)
   * Default: false
   */
  includeBreakpointValues?: boolean
  /**
   * Custom prop name to use in data attribute (defaults to the key from props object)
   */
  propName?: string
}

/**
 * Generate data attributes for responsive props
 *
 * @param props - Object containing responsive prop values
 * @param options - Options for generating data attributes
 * @returns Object with data attribute keys and values
 *
 * @example
 * ```ts
 * const dataAttributes = generateResponsiveDataAttributes({
 *   gap: { base: 'sm', md: 'md' },
 *   columns: 3,
 * }, { includeBreakpointValues: true })
 * // Returns:
 * // {
 * //   'data-has-responsive-gap': 'true',
 * //   'data-gap-base': 'sm',
 * //   'data-gap-md': 'md'
 * // }
 * ```
 */
export function generateResponsiveDataAttributes(
  props: Record<string, Responsive<any> | undefined>,
  options: ResponsiveDataAttributesOptions = {},
): Record<string, string> {
  const { includeBreakpointValues = false } = options
  const dataAttributes: Record<string, string> = {}

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue

    const propName = options.propName || key

    if (isResponsiveObject(value)) {
      // Add the main data attribute indicating this prop is responsive
      dataAttributes[`data-has-responsive-${propName}`] = 'true'

      // Optionally add breakpoint-specific data attributes with values
      if (includeBreakpointValues) {
        for (const breakpoint of breakpointOrder) {
          if (value[breakpoint] !== undefined) {
            const breakpointValue = value[breakpoint]
            // Only include if value is not false (for boolean props like shoji)
            if (breakpointValue !== false && breakpointValue !== undefined) {
              dataAttributes[`data-${propName}-${breakpoint}`] =
                String(breakpointValue)
            } else if (breakpointValue === true) {
              // For boolean true values, just set the attribute to 'true'
              dataAttributes[`data-${propName}-${breakpoint}`] = 'true'
            }
          }
        }
      }
    }
  }

  return dataAttributes
}
