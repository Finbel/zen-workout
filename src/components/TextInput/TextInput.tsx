import { InputHTMLAttributes, forwardRef } from 'react'
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

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** The type of input */
  type?: TextInputType
  /** The size of the input */
  size?: TextInputSize
  /** Whether the input is in an error state */
  error?: boolean
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      type = 'text',
      size = 'md',
      error = false,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    const wrapperClassNames = [
      'zen-text-input-wrapper',
      `zen-text-input-wrapper--${size}`,
      error && 'zen-text-input-wrapper--error',
    ]
      .filter(Boolean)
      .join(' ')

    const inputClassNames = [
      'zen-text-input',
      `zen-text-input--${size}`,
      error && 'zen-text-input--error',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={wrapperClassNames}>
        <input
          ref={ref}
          type={type}
          className={inputClassNames}
          disabled={disabled}
          {...props}
        />
      </div>
    )
  },
)

TextInput.displayName = 'TextInput'
