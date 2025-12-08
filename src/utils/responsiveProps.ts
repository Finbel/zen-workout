/**
 * Runtime utilities for processing responsive props into CSS custom properties
 */

import type { CSSProperties } from 'react'
import type { Responsive } from './Responsive'
import { isResponsiveObject } from './Responsive'
import { breakpointOrder } from '../tokens/breakpoints'

/**
 * Convert a responsive prop value to CSS custom properties
 *
 * @param componentName - The component name prefix for CSS custom properties (e.g., 'box', 'flex')
 * @param propName - The prop name (e.g., 'padding', 'gap')
 * @param value - The responsive value (single value or breakpoint object)
 * @returns Object with CSS custom property keys and values
 */
export function processResponsiveProp<T>(
  componentName: string,
  propName: string,
  value: Responsive<T> | undefined,
): Record<string, string> {
  if (value === undefined) {
    return {}
  }

  const cssProps: Record<string, string> = {}
  const cssVarPrefix = `--${componentName}-${propName}`

  // If it's a simple value (not a responsive object), set it as base
  if (!isResponsiveObject(value)) {
    cssProps[`${cssVarPrefix}-base`] = String(value)
    return cssProps
  }

  // Handle responsive object (now properly typed via type predicate)
  if (value.base !== undefined) {
    cssProps[`${cssVarPrefix}-base`] = String(value.base)
  }

  // Set breakpoint-specific values
  for (const breakpoint of breakpointOrder) {
    if (breakpoint === 'base') continue

    if (value[breakpoint] !== undefined) {
      cssProps[`${cssVarPrefix}-${breakpoint}`] = String(value[breakpoint])
    }
  }

  return cssProps
}

/**
 * Process multiple responsive props and return CSS custom properties
 *
 * @param componentName - The component name prefix for CSS custom properties
 * @param props - Object containing responsive prop values
 * @returns React.CSSProperties object with CSS custom properties
 */
export function processResponsiveProps(
  componentName: string,
  props: Record<string, Responsive<any> | undefined>,
): CSSProperties {
  const cssProps: CSSProperties = {}

  for (const [propName, value] of Object.entries(props)) {
    const propCssVars = processResponsiveProp(componentName, propName, value)
    Object.assign(cssProps, propCssVars)
  }

  return cssProps
}


