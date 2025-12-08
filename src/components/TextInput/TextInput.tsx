import { InputHTMLAttributes, forwardRef } from 'react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { processResponsiveProps } from '../../utils/responsiveProps'
import { generateResponsiveDataAttributes } from '../../utils/responsiveDataAttributes'
import './TextInput.scss'

export type TextInputType =
  | 'text'
  | 'password'
  | 'email'
  | 'search'
  | 'url'
  | 'tel'
  | 'number'
export type TextInputSize = 'sm' | 'md' | 'lg'

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
    // Process responsive props to CSS custom properties
    const responsiveStyles = processResponsiveProps('text-input', {
      size,
    })

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

    // Generate data attributes for responsive props
    const dataAttributes = generateResponsiveDataAttributes(
      {
        size,
      },
      { includeBreakpointValues: true },
    )

    return (
      <div className={wrapperClassNames}>
        <input
          ref={ref}
          type={type}
          className={inputClassNames}
          style={{ ...responsiveStyles, ...style }}
          disabled={disabled}
          aria-invalid={error}
          {...dataAttributes}
          {...props}
        />
      </div>
    )
  },
)

TextInput.displayName = 'TextInput'
