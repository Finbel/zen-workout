import { forwardRef } from 'react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { processResponsiveProps } from '../../utils/responsiveProps'
import { createNormalizeResponsive } from '../../utils/normalizeResponsive'
import { generateResponsiveDataAttributes } from '../../utils/responsiveDataAttributes'
import { BoxProps } from '../Box'
import '../Box/Box.scss'
import './Flex.scss'

export type FlexGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type FlexDirection = 'row' | 'column'
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch'
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around'

/**
 * Convert FlexGap value to CSS spacing token
 */
function gapToCSS(gap: FlexGap): string {
  const mapping: Record<FlexGap, string> = {
    none: '0',
    xs: 'var(--space-1)',
    sm: 'var(--space-2)',
    md: 'var(--space-4)',
    lg: 'var(--space-6)',
    xl: 'var(--space-8)',
  }
  return mapping[gap]
}

/**
 * Normalize responsive gap value to CSS value
 */
const normalizeResponsiveGap = createNormalizeResponsive(gapToCSS)

/**
 * Convert FlexDirection value to CSS value
 */
function directionToCSS(direction: FlexDirection): string {
  return direction === 'row' ? 'row' : 'column'
}

/**
 * Normalize responsive direction value to CSS value
 */
const normalizeResponsiveDirection = createNormalizeResponsive(directionToCSS)

/**
 * Convert FlexAlign value to CSS value
 */
function alignToCSS(align: FlexAlign): string {
  const mapping: Record<FlexAlign, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  }
  return mapping[align]
}

/**
 * Normalize responsive align value to CSS value
 */
const normalizeResponsiveAlign = createNormalizeResponsive(alignToCSS)

/**
 * Convert FlexJustify value to CSS value
 */
function justifyToCSS(justify: FlexJustify): string {
  const mapping: Record<FlexJustify, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
  }
  return mapping[justify]
}

/**
 * Normalize responsive justify value to CSS value
 */
const normalizeResponsiveJustify = createNormalizeResponsive(justifyToCSS)

/**
 * Convert boolean wrap value to CSS value
 */
function wrapToCSS(wrap: boolean): string {
  return wrap ? 'wrap' : 'nowrap'
}

/**
 * Normalize responsive wrap value to CSS value
 */
const normalizeResponsiveWrap = createNormalizeResponsive(wrapToCSS)

/**
 * Get class name for a prop if it's a simple (non-responsive) value
 */
function getClassName<T>(
  value: Responsive<T> | undefined,
  prefix: string,
  formatter?: (val: T) => string,
): string | false {
  if (!value) return false
  if (isResponsiveObject(value)) return false
  const formatted = formatter ? formatter(value as T) : String(value)
  return `zen-flex--${prefix}-${formatted}`
}

/**
 * Flex component props
 * Extends BoxProps to inherit padding functionality from Box component
 */
export interface FlexProps extends BoxProps {
  /** Gap between flex items */
  gap?: Responsive<FlexGap>
  /** Whether items should wrap to new lines */
  wrap?: Responsive<boolean>
  /** Flex direction */
  direction?: Responsive<FlexDirection>
  /** Align items on the cross axis */
  align?: Responsive<FlexAlign>
  /** Justify content on the main axis */
  justify?: Responsive<FlexJustify>
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      gap = 'md',
      wrap = true,
      direction = 'row',
      align,
      justify,
      padding,
      paddingHorizontal,
      paddingVertical,
      className = '',
      style,
      children,
      ...props
    },
    ref,
  ) => {
    // Process responsive props to CSS custom properties
    const responsiveStyles = processResponsiveProps('flex', {
      gap: normalizeResponsiveGap(gap),
      direction: normalizeResponsiveDirection(direction),
      align: normalizeResponsiveAlign(align),
      justify: normalizeResponsiveJustify(justify),
      wrap: normalizeResponsiveWrap(wrap),
    })

    // Build class names for non-responsive usage (backward compatibility)
    // Only add classes if the value is a simple (non-responsive) value
    const classNames = [
      'zen-flex',
      getClassName(gap, 'gap'),
      direction && !isResponsiveObject(direction) && `zen-flex--${direction}`,
      !isResponsiveObject(wrap) && wrap && 'zen-flex--wrap',
      getClassName(align, 'align'),
      getClassName(justify, 'justify'),
      // Box padding classes (handled by Box component)
      className,
    ]
      .filter(Boolean)
      .join(' ')

    // Generate data attributes for responsive props
    const dataAttributes = generateResponsiveDataAttributes({
      gap,
      direction,
      align,
      justify,
      wrap,
    })

    return (
      <div
        ref={ref}
        className={classNames}
        style={{ ...responsiveStyles, ...style }}
        {...dataAttributes}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Flex.displayName = 'Flex'
