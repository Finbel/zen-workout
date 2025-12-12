import { HTMLAttributes, forwardRef } from 'react'
import { css } from '@emotion/react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { getVisibleStyles } from '../../utils/visibleStyles'
import { getPaddingEmotionStyles } from './boxPaddingStyles'
import './Box.css'

export type BoxPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Convert BoxPadding value to CSS spacing token
 */
export function paddingToCSS(padding: BoxPadding): string {
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
 * Get class name for a padding prop if it's a simple (non-responsive) value
 */
export function getPaddingClassName(
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
  paddingBottom?: Responsive<BoxPadding>
  paddingTop?: Responsive<BoxPadding>
  paddingLeft?: Responsive<BoxPadding>
  paddingRight?: Responsive<BoxPadding>
  /** Control visibility at different breakpoints. Uses CSS display: none, does not remove from DOM. */
  visible?: Responsive<boolean>
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      padding,
      paddingHorizontal,
      paddingVertical,
      visible,
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
      'zen-box',
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

    // Generate Emotion styles for responsive visibility
    const visibleStyles = getVisibleStyles(visible)

    // Combine all Emotion styles
    const emotionStyles =
      paddingStyles || visibleStyles
        ? css`
            ${paddingStyles}
            ${visibleStyles}
          `
        : undefined

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

Box.displayName = 'Box'
