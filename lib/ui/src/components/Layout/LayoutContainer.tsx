import { forwardRef, ReactNode } from 'react'
import { css } from '@emotion/react'
import { ShojiGridCell } from '../ShojiGrid/ShojiGridCell'
import { BoxProps } from '../Box'
import { responsiveStyles } from '../../utils/responsiveStyles'
import type { Responsive } from '../../utils/Responsive'
import { useLayoutContext } from './LayoutContext'
import { LayoutNavItem } from './LayoutNavItem'
import { Flex } from '../Flex'

/**
 * Convert max-width value to CSS max-width value
 */
function maxWidthToCSS(maxWidth: string): string {
  return maxWidth
}

export interface LayoutContainerProps extends BoxProps {
  /** Content to render inside the container */
  children: ReactNode
  /** Maximum width of the container. Accepts a string or responsive object. Defaults to full width on mobile and 1280px on desktop. */
  maxWidth?: Responsive<string>
}

export const LayoutContainer = forwardRef<HTMLDivElement, LayoutContainerProps>(
  (
    {
      padding,
      paddingHorizontal = { base: 'md', md: 'lg' },
      paddingBottom = { base: 'md', md: 'lg' },
      maxWidth = { base: '100%', md: '1280px' },
      className = '',
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const { navItems, isMenuOpen, onMenuToggle } = useLayoutContext()
    const maxWidthStyles = responsiveStyles('maxWidth', maxWidth, maxWidthToCSS)

    // Container should never have padding-top
    // If padding is provided, extract it to use for horizontal and bottom only
    // Otherwise use the explicit paddingHorizontal and paddingBottom
    const effectivePaddingHorizontal = padding ? padding : paddingHorizontal
    const effectivePaddingBottom = padding ? padding : paddingBottom

    // Generate styles for centering the inner container
    const innerContainerStyles = css`
      ${maxWidthStyles}
      margin-left: auto;
      margin-right: auto;
      width: 100%;
      height: 100%;
    `

    // Container styles: no padding-top, and min-height to cover viewport
    // Min-height: calc(100vh - navbar height - gap)
    // The navbar height is set as a CSS variable (--layout-navbar-height) by LayoutNavbar
    // The grid gap is var(--grid-gap-md) = 3px
    const containerStyles = css`
      padding-top: 0 !important;
      min-height: calc(
        100vh - var(--layout-navbar-height, 0px) - var(--grid-gap-md)
      );
    `

    return (
      <ShojiGridCell
        area="content"
        paddingHorizontal={effectivePaddingHorizontal}
        paddingBottom={effectivePaddingBottom}
        shadowTop
        shadowRight={false}
        className={className}
        css={containerStyles}
        style={style}
        {...props}
      >
        <div ref={ref} css={innerContainerStyles}>
          {isMenuOpen ? (
            <Flex
              direction="column"
              gap="md"
              align="start"
              padding={{ base: 'md', md: 'lg' }}
            >
              {navItems.map((item, index) => (
                <LayoutNavItem
                  key={`${item.name}-${item.to || item.href || index}`}
                  to={item.to}
                  href={item.href}
                  name={item.name}
                  onClick={(e) => {
                    // Call the item's onClick if provided
                    if (item.onClick) {
                      item.onClick(e as any)
                    }
                    // Close the menu when an item is clicked
                    if (onMenuToggle) {
                      onMenuToggle()
                    }
                  }}
                  className={item.className}
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    ...item.style,
                  }}
                />
              ))}
            </Flex>
          ) : (
            children
          )}
        </div>
      </ShojiGridCell>
    )
  },
)

LayoutContainer.displayName = 'Layout.Container'
