import {
  forwardRef,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
  Children,
  isValidElement,
} from 'react'
import { ShojiGridCell } from '../ShojiGrid/ShojiGridCell'
import { Flex } from '../Flex'
import { Button } from '../Button'
import { Icon, IconName } from '../Icon'
import { BoxProps } from '../Box'
import { useLayoutContext, NavItemData } from './LayoutContext'
import { LayoutNavItem } from './LayoutNavItem'

export interface LayoutNavbarProps extends Omit<BoxProps, 'children'> {
  /** Icon name to display in the navbar */
  icon?: IconName
  /** Title text to display in the navbar */
  title?: string
  /** Route path for the title (when provided, title becomes a clickable link) */
  titleTo?: string
  /** Children can include Layout.NavItem components for desktop navigation */
  children?: ReactNode
  /** Callback when mobile menu button is clicked */
  onMenuToggle?: () => void
  /** Whether the mobile menu is open */
  isMenuOpen?: boolean
}

export const LayoutNavbar = forwardRef<HTMLDivElement, LayoutNavbarProps>(
  (
    {
      icon,
      title,
      titleTo,
      children,
      onMenuToggle,
      isMenuOpen,
      padding = { base: 'sm', md: 'md' },
      className = '',
      ...props
    },
    ref,
  ) => {
    const {
      routerLink,
      registerNavItem,
      unregisterNavItem,
      isMenuOpen: contextIsMenuOpen,
      onMenuToggle: contextOnMenuToggle,
    } = useLayoutContext()
    const internalRef = useRef<HTMLDivElement | null>(null)

    // Use props if provided, otherwise fall back to context
    const effectiveIsMenuOpen = isMenuOpen ?? contextIsMenuOpen ?? false
    const effectiveOnMenuToggle = onMenuToggle ?? contextOnMenuToggle

    // Update CSS variable for navbar height
    const updateNavbarHeight = useCallback(() => {
      const element = internalRef.current
      if (element) {
        const height = element.offsetHeight
        document.documentElement.style.setProperty(
          '--layout-navbar-height',
          `${height}px`,
        )
      }
    }, [])

    // Set CSS variable for navbar height so container can use it in calc()
    useEffect(() => {
      updateNavbarHeight()
      // Use requestAnimationFrame to ensure DOM is updated
      const timeoutId = setTimeout(updateNavbarHeight, 0)
      return () => clearTimeout(timeoutId)
    }, [isMenuOpen, updateNavbarHeight])

    // Also update on resize
    useEffect(() => {
      window.addEventListener('resize', updateNavbarHeight)
      return () => window.removeEventListener('resize', updateNavbarHeight)
    }, [updateNavbarHeight])

    // Extract and register NavItem children
    useEffect(() => {
      if (!children) {
        return
      }

      const navItems: NavItemData[] = []

      Children.forEach(children, (child) => {
        if (isValidElement(child)) {
          // Check if child is a LayoutNavItem by checking type or displayName
          const isNavItem =
            child.type === LayoutNavItem ||
            (child.type as any)?.displayName === 'Layout.NavItem'

          if (isNavItem && child.props) {
            const { name, to, href, onClick, className, style } = child.props
            if (name) {
              navItems.push({
                name,
                to,
                href,
                onClick,
                className,
                style,
              })
            }
          }
        }
      })

      // Register all nav items
      navItems.forEach((item) => {
        registerNavItem(item)
      })

      // Cleanup: unregister all items when component unmounts or children change
      return () => {
        navItems.forEach((item) => {
          unregisterNavItem(item)
        })
      }
    }, [children, registerNavItem, unregisterNavItem])

    // Combined ref callback
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref && typeof ref === 'object') {
          // Type assertion: ref objects passed to forwardRef are typically MutableRefObject
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(ref as any).current = node
        }
        if (node) {
          updateNavbarHeight()
        }
      },
      [ref, updateNavbarHeight],
    )

    return (
      <ShojiGridCell
        ref={setRefs}
        area="navbar"
        padding={padding}
        shadowTop={false}
        shadowRight={false}
        className={className}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          ...props.style,
        }}
        {...props}
      >
        <Flex justify="between" align="center">
          {/* Left side - Logo */}
          {(icon || title) && (
            <Flex gap="sm" align="center">
              {icon && <Icon name={icon} size={24} />}
              {title &&
                (() => {
                  const titleStyles = {
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    textDecoration: 'none',
                  }

                  // If titleTo is provided and routerLink exists, wrap in router link
                  if (titleTo && routerLink) {
                    const RouterLink = routerLink
                    return (
                      <RouterLink to={titleTo} style={titleStyles}>
                        {title}
                      </RouterLink>
                    )
                  }

                  // Otherwise, render as plain text
                  return <span style={titleStyles}>{title}</span>
                })()}
            </Flex>
          )}

          {/* Right side - Desktop Navigation */}
          <Flex visible={{ base: false, md: true }} gap="md" align="center">
            {children}
          </Flex>

          {/* Mobile hamburger button */}
          <Button
            visible={{ base: true, md: false }}
            variant="ghost"
            size="md"
            onClick={effectiveOnMenuToggle}
            type="button"
            aria-label="Toggle menu"
          >
            <Icon name={effectiveIsMenuOpen ? 'x' : 'list'} size={20} />
          </Button>
        </Flex>
      </ShojiGridCell>
    )
  },
)

LayoutNavbar.displayName = 'Layout.Navbar'
