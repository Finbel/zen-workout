import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Icon, IconName } from '../Icon'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonIcon {
  /** The name of the icon to display */
  name: IconName
  /** Position of the icon relative to the button text */
  position: 'left' | 'right'
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The visual style variant of the button */
  variant?: ButtonVariant
  /** The size of the button */
  size?: ButtonSize
  /** Optional icon to display in the button */
  icon?: ButtonIcon
}

const ICON_SIZE_MAP: Record<ButtonSize, number> = {
  sm: 16,
  md: 18,
  lg: 20,
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
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

    const iconSize = ICON_SIZE_MAP[size]

    return (
      <button ref={ref} className={classNames} disabled={disabled} {...props}>
        {icon?.position === 'left' && <Icon name={icon.name} size={iconSize} />}
        {children}
        {icon?.position === 'right' && (
          <Icon name={icon.name} size={iconSize} />
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
