import { ButtonHTMLAttributes, forwardRef } from 'react'
import { css } from '@emotion/react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { responsiveStyles } from '../../utils/responsiveStyles'
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
 * Size to CSS value mappings
 */
const SIZE_STYLES: Record<
  ButtonSize,
  { height: string; paddingX: string; fontSize: string }
> = {
  sm: {
    height: '2rem',
    paddingX: 'var(--space-3)',
    fontSize: 'var(--font-size-sm)',
  },
  md: {
    height: '2.5rem',
    paddingX: 'var(--space-4)',
    fontSize: 'var(--font-size-base)',
  },
  lg: {
    height: '3rem',
    paddingX: 'var(--space-6)',
    fontSize: 'var(--font-size-lg)',
  },
}

/**
 * Variant to CSS value mappings
 */
const VARIANT_STYLES: Record<
  ButtonVariant,
  { backgroundColor: string; color: string; border?: string }
> = {
  primary: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-text-inverse)',
  },
  secondary: {
    backgroundColor: 'var(--color-surface-elevated)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-primary)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-text-primary)',
  },
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

    // Generate Emotion styles for responsive size
    const sizeHeightStyles = responsiveStyles(
      'height',
      size,
      (s) => SIZE_STYLES[s].height,
    )
    const sizePaddingLeftStyles = responsiveStyles(
      'paddingLeft',
      size,
      (s) => SIZE_STYLES[s].paddingX,
    )
    const sizePaddingRightStyles = responsiveStyles(
      'paddingRight',
      size,
      (s) => SIZE_STYLES[s].paddingX,
    )
    const sizeFontSizeStyles = responsiveStyles(
      'fontSize',
      size,
      (s) => SIZE_STYLES[s].fontSize,
    )

    // Generate Emotion styles for responsive variant
    const variantBackgroundColorStyles = responsiveStyles(
      'backgroundColor',
      variant,
      (v) => VARIANT_STYLES[v].backgroundColor,
    )
    const variantColorStyles = responsiveStyles(
      'color',
      variant,
      (v) => VARIANT_STYLES[v].color,
    )
    const variantBorderStyles = responsiveStyles(
      'border',
      variant,
      (v) => VARIANT_STYLES[v].border || 'none',
    )

    // Combine all Emotion styles
    const emotionStyles = css`
      ${sizeHeightStyles}
      ${sizePaddingLeftStyles}
      ${sizePaddingRightStyles}
      ${sizeFontSizeStyles}
      ${variantBackgroundColorStyles}
      ${variantColorStyles}
      ${variantBorderStyles}
    `

    // Use base size for icon size (icons use base breakpoint size)
    const iconSize = ICON_SIZE_MAP[baseSize]

    return (
      <button
        ref={ref}
        className={classNames}
        css={emotionStyles}
        style={style}
        disabled={disabled}
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
