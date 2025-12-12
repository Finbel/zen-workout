import { HTMLAttributes, forwardRef, type Ref } from 'react'
import { css } from '@emotion/react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { responsiveStyles } from '../../utils/responsiveStyles'
import './Heading.css'

export type HeadingSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

/**
 * Convert HeadingSize value to CSS font-size token
 */
function sizeToCSS(size: HeadingSize): string {
  const mapping: Record<HeadingSize, string> = {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    base: 'var(--font-size-base)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
    '2xl': 'var(--font-size-2xl)',
    '3xl': 'var(--font-size-3xl)',
    '4xl': 'var(--font-size-4xl)',
  }
  return mapping[size]
}

/**
 * Get class name for a size prop if it's a simple (non-responsive) value
 */
function getSizeClassName(
  value: Responsive<HeadingSize> | undefined,
  defaultValue: HeadingSize,
): string | false {
  if (!value) return `zen-heading--${defaultValue}`
  if (isResponsiveObject(value)) return false
  return `zen-heading--${value}`
}

/**
 * Get class name for level
 */
function getLevelClassName(level: HeadingLevel): string {
  return `zen-heading--level-${level}`
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Font size that adapts to screen size */
  size?: Responsive<HeadingSize>
  /** Heading level (1-6) */
  level?: HeadingLevel
  /** Text alignment that adapts to screen size */
  textAlign?: Responsive<TextAlign>
}

const HeadingComponent = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      size = '2xl',
      level = 1,
      textAlign,
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
      'zen-heading',
      getLevelClassName(level),
      getSizeClassName(size, '2xl'),
      className,
    ]
      .filter(Boolean)
      .join(' ')

    // Generate Emotion styles for responsive size
    const fontSizeStyles = responsiveStyles('fontSize', size, sizeToCSS)

    // Generate Emotion styles for responsive textAlign
    const textAlignStyles = responsiveStyles(
      'textAlign',
      textAlign,
      (val) => val,
    )

    // Combine all Emotion styles
    const emotionStyles = css`
      ${fontSizeStyles}
      ${textAlignStyles}
    `

    const commonProps = {
      className: classNames,
      css: emotionStyles,
      style,
      ...props,
    }

    // Render the appropriate heading element based on level
    switch (level) {
      case 1:
        return (
          <h1 ref={ref as Ref<HTMLHeadingElement>} {...commonProps}>
            {children}
          </h1>
        )
      case 2:
        return (
          <h2 ref={ref as Ref<HTMLHeadingElement>} {...commonProps}>
            {children}
          </h2>
        )
      case 3:
        return (
          <h3 ref={ref as Ref<HTMLHeadingElement>} {...commonProps}>
            {children}
          </h3>
        )
      case 4:
        return (
          <h4 ref={ref as Ref<HTMLHeadingElement>} {...commonProps}>
            {children}
          </h4>
        )
      case 5:
        return (
          <h5 ref={ref as Ref<HTMLHeadingElement>} {...commonProps}>
            {children}
          </h5>
        )
      case 6:
        return (
          <h6 ref={ref as Ref<HTMLHeadingElement>} {...commonProps}>
            {children}
          </h6>
        )
      default:
        return (
          <h1 ref={ref as Ref<HTMLHeadingElement>} {...commonProps}>
            {children}
          </h1>
        )
    }
  },
)

HeadingComponent.displayName = 'Heading'

export const Heading = HeadingComponent
