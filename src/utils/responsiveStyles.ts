/**
 * Utility for generating Emotion CSS from responsive prop values
 * Converts responsive objects to CSS with media queries at runtime
 */

import { css, SerializedStyles } from '@emotion/react'
import type { Responsive, ResponsiveObject } from './Responsive'
import { isResponsiveObject } from './Responsive'
import { breakpoints, breakpointOrder } from '../tokens/breakpoints'

/**
 * Converts a responsive prop value to Emotion CSS with media queries
 *
 * @param propName - CSS property name (e.g., 'padding', 'background-color')
 * @param value - Responsive value (simple value or responsive object)
 * @param toCSS - Function that converts a value to its CSS string representation
 * @returns Emotion SerializedStyles or undefined if value is undefined
 *
 * @example
 * ```ts
 * const styles = responsiveStyles('padding', { base: 5, md: 10 }, (val) => `${val}px`)
 * // Generates CSS with:
 * // padding: 5px;
 * // @media (min-width: 1024px) { padding: 10px; }
 * ```
 */
export function responsiveStyles<T>(
  propName: string,
  value: Responsive<T> | undefined,
  toCSS: (val: T) => string,
): SerializedStyles | undefined {
  if (value === undefined) {
    return undefined
  }

  // Handle simple (non-responsive) values
  if (!isResponsiveObject(value)) {
    return css({
      [propName]: toCSS(value),
    })
  }

  // Handle responsive objects
  const responsiveObj = value as ResponsiveObject<T>

  // Find the base value (or first defined breakpoint if base is missing)
  let baseValue: T | undefined = responsiveObj.base

  // If no base, find the first defined breakpoint value
  if (baseValue === undefined) {
    for (const bp of breakpointOrder) {
      if (responsiveObj[bp] !== undefined) {
        baseValue = responsiveObj[bp]
        break
      }
    }
  }

  // If still no value, return undefined
  if (baseValue === undefined) {
    return undefined
  }

  // Build CSS object with base value and media queries
  // Emotion supports media queries using '@media (min-width: ...)' as object keys
  const cssObject: Record<string, any> = {
    [propName]: toCSS(baseValue),
  }

  // Add media queries for each breakpoint (excluding base)
  const mediaBreakpoints: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'sm', 'md', 'lg']

  for (const bp of mediaBreakpoints) {
    if (responsiveObj[bp] !== undefined) {
      const minWidth = breakpoints[bp]
      cssObject[`@media (min-width: ${minWidth}px)`] = {
        [propName]: toCSS(responsiveObj[bp]!),
      }
    }
  }

  return css(cssObject)
}

