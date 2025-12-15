import { forwardRef, ButtonHTMLAttributes } from 'react'
import { Button } from '../Button'
import { useLayoutContext } from './LayoutContext'

/**
 * Props for LayoutNavItem component
 * Uses router link from Layout context when `to` prop is provided
 */
export interface LayoutNavItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Display name of the navigation item */
  name: string
  /** Optional route/path (for use with routing libraries like React Router) */
  to?: string
  /** Optional href (for use with routing libraries like Next.js) */
  href?: string
}

/**
 * Button styling to apply when using router link
 */
const buttonStyles: React.CSSProperties = {
  height: '3rem',
  paddingLeft: 'var(--space-6)',
  paddingRight: 'var(--space-6)',
  fontSize: 'var(--font-size-lg)',
  backgroundColor: 'transparent',
  color: 'var(--color-text-primary)',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

/**
 * LayoutNavItem component that uses router link from Layout context when `to` prop is provided.
 * Falls back to button behavior if no router link is configured or no `to` prop is provided.
 *
 * @example
 * // As a button (default)
 * <Layout.NavItem name="Home" onClick={handleClick} />
 *
 * @example
 * // With routing (routerLink provided to Layout)
 * <Layout routerLink={Link}>
 *   <Layout.NavItem to="/home" name="Home" />
 * </Layout>
 */
const LayoutNavItemInner = (
  props: LayoutNavItemProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const { name, to, href, className = '', style, onClick, ...restProps } = props

  const { routerLink } = useLayoutContext()

  // If `to` prop is provided and routerLink exists in context, use router link
  if (to && routerLink) {
    const RouterLink = routerLink

    // Extract Button-specific props that shouldn't be passed to the router link
    const { variant, size, icon, visible, ...componentProps } = restProps as any

    // Build props for the router link component
    const finalProps: any = {
      ...componentProps,
      to,
      onClick,
      className:
        `zen-button zen-button--ghost zen-button--lg ${className}`.trim(),
      style: {
        ...buttonStyles,
        ...style,
      },
    }

    return <RouterLink {...finalProps}>{name}</RouterLink>
  }

  // If `href` prop is provided and routerLink exists, use router link with href
  if (href && routerLink) {
    const RouterLink = routerLink

    // Extract Button-specific props that shouldn't be passed to the router link
    const { variant, size, icon, visible, ...componentProps } = restProps as any

    // Build props for the router link component
    const finalProps: any = {
      ...componentProps,
      href,
      onClick,
      className:
        `zen-button zen-button--ghost zen-button--lg ${className}`.trim(),
      style: {
        ...buttonStyles,
        ...style,
      },
    }

    return <RouterLink {...finalProps}>{name}</RouterLink>
  }

  // Default behavior: render as Button
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="lg"
      onClick={onClick}
      className={className}
      style={style}
      {...restProps}
    >
      {name}
    </Button>
  )
}

export const LayoutNavItem = forwardRef<HTMLButtonElement, LayoutNavItemProps>(
  LayoutNavItemInner,
)

LayoutNavItem.displayName = 'Layout.NavItem'
