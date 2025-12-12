import { forwardRef, HTMLAttributes, ElementType } from 'react'
import { Flex } from '../Flex'
import { Icon, IconName } from '../Icon'
import type { Responsive } from '../../utils/Responsive'
import './Logo.css'

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  /** Icon name to display */
  icon: IconName
  /** Logo text label */
  text: string
  /** Size of the icon (responsive) */
  iconSize?: Responsive<number | string>
  /** Optional route/path (for use with routing libraries like React Router) */
  to?: string
  /** Optional href (for use with routing libraries like Next.js or plain anchor tags) */
  href?: string
  /**
   * Component to render as. When provided, the component will render as this element/component
   * instead of a div or anchor. Useful for routing libraries.
   * @example
   * import { Link } from 'react-router-dom'
   * <Logo as={Link} to="/home" icon="check" text="Zen Design" />
   */
  as?: ElementType
}

/**
 * Logo component that displays an icon and text together.
 * Supports polymorphic rendering via the `as` prop for routing-library agnostic usage.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Logo icon="check" text="Zen Design" />
 *
 * // With custom icon size
 * <Logo icon="check" text="Zen Design" iconSize={32} />
 *
 * // As a link (backward compatible)
 * <Logo icon="check" text="Zen Design" href="/" />
 *
 * // With routing library
 * import { Link } from 'react-router-dom'
 * <Logo as={Link} to="/home" icon="check" text="Zen Design" />
 *
 * // With responsive icon size
 * <Logo icon="check" text="Zen Design" iconSize={{ base: 20, md: 28 }} />
 * ```
 */
const LogoInner = (
  {
    icon,
    text,
    iconSize = 24,
    as,
    to,
    href,
    className = '',
    style,
    ...props
  }: LogoProps,
  ref: React.ForwardedRef<HTMLDivElement | HTMLAnchorElement>,
) => {
  const classNames = ['zen-logo', className].filter(Boolean).join(' ')

  const logoContent = (
    <>
      <Icon name={icon} size={iconSize} />
      <span className="zen-logo__text">{text}</span>
    </>
  )

  // If `as` prop is provided, render as that component
  if (as) {
    const Component = as

    // Build props for the `as` component
    const finalProps: any = {
      ...props,
      className: classNames,
      style,
    }

    // Handle routing props - pass `to` or `href` based on what's provided
    if (to !== undefined) {
      finalProps.to = to
    }
    if (href !== undefined) {
      finalProps.href = href
    }

    // Forward ref if the component supports it
    if (ref) {
      finalProps.ref = ref
    }

    return (
      <Component {...finalProps}>
        <Flex align="center" gap="sm">
          {logoContent}
        </Flex>
      </Component>
    )
  }

  // Backward compatibility: if href is provided (and no `as`), render as anchor
  if (href) {
    return (
      <a
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        href={href}
        className={classNames}
        style={style}
        {...(props as HTMLAttributes<HTMLAnchorElement>)}
      >
        <Flex align="center" gap="sm">
          {logoContent}
        </Flex>
      </a>
    )
  }

  // Default: render as div
  return (
    <div
      ref={ref as React.ForwardedRef<HTMLDivElement>}
      className={classNames}
      style={style}
      {...props}
    >
      <Flex align="center" gap="sm">
        {logoContent}
      </Flex>
    </div>
  )
}

export const Logo = forwardRef<HTMLDivElement | HTMLAnchorElement, LogoProps>(
  LogoInner,
)

Logo.displayName = 'Logo'
