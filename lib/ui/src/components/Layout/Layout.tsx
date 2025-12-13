import { forwardRef, ReactNode, useState, useCallback, useMemo } from 'react'
import { ShojiGrid } from '../ShojiGrid'
import { ShojiGridProps } from '../ShojiGrid/ShojiGrid'
import { LayoutNavbar } from './LayoutNavbar'
import { LayoutContainer } from './LayoutContainer'
import { LayoutNavItem } from './LayoutNavItem'
import { LayoutContext, NavItemData } from './LayoutContext'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
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

/**
 * Convert maxWidth to grid-template-columns value
 * For base: single column (1fr)
 * For md+: three columns (1fr minmax(0, maxWidth) 1fr)
 */
function maxWidthToGridColumns(
  maxWidth: Responsive<string> | undefined,
): Responsive<string> {
  if (!maxWidth) {
    return { base: '1fr', md: '1fr minmax(0, 1280px) 1fr' }
  }

  if (!isResponsiveObject(maxWidth)) {
    // Simple value - use for md breakpoint (desktop)
    return { base: '1fr', md: `1fr minmax(0, ${maxWidth}) 1fr` }
  }

  // Responsive object - convert each breakpoint
  const responsiveObj = maxWidth as Record<string, string | undefined>
  const result: Record<string, string> = {
    base: '1fr', // Always single column on base (mobile)
  }

  // For md and above, use 3-column layout
  // Use the maxWidth value from the corresponding breakpoint
  const breakpoints: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'sm', 'md', 'lg']

  // Find the value to use for md (prefer md, fallback to base or first available)
  let mdMaxWidth: string | undefined = responsiveObj.md
  if (!mdMaxWidth && responsiveObj.base !== undefined) {
    mdMaxWidth = responsiveObj.base
  }
  if (!mdMaxWidth) {
    // Find first available breakpoint value
    for (const bp of breakpoints) {
      if (responsiveObj[bp] !== undefined) {
        mdMaxWidth = responsiveObj[bp]
        break
      }
    }
  }

  if (mdMaxWidth) {
    result.md = `1fr minmax(0, ${mdMaxWidth}) 1fr`
  }

  // For lg, use lg value if available, otherwise inherit from md
  if (responsiveObj.lg !== undefined) {
    result.lg = `1fr minmax(0, ${responsiveObj.lg}) 1fr`
  }

  return result
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
    const [maxWidth, setMaxWidth] = useState<Responsive<string> | undefined>(
      undefined,
    )

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

    // Memoize setMaxWidth to ensure it's stable (though useState setters are already stable)
    const stableSetMaxWidth = useCallback((value: Responsive<string>) => {
      setMaxWidth(value)
    }, [])

    const contextValue = useMemo(
      () => ({
        routerLink,
        navItems,
        registerNavItem,
        unregisterNavItem,
        isMenuOpen,
        onMenuToggle,
        maxWidth,
        setMaxWidth: stableSetMaxWidth,
      }),
      [
        routerLink,
        navItems,
        registerNavItem,
        unregisterNavItem,
        isMenuOpen,
        onMenuToggle,
        maxWidth,
        stableSetMaxWidth,
      ],
    )

    // Calculate grid template columns based on maxWidth
    const defaultMaxWidth: Responsive<string> = {
      base: '100%',
      md: '1280px',
    }
    const effectiveMaxWidth = maxWidth || defaultMaxWidth
    const gridColumns = maxWidthToGridColumns(effectiveMaxWidth)

    return (
      <LayoutContext.Provider value={contextValue}>
        <ShojiGrid
          ref={ref}
          gridTemplateAreas={{
            base: `
            "navbar"
            "content"
          `,
            md: `
            "navbar navbar navbar"
            "left content right"
          `,
          }}
          gridTemplateRows={{
            base: 'auto 1fr',
          }}
          gridTemplateColumns={gridColumns}
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
