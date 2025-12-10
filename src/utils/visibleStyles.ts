/**
 * Utility for generating Emotion CSS for responsive visibility
 * Shared between Box and other components that need visibility control
 */

import { css, SerializedStyles } from '@emotion/react'
import type { Responsive, ResponsiveObject } from './Responsive'
import { isResponsiveObject } from './Responsive'
import { breakpoints } from '../tokens/breakpoints'

/**
 * Generate Emotion styles for responsive visibility
 * Only applies display: none when visible is false, doesn't override when true
 */
export function getVisibleStyles(
  visible: Responsive<boolean> | undefined,
): SerializedStyles | undefined {
  if (visible === undefined) {
    return undefined
  }

  // Handle simple (non-responsive) values
  if (!isResponsiveObject(visible)) {
    if (visible === false) {
      return css({ display: 'none' })
    }
    return undefined
  }

  // Handle responsive objects
  const responsiveObj = visible as ResponsiveObject<boolean>
  const cssObject: Record<string, any> = {}

  // Find base value
  let baseValue: boolean | undefined = responsiveObj.base
  if (baseValue === undefined) {
    for (const bp of ['xs', 'sm', 'md', 'lg'] as const) {
      if (responsiveObj[bp] !== undefined) {
        baseValue = responsiveObj[bp]
        break
      }
    }
  }

  // Only set base if it's false
  if (baseValue === false) {
    cssObject.display = 'none'
  }
  // If base is true, we don't set display (element uses its natural/CSS-defined display)

  // Add media queries for each breakpoint
  // We need to track if we need to "unhide" an element that was hidden at base
  const wasHiddenAtBase = baseValue === false

  for (const bp of ['xs', 'sm', 'md', 'lg'] as const) {
    if (responsiveObj[bp] !== undefined) {
      const value = responsiveObj[bp]
      if (value === false) {
        cssObject[`@media (min-width: ${breakpoints[bp]}px)`] = {
          display: 'none',
        }
      } else if (wasHiddenAtBase) {
        // When transitioning from hidden (base) to visible (breakpoint),
        // we need to explicitly show the element
        // Use 'revert' which will revert to the element's natural display type
        // This should work for buttons (inline-flex), flex containers, etc.
        cssObject[`@media (min-width: ${breakpoints[bp]}px)`] = {
          display: 'revert',
        }
      }
      // If base was true and breakpoint is true, don't set anything (element stays visible)
      // If base was true and breakpoint is false, we set display: none above
    }
  }

  return Object.keys(cssObject).length > 0 ? css(cssObject) : undefined
}

