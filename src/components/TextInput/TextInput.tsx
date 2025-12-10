import { InputHTMLAttributes, forwardRef } from 'react'
import { css } from '@emotion/react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { responsiveStyles } from '../../utils/responsiveStyles'
import './TextInput.css'

export type TextInputType =
  | 'text'
  | 'password'
  | 'email'
  | 'search'
  | 'url'
  | 'tel'
  | 'number'
export type TextInputSize = 'sm' | 'md' | 'lg'

/**
 * Size to CSS value mappings
 */
const SIZE_STYLES: Record<
  TextInputSize,
  { height: string; paddingY: string; fontSize: string }
> = {
  sm: {
    height: '2rem',
    paddingY: 'var(--space-1)',
    fontSize: 'var(--font-size-sm)',
  },
  md: {
    height: '2.5rem',
    paddingY: 'var(--space-2)',
    fontSize: 'var(--font-size-base)',
  },
  lg: {
    height: '3rem',
    paddingY: 'var(--space-3)',
    fontSize: 'var(--font-size-lg)',
  },
}

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** The type of input */
  type?: TextInputType
  /** The size of the input */
  size?: Responsive<TextInputSize>
  /** Whether the input is in an error state */
  error?: boolean
}

/**
 * Get class name for size if it's a simple (non-responsive) value
 */
function getSizeClassName(
  value: Responsive<TextInputSize> | undefined,
  defaultValue: TextInputSize,
): string | false {
  if (!value) return `zen-text-input--${defaultValue}`
  if (isResponsiveObject(value)) return false
  return `zen-text-input--${value}`
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      type = 'text',
      size = 'md',
      error = false,
      className = '',
      disabled,
      style,
      ...props
    },
    ref,
  ) => {
    // Build class names for non-responsive usage (backward compatibility)
    // Only add classes if the value is a simple (non-responsive) value
    const inputClassNames = [
      'zen-text-input',
      getSizeClassName(size, 'md'),
      error && 'zen-text-input--error',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const wrapperClassNames = [
      'zen-text-input-wrapper',
      error && 'zen-text-input-wrapper--error',
    ]
      .filter(Boolean)
      .join(' ')

    // Generate Emotion styles for responsive size
    const sizeHeightStyles = responsiveStyles(
      'height',
      size,
      (s) => SIZE_STYLES[s].height,
    )
    const sizePaddingTopStyles = responsiveStyles(
      'paddingTop',
      size,
      (s) => SIZE_STYLES[s].paddingY,
    )
    const sizePaddingBottomStyles = responsiveStyles(
      'paddingBottom',
      size,
      (s) => SIZE_STYLES[s].paddingY,
    )
    const sizeFontSizeStyles = responsiveStyles(
      'fontSize',
      size,
      (s) => SIZE_STYLES[s].fontSize,
    )

    // Combine all Emotion styles
    const emotionStyles = css`
      ${sizeHeightStyles}
      ${sizePaddingTopStyles}
      ${sizePaddingBottomStyles}
      ${sizeFontSizeStyles}
    `

    return (
      <div className={wrapperClassNames}>
        <input
          ref={ref}
          type={type}
          className={inputClassNames}
          css={emotionStyles}
          style={style}
          disabled={disabled}
          aria-invalid={error}
          {...props}
        />
      </div>
    )
  },
)

TextInput.displayName = 'TextInput'
