import { forwardRef, ReactNode, useState, useCallback, useMemo } from 'react'
import { ShojiGrid } from '../ShojiGrid'
import { ShojiGridProps } from '../ShojiGrid/ShojiGrid'
import { LayoutNavbar } from './LayoutNavbar'
import { LayoutContainer } from './LayoutContainer'
import { LayoutNavItem } from './LayoutNavItem'
import { LayoutContext, NavItemData } from './LayoutContext'
import './Layout.css'

export interface LayoutProps
  extends Omit<ShojiGridProps, 'gridTemplateAreas' | 'gridTemplateRows'> {
  children: ReactNode
  /** Router link component to use for navigation (e.g., Link from react-router-dom) */
  // Using any to support forwardRef components and avoid React type version conflicts
  routerLink?: any
  /** Whether the mobile menu is open */
  isMenuOpen?: boolean
  /** Callback when mobile menu button is clicked */
  onMenuToggle?: () => void
}

const LayoutRoot = forwardRef<HTMLDivElement, LayoutProps>(
  (
    {
      children,
      routerLink,
      isMenuOpen = false,
      onMenuToggle,
      className = '',
      style,
      ...props
    },
    ref,
  ) => {
    const [navItems, setNavItems] = useState<NavItemData[]>([])

    const registerNavItem = useCallback((item: NavItemData) => {
      setNavItems((prev) => {
        // Check if item already exists (by comparing name and to/href)
        const exists = prev.some(
          (existing) =>
            existing.name === item.name &&
            existing.to === item.to &&
            existing.href === item.href,
        )
        if (exists) {
          return prev
        }
        return [...prev, item]
      })
    }, [])

    const unregisterNavItem = useCallback((item: NavItemData) => {
      setNavItems((prev) =>
        prev.filter(
          (existing) =>
            !(
              existing.name === item.name &&
              existing.to === item.to &&
              existing.href === item.href
            ),
        ),
      )
    }, [])

    const contextValue = useMemo(
      () => ({
        routerLink,
        navItems,
        registerNavItem,
        unregisterNavItem,
        isMenuOpen,
        onMenuToggle,
      }),
      [
        routerLink,
        navItems,
        registerNavItem,
        unregisterNavItem,
        isMenuOpen,
        onMenuToggle,
      ],
    )

    return (
      <LayoutContext.Provider value={contextValue}>
        <ShojiGrid
          ref={ref}
          gridTemplateAreas={{
            base: `
            "navbar"
            "content"
          `,
          }}
          gridTemplateRows={{
            base: 'auto 1fr',
          }}
          className={className}
          style={{ minHeight: '100vh', ...style }}
          {...props}
        >
          {children}
        </ShojiGrid>
      </LayoutContext.Provider>
    )
  },
)

LayoutRoot.displayName = 'Layout'

// Compound component pattern
export const Layout = Object.assign(LayoutRoot, {
  Navbar: LayoutNavbar,
  Container: LayoutContainer,
  NavItem: LayoutNavItem,
})
