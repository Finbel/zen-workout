import { ButtonHTMLAttributes, forwardRef } from 'react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { processResponsiveProps } from '../../utils/responsiveProps'
import { generateResponsiveDataAttributes } from '../../utils/responsiveDataAttributes'
import { Icon, IconName } from '../Icon'
import './Button.scss'

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
  variant?: Responsive<ButtonVariant>
  /** The size of the button */
  size?: Responsive<ButtonSize>
  /** Optional icon to display in the button */
  icon?: ButtonIcon
}

const ICON_SIZE_MAP: Record<ButtonSize, number> = {
  sm: 16,
  md: 18,
  lg: 20,
}

/**
 * Get the base value from a responsive prop for use in calculations
 */
function getBaseValue<T>(value: Responsive<T> | undefined, defaultValue: T): T {
  if (!value) return defaultValue
  if (isResponsiveObject(value)) {
    return value.base !== undefined ? value.base : defaultValue
  }
  return value
}

/**
 * Get class name for variant if it's a simple (non-responsive) value
 */
function getVariantClassName(
  value: Responsive<ButtonVariant> | undefined,
  defaultValue: ButtonVariant,
): string | false {
  if (!value) return `zen-button--${defaultValue}`
  if (isResponsiveObject(value)) return false
  return `zen-button--${value}`
}

/**
 * Get class name for size if it's a simple (non-responsive) value
 */
function getSizeClassName(
  value: Responsive<ButtonSize> | undefined,
  defaultValue: ButtonSize,
): string | false {
  if (!value) return `zen-button--${defaultValue}`
  if (isResponsiveObject(value)) return false
  return `zen-button--${value}`
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      className = '',
      disabled,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    // Process responsive props to CSS custom properties
    const responsiveStyles = processResponsiveProps('button', {
      variant,
      size,
    })

    // Get base values for icon size calculation
    const baseSize = getBaseValue(size, 'md')

    // Build class names for non-responsive usage (backward compatibility)
    // Only add classes if the value is a simple (non-responsive) value
    const classNames = [
      'zen-button',
      getVariantClassName(variant, 'primary'),
      getSizeClassName(size, 'md'),
      className,
    ]
      .filter(Boolean)
      .join(' ')

    // Generate data attributes for responsive props
    const dataAttributes = generateResponsiveDataAttributes(
      {
        variant,
        size,
      },
      { includeBreakpointValues: true },
    )

    // Use base size for icon size (icons use base breakpoint size)
    const iconSize = ICON_SIZE_MAP[baseSize]

    return (
      <button
        ref={ref}
        className={classNames}
        style={{ ...responsiveStyles, ...style }}
        disabled={disabled}
        {...dataAttributes}
        {...props}
      >
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
