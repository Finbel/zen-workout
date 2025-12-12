/**
 * Generate data attributes for responsive props
 * This is a legacy utility - new components should use responsiveStyles from Emotion
 */

import type { Responsive } from './Responsive'
import { isResponsiveObject } from './Responsive'
import { breakpointOrder } from '../tokens/breakpoints'

/**
 * Options for generating responsive data attributes
 */
export interface GenerateResponsiveDataAttributesOptions {
  /** Whether to include breakpoint-specific data attributes (e.g., data-size-md="lg") */
  includeBreakpointValues?: boolean
}

/**
 * Convert camelCase to kebab-case for data attributes
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * Generate data attributes for responsive props
 * Returns an object with data attribute names as keys and their values
 *
 * @param props - Object with prop names and their responsive values
 * @param options - Options for generating data attributes
 * @returns Record of data attribute names to values
 */
export function generateResponsiveDataAttributes(
  props: Record<string, Responsive<any> | undefined>,
  options: GenerateResponsiveDataAttributesOptions = {},
): Record<string, string> {
  const dataAttributes: Record<string, string> = {}

  for (const [propName, value] of Object.entries(props)) {
    if (value === undefined) continue

    if (isResponsiveObject(value)) {
      // Convert camelCase prop names to kebab-case for data attributes
      const kebabPropName = camelToKebab(propName)
      dataAttributes[`data-has-responsive-${kebabPropName}`] = 'true'

      // Include breakpoint-specific values if requested
      if (options.includeBreakpointValues) {
        for (const breakpoint of breakpointOrder) {
          if (value[breakpoint] !== undefined) {
            dataAttributes[`data-${kebabPropName}-${breakpoint}`] = String(
              value[breakpoint],
            )
          }
        }
      }
    }
  }

  return dataAttributes
}
