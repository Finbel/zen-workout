/**
 * Process responsive props into CSS custom properties
 * This is a legacy utility - new components should use responsiveStyles from Emotion
 */

import type { Responsive, ResponsiveObject } from './Responsive'
import { isResponsiveObject } from './Responsive'
import { breakpointOrder } from '../tokens/breakpoints'

/**
 * Process responsive props into CSS custom properties
 * Returns an object with CSS custom property names as keys and CSS values as values
 *
 * @param componentName - Component name in kebab-case (e.g., 'box', 'shoji-grid')
 * @param props - Object with prop names and their normalized responsive values
 * @returns Record of CSS custom property names to CSS values
 */
export function processResponsiveProps<T extends string | number>(
  componentName: string,
  props: Record<string, Responsive<T> | undefined>,
): Record<string, string> {
  const cssProps: Record<string, string> = {}

  for (const [propName, value] of Object.entries(props)) {
    if (value === undefined) continue

    // Convert camelCase prop names to kebab-case for CSS custom properties
    // But keep camelCase in the CSS variable name (as per documentation)
    const cssPropName = propName

    if (isResponsiveObject(value)) {
      // Handle responsive object
      const responsiveObj = value as ResponsiveObject<T>

      // Generate CSS custom properties for each breakpoint
      for (const breakpoint of breakpointOrder) {
        if (responsiveObj[breakpoint] !== undefined) {
          const cssVarName = `--${componentName}-${cssPropName}-${breakpoint}`
          // Convert to string (numbers become strings, strings stay strings)
          cssProps[cssVarName] = String(responsiveObj[breakpoint]!)
        }
      }
    } else {
      // Handle simple value - set as base
      const cssVarName = `--${componentName}-${cssPropName}-base`
      // Convert to string (numbers become strings, strings stay strings)
      cssProps[cssVarName] = String(value)
    }
  }

  return cssProps
}
