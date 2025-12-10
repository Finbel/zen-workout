import { forwardRef } from 'react'
import { css } from '@emotion/react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { responsiveStyles } from '../../utils/responsiveStyles'
import { BoxProps } from '../Box'
import { getPaddingClassName } from '../Box/Box'
import { getPaddingEmotionStyles } from '../Box/boxPaddingStyles'
import { getVisibleStyles } from '../../utils/visibleStyles'
import '../Box/Box.css'
import './Flex.css'

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
 * Convert FlexDirection value to CSS value
 */
function directionToCSS(direction: FlexDirection): string {
  return direction === 'row' ? 'row' : 'column'
}

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
 * Convert boolean wrap value to CSS value
 */
function wrapToCSS(wrap: boolean): string {
  return wrap ? 'wrap' : 'nowrap'
}

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
      'zen-flex',
      getClassName(gap, 'gap'),
      direction && !isResponsiveObject(direction) && `zen-flex--${direction}`,
      !isResponsiveObject(wrap) && wrap && 'zen-flex--wrap',
      getClassName(align, 'align'),
      getClassName(justify, 'justify'),
      // Box padding classes
      getPaddingClassName(padding, 'p'),
      getPaddingClassName(paddingHorizontal, 'px'),
      getPaddingClassName(paddingVertical, 'py'),
      className,
    ]
      .filter(Boolean)
      .join(' ')

    // Generate Emotion styles for Flex's own responsive props
    const gapStyles = responsiveStyles('gap', gap, gapToCSS)
    const directionStyles = responsiveStyles(
      'flexDirection',
      direction,
      directionToCSS,
    )
    const alignStyles = responsiveStyles('alignItems', align, alignToCSS)
    const justifyStyles = responsiveStyles(
      'justifyContent',
      justify,
      justifyToCSS,
    )
    const wrapStyles = responsiveStyles('flexWrap', wrap, wrapToCSS)

    // Get padding styles from shared utility
    const paddingStyles = getPaddingEmotionStyles(
      padding,
      paddingHorizontal,
      paddingVertical,
    )

    // Get visible styles from shared utility
    const visibleStyles = getVisibleStyles(visible)

    // Combine all Emotion styles
    const emotionStyles = css`
      ${gapStyles}
      ${directionStyles}
      ${alignStyles}
      ${justifyStyles}
      ${wrapStyles}
      ${paddingStyles}
      ${visibleStyles}
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

Flex.displayName = 'Flex'
