import { forwardRef, ReactNode, useEffect, useRef, useCallback } from 'react'
import { ShojiGridCell } from '../ShojiGrid/ShojiGridCell'
import { Flex } from '../Flex'
import { Button } from '../Button'
import { Icon, IconName } from '../Icon'
import { BoxProps } from '../Box'

export interface LayoutNavbarProps extends Omit<BoxProps, 'children'> {
  /** Icon name to display in the navbar */
  icon?: IconName
  /** Title text to display in the navbar */
  title?: string
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
      children,
      onMenuToggle,
      isMenuOpen = false,
      padding = { base: 'sm', md: 'md' },
      className = '',
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null)

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

    // Combined ref callback
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
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
              {title && (
                <span
                  style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {title}
                </span>
              )}
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
            onClick={onMenuToggle}
            type="button"
            aria-label="Toggle menu"
          >
            <Icon name={isMenuOpen ? 'x' : 'list'} size={20} />
          </Button>
        </Flex>
      </ShojiGridCell>
    )
  },
)

LayoutNavbar.displayName = 'Layout.Navbar'

