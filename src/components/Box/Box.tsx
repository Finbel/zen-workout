import { HTMLAttributes, forwardRef } from 'react'
import type { Responsive, ResponsiveObject } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { processResponsiveProps } from '../../utils/responsiveProps'
import './Box.css'

export type BoxPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Convert BoxPadding value to CSS spacing token
 */
function paddingToCSS(padding: BoxPadding): string {
  const mapping: Record<BoxPadding, string> = {
    none: '0',
    xs: 'var(--space-1)',
    sm: 'var(--space-2)',
    md: 'var(--space-4)',
    lg: 'var(--space-6)',
    xl: 'var(--space-8)',
  }
  return mapping[padding]
}

/**
 * Convert responsive padding value to CSS value
 */
function normalizeResponsivePadding(
  value: Responsive<BoxPadding> | undefined,
): Responsive<string> | undefined {
  if (value === undefined) return undefined

  if (isResponsiveObject(value)) {
    const normalized: ResponsiveObject<string> = {}
    if (value.base !== undefined) normalized.base = paddingToCSS(value.base)
    if (value.xs !== undefined) normalized.xs = paddingToCSS(value.xs)
    if (value.sm !== undefined) normalized.sm = paddingToCSS(value.sm)
    if (value.md !== undefined) normalized.md = paddingToCSS(value.md)
    if (value.lg !== undefined) normalized.lg = paddingToCSS(value.lg)
    return normalized
  }

  return paddingToCSS(value)
}

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

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  /** Padding on all sides */
  padding?: Responsive<BoxPadding>
  /** Horizontal padding (left and right) */
  paddingHorizontal?: Responsive<BoxPadding>
  /** Vertical padding (top and bottom) */
  paddingVertical?: Responsive<BoxPadding>
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
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
    const responsiveStyles = processResponsiveProps('box', {
      padding: normalizeResponsivePadding(padding),
      paddingHorizontal: normalizeResponsivePadding(paddingHorizontal),
      paddingVertical: normalizeResponsivePadding(paddingVertical),
    })

    // Build class names for non-responsive usage (backward compatibility)
    // Only add classes if the value is a simple (non-responsive) value
    const classNames = [
      'zen-box',
      getPaddingClassName(padding, 'p'),
      getPaddingClassName(paddingHorizontal, 'px'),
      getPaddingClassName(paddingVertical, 'py'),
      className,
    ]
      .filter(Boolean)
      .join(' ')

    // Add data attributes to indicate which responsive props are used
    // This allows CSS to conditionally apply styles only when needed
    const dataAttributes: Record<string, string> = {}
    if (padding && isResponsiveObject(padding)) {
      dataAttributes['data-has-responsive-padding'] = 'true'
    }
    if (paddingHorizontal && isResponsiveObject(paddingHorizontal)) {
      dataAttributes['data-has-responsive-padding-horizontal'] = 'true'
    }
    if (paddingVertical && isResponsiveObject(paddingVertical)) {
      dataAttributes['data-has-responsive-padding-vertical'] = 'true'
    }

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

Box.displayName = 'Box'
