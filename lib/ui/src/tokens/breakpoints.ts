/**
 * Breakpoint definitions for responsive design
 */

export type Breakpoint = 'base' | 'xs' | 'sm' | 'md' | 'lg'

/**
 * Breakpoint pixel values
 * These should match the CSS custom properties defined in tokens.css
 */
export const breakpoints = {
  base: 0,
  xs: 480,
  sm: 640,
  md: 1024,
  lg: 1280,
} as const

/**
 * Breakpoint values in pixels as numbers
 */
export type BreakpointValue = (typeof breakpoints)[Breakpoint]

/**
 * Get breakpoint value in pixels
 */
export function getBreakpointValue(breakpoint: Breakpoint): number {
  return breakpoints[breakpoint]
}

/**
 * Get breakpoint value as CSS media query string
 */
export function getBreakpointMediaQuery(breakpoint: Breakpoint): string {
  if (breakpoint === 'base') {
    return '0px'
  }
  return `${breakpoints[breakpoint]}px`
}

/**
 * Array of breakpoint names in order from smallest to largest
 */
export const breakpointOrder: Breakpoint[] = ['base', 'xs', 'sm', 'md', 'lg']



