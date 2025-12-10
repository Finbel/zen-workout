import { forwardRef, ReactNode } from 'react'
import { ShojiGrid } from '../ShojiGrid'
import { ShojiGridProps } from '../ShojiGrid/ShojiGrid'
import { LayoutNavbar } from './LayoutNavbar'
import { LayoutContainer } from './LayoutContainer'
import { LayoutNavItem } from './LayoutNavItem'
import './Layout.css'

export interface LayoutProps
  extends Omit<ShojiGridProps, 'gridTemplateAreas' | 'gridTemplateRows'> {
  children: ReactNode
}

const LayoutRoot = forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, className = '', style, ...props }, ref) => {
    return (
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

