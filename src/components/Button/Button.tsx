import { ButtonHTMLAttributes, forwardRef } from 'react'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The visual style variant of the button */
  variant?: ButtonVariant
  /** The size of the button */
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className = '',
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const classNames = [
      'zen-button',
      `zen-button--${variant}`,
      `zen-button--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button ref={ref} className={classNames} disabled={disabled} {...props}>
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
