import { HTMLAttributes, forwardRef } from 'react'
import { css } from '@emotion/react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { responsiveStyles } from '../../utils/responsiveStyles'
import './Text.css'

export type TextSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
export type TextAlign = 'left' | 'center' | 'right' | 'justify'

/**
 * Convert TextSize value to CSS font-size token
 */
function sizeToCSS(size: TextSize): string {
  const mapping: Record<TextSize, string> = {
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
  value: Responsive<TextSize> | undefined,
  defaultValue: TextSize,
): string | false {
  if (!value) return `zen-text--${defaultValue}`
  if (isResponsiveObject(value)) return false
  return `zen-text--${value}`
}

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Font size that adapts to screen size */
  size?: Responsive<TextSize>
  /** Text alignment that adapts to screen size */
  textAlign?: Responsive<TextAlign>
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  (
    { size = 'base', textAlign, className = '', style, children, ...props },
    ref,
  ) => {
    // Build class names for non-responsive usage (backward compatibility)
    // Only add classes if the value is a simple (non-responsive) value
    const classNames = ['zen-text', getSizeClassName(size, 'base'), className]
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

    return (
      <p
        ref={ref}
        className={classNames}
        css={emotionStyles}
        style={style}
        {...props}
      >
        {children}
      </p>
    )
  },
)

Text.displayName = 'Text'
