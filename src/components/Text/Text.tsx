import { HTMLAttributes, forwardRef } from 'react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { processResponsiveProps } from '../../utils/responsiveProps'
import { createNormalizeResponsive } from '../../utils/normalizeResponsive'
import { generateResponsiveDataAttributes } from '../../utils/responsiveDataAttributes'
import './Text.scss'

export type TextSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'

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
 * Normalize responsive size value to CSS value
 */
const normalizeResponsiveSize = createNormalizeResponsive(sizeToCSS)

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
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ size = 'base', className = '', style, children, ...props }, ref) => {
    // Process responsive props to CSS custom properties
    const responsiveStyles = processResponsiveProps('text', {
      size: normalizeResponsiveSize(size),
    })

    // Build class names for non-responsive usage (backward compatibility)
    // Only add classes if the value is a simple (non-responsive) value
    const classNames = ['zen-text', getSizeClassName(size, 'base'), className]
      .filter(Boolean)
      .join(' ')

    // Generate data attributes to indicate which responsive props are used
    // This allows CSS to conditionally apply styles only when needed
    const dataAttributes = generateResponsiveDataAttributes({
      size,
    })

    return (
      <p
        ref={ref}
        className={classNames}
        style={{ ...responsiveStyles, ...style }}
        {...dataAttributes}
        {...props}
      >
        {children}
      </p>
    )
  },
)

Text.displayName = 'Text'
