import { forwardRef } from 'react'
import { css, SerializedStyles } from '@emotion/react'
import type { Responsive, ResponsiveObject } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { responsiveStyles } from '../../utils/responsiveStyles'
import { BoxProps, BoxPadding } from '../Box'
import { getPaddingEmotionStyles } from '../Box/boxPaddingStyles'
import { breakpoints, breakpointOrder } from '../../tokens/breakpoints'
import { useShojiGridContext } from './ShojiGrid'
import type { ShojiGridGap } from './ShojiGrid'
import '../Box/Box.css'
import './ShojiGrid.css'

/**
 * Get class name for a padding prop if it's a simple (non-responsive) value
 */
function getPaddingClassName(
  value: Responsive<BoxPadding> | undefined,
  prefix: string,
): string | false {
  return value && !isResponsiveObject(value)
    ? `zen-box--${prefix}-${value}`
    : false
}

/**
 * Get the effective boolean value at a breakpoint, cascading from previous breakpoints
 */
function getBooleanAtBreakpoint(
  value: Responsive<boolean> | undefined,
  breakpoint: 'base' | 'xs' | 'sm' | 'md' | 'lg',
): boolean {
  if (value === undefined) {
    return false
  }

  if (!isResponsiveObject(value)) {
    return value === true
  }

  const responsiveObj = value as ResponsiveObject<boolean>
  const breakpointIndex = breakpointOrder.indexOf(breakpoint)

  // Find the most recent defined value (cascading from smaller breakpoints)
  for (let i = breakpointIndex; i >= 0; i--) {
    const bp = breakpointOrder[i]
    if (responsiveObj[bp] !== undefined) {
      return responsiveObj[bp] === true
    }
  }

  return false
}

/**
 * Convert gap value to pixel string
 */
function gapToPixels(gap: ShojiGridGap): string {
  const mapping: Record<ShojiGridGap, string> = {
    none: '0px',
    sm: '1px', // --grid-gap-sm
    md: '3px', // --grid-gap-md
  }
  return mapping[gap]
}

/**
 * Get gap value at a specific breakpoint, cascading from previous breakpoints
 */
function getGapAtBreakpoint(
  gap: Responsive<ShojiGridGap> | undefined,
  breakpoint: 'base' | 'xs' | 'sm' | 'md' | 'lg',
): ShojiGridGap {
  if (gap === undefined) {
    return 'md' // Default gap (matches ShojiGrid default)
  }

  if (!isResponsiveObject(gap)) {
    return gap
  }

  const responsiveObj = gap as ResponsiveObject<ShojiGridGap>
  const breakpointIndex = breakpointOrder.indexOf(breakpoint)

  // Find the most recent defined value (cascading from smaller breakpoints)
  for (let i = breakpointIndex; i >= 0; i--) {
    const bp = breakpointOrder[i]
    if (responsiveObj[bp] !== undefined) {
      return responsiveObj[bp]!
    }
  }

  return 'md' // Default gap
}

/**
 * Generate responsive shadow styles using pseudo-elements
 * Uses ::before for top shadow and ::after for right shadow
 * This approach prevents shadow bleed-through on opposite sides
 * Pseudo-elements are sized to match grid gap and positioned to overlap the gap
 */
function generateShadowStyles(
  shadowRight: Responsive<boolean> | undefined,
  shadowTop: Responsive<boolean> | undefined,
  gap: Responsive<ShojiGridGap> | undefined,
): SerializedStyles | undefined {
  if (shadowRight === undefined && shadowTop === undefined) {
    return undefined
  }

  // Regular (non-inset) shadows for pseudo-elements
  // Positioned at edges to create inset effect - shadows cast inward
  // Top shadow: casts downward (positive Y offset)
  // Right shadow: casts leftward (negative X offset)
  const shadowTopValue = '0 2px 3px rgba(0,0,0,0.5)'
  const shadowRightValue = '-2px 0 3px rgba(0,0,0,0.5)'

  // Get gap value for base (or first defined breakpoint)
  const baseGap = getGapAtBreakpoint(gap, 'base')
  const gapPixels = gapToPixels(baseGap)

  // Handle simple (non-responsive) values
  const isRightResponsive =
    shadowRight !== undefined && isResponsiveObject(shadowRight)
  const isTopResponsive =
    shadowTop !== undefined && isResponsiveObject(shadowTop)
  const isGapResponsive = gap !== undefined && isResponsiveObject(gap)

  if (!isRightResponsive && !isTopResponsive && !isGapResponsive) {
    const hasRight = shadowRight === true
    const hasTop = shadowTop === true

    if (!hasRight && !hasTop) {
      return undefined
    }

    return css({
      position: 'relative',
      // Ensure background color to mask pseudo-element overflow
      backgroundColor: 'var(--shoji-panel)',
      '&::before': hasTop
        ? {
            content: '""',
            position: 'absolute',
            top: `-${gapPixels}`, // Negative top to overlap gap
            left: 0,
            right: 0,
            height: gapPixels, // Same as grid gap
            boxShadow: shadowTopValue,
            pointerEvents: 'none',
            zIndex: 1,
          }
        : {},
      '&::after': hasRight
        ? {
            content: '""',
            position: 'absolute',
            top: 0,
            right: `-${gapPixels}`, // Negative right to overlap gap
            bottom: 0,
            width: gapPixels, // Same as grid gap
            boxShadow: shadowRightValue,
            pointerEvents: 'none',
            zIndex: 1,
          }
        : {},
    })
  }

  // Handle responsive objects - use object syntax (same as simple case)
  // Find base values
  let baseRight: boolean | undefined = undefined
  let baseTop: boolean | undefined = undefined

  if (shadowRight !== undefined && isResponsiveObject(shadowRight)) {
    const rightObj = shadowRight as ResponsiveObject<boolean>
    baseRight = rightObj.base
    if (baseRight === undefined) {
      for (const bp of breakpointOrder) {
        if (rightObj[bp] !== undefined) {
          baseRight = rightObj[bp] === true
          break
        }
      }
    } else {
      baseRight = baseRight === true
    }
  } else if (shadowRight !== undefined) {
    baseRight = shadowRight === true
  }

  if (shadowTop !== undefined && isResponsiveObject(shadowTop)) {
    const topObj = shadowTop as ResponsiveObject<boolean>
    baseTop = topObj.base
    if (baseTop === undefined) {
      for (const bp of breakpointOrder) {
        if (topObj[bp] !== undefined) {
          baseTop = topObj[bp] === true
          break
        }
      }
    } else {
      baseTop = baseTop === true
    }
  } else if (shadowTop !== undefined) {
    baseTop = shadowTop === true
  }

  baseRight = baseRight ?? false
  baseTop = baseTop ?? false

  // Base gap value
  const baseGapPixels = gapToPixels(baseGap)

  // Use object syntax (same as simple case) - this works!
  const cssObject: Record<string, any> = {
    position: 'relative',
    backgroundColor: 'var(--shoji-panel)',
    '&::before': baseTop
      ? {
          content: '""',
          position: 'absolute',
          top: `-${baseGapPixels}`,
          left: 0,
          right: 0,
          height: baseGapPixels,
          boxShadow: shadowTopValue,
          pointerEvents: 'none',
          zIndex: 1,
        }
      : {},
    '&::after': baseRight
      ? {
          content: '""',
          position: 'absolute',
          top: 0,
          right: `-${baseGapPixels}`,
          bottom: 0,
          width: baseGapPixels,
          boxShadow: shadowRightValue,
          pointerEvents: 'none',
          zIndex: 1,
        }
      : {},
  }

  // Add media queries for each breakpoint where values are explicitly defined
  const mediaBreakpoints: Array<'xs' | 'sm' | 'md' | 'lg'> = [
    'xs',
    'sm',
    'md',
    'lg',
  ]

  for (const bp of mediaBreakpoints) {
    const rightObj =
      shadowRight && isResponsiveObject(shadowRight)
        ? (shadowRight as ResponsiveObject<boolean>)
        : null
    const topObj =
      shadowTop && isResponsiveObject(shadowTop)
        ? (shadowTop as ResponsiveObject<boolean>)
        : null
    const gapObj =
      gap && isResponsiveObject(gap)
        ? (gap as ResponsiveObject<ShojiGridGap>)
        : null

    const hasShadowValue =
      (rightObj && rightObj[bp] !== undefined) ||
      (topObj && topObj[bp] !== undefined)
    const hasGapValue = gapObj && gapObj[bp] !== undefined

    if (hasShadowValue || hasGapValue) {
      const hasRight = getBooleanAtBreakpoint(shadowRight, bp)
      const hasTop = getBooleanAtBreakpoint(shadowTop, bp)
      const minWidth = breakpoints[bp]
      const gapAtBreakpoint = getGapAtBreakpoint(gap, bp)
      const gapPixelsAtBreakpoint = gapToPixels(gapAtBreakpoint)

      const mediaQueryKey = `@media (min-width: ${minWidth}px)`

      // Use object syntax for media queries - same structure as simple case
      // This ensures Emotion properly handles nested selectors in media queries
      cssObject[mediaQueryKey] = {
        '&::before': hasTop
          ? {
              content: '""',
              position: 'absolute',
              top: `-${gapPixelsAtBreakpoint}`,
              left: 0,
              right: 0,
              height: gapPixelsAtBreakpoint,
              boxShadow: shadowTopValue,
              pointerEvents: 'none',
              zIndex: 1,
            }
          : {},
        '&::after': hasRight
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              right: `-${gapPixelsAtBreakpoint}`,
              bottom: 0,
              width: gapPixelsAtBreakpoint,
              boxShadow: shadowRightValue,
              pointerEvents: 'none',
              zIndex: 1,
            }
          : {},
      }
    }
  }

  return css(cssObject)
}

export interface ShojiGridCellProps extends BoxProps {
  /** Grid area name (for use with gridTemplateAreas) */
  area?: Responsive<string>
  /** Grid column placement (e.g., "1 / 3" or "span 2") */
  column?: Responsive<string>
  /** Grid row placement (e.g., "1 / 3" or "span 2") */
  row?: Responsive<string>
  /** Apply inset shadow on the right edge to create Shoji wall effect */
  shadowRight?: Responsive<boolean>
  /** Apply inset shadow on the top edge to create Shoji wall effect */
  shadowTop?: Responsive<boolean>
}

export const ShojiGridCell = forwardRef<HTMLDivElement, ShojiGridCellProps>(
  (
    {
      area,
      column,
      row,
      padding,
      paddingHorizontal,
      paddingVertical,
      shadowRight,
      shadowTop,
      className = '',
      style,
      children,
      ...props
    },
    ref,
  ) => {
    // Build class names for non-responsive usage (backward compatibility)
    // Only add classes if the value is a simple (non-responsive) value
    const classNames = [
      'zen-shoji-grid-cell',
      getPaddingClassName(padding, 'p'),
      getPaddingClassName(paddingHorizontal, 'px'),
      getPaddingClassName(paddingVertical, 'py'),
      className,
    ]
      .filter(Boolean)
      .join(' ')

    // Generate Emotion styles for responsive padding using shared utility
    const paddingStyles = getPaddingEmotionStyles(
      padding,
      paddingHorizontal,
      paddingVertical,
    )

    // Helper function to convert string values to CSS (identity function)
    const stringToCSS = (val: string): string => val

    // Generate Emotion styles for responsive grid placement props
    const areaStyles = responsiveStyles('gridArea', area, stringToCSS)
    const columnStyles = responsiveStyles('gridColumn', column, stringToCSS)
    const rowStyles = responsiveStyles('gridRow', row, stringToCSS)

    // Get gap from context
    const gridContext = useShojiGridContext()
    const gap = gridContext?.gap

    // Generate Emotion styles for inset shadows
    const shadowStyles = generateShadowStyles(shadowRight, shadowTop, gap)

    // Combine all Emotion styles
    const emotionStyles = css`
      ${paddingStyles}
      ${areaStyles}
      ${columnStyles}
      ${rowStyles}
      ${shadowStyles}
    `

    return (
      <div
        ref={ref}
        className={classNames}
        css={emotionStyles}
        style={style}
        {...props}
      >
        {children}
      </div>
    )
  },
)

ShojiGridCell.displayName = 'ShojiGrid.Cell'
