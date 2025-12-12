import { createContext, useContext } from 'react'
import { LayoutNavItemProps } from './LayoutNavItem'

export interface NavItemData
  extends Pick<
    LayoutNavItemProps,
    'name' | 'to' | 'href' | 'onClick' | 'className' | 'style'
  > {}

export interface LayoutContextValue {
  /** Router link component to use for navigation (e.g., Link from react-router-dom) */
  // Using any to support forwardRef components and avoid React type version conflicts
  routerLink?: any
  /** Array of registered navigation items */
  navItems: NavItemData[]
  /** Function to register a navigation item */
  registerNavItem: (item: NavItemData) => void
  /** Function to unregister a navigation item */
  unregisterNavItem: (item: NavItemData) => void
  /** Whether the mobile menu is open */
  isMenuOpen?: boolean
  /** Callback to toggle the mobile menu */
  onMenuToggle?: () => void
}

export const LayoutContext = createContext<LayoutContextValue>({
  routerLink: undefined,
  navItems: [],
  registerNavItem: () => {},
  unregisterNavItem: () => {},
  isMenuOpen: false,
  onMenuToggle: undefined,
})

/**
 * Hook to access the Layout context
 * @returns The Layout context value containing the router link component and navigation items
 */
export function useLayoutContext(): LayoutContextValue {
  return useContext(LayoutContext)
}
