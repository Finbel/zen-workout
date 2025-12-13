import { forwardRef, ReactNode, useEffect, useRef } from 'react'
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
      paddingHorizontal,
      paddingBottom = { base: 'md', md: 'lg' },
      maxWidth = { base: '100%', md: '1280px' },
      className = '',
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const { navItems, isMenuOpen, onMenuToggle, setMaxWidth } =
      useLayoutContext()

    // Destructure Box props that shouldn't be passed to DOM elements
    // These are already handled by ShojiGridCell, so we filter them out
    // Note: padding, paddingHorizontal, and paddingBottom are already destructured
    // in the function parameters above, so they're not in props
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      paddingTop: _paddingTop,
      paddingVertical: _paddingVertical,
      paddingLeft: _paddingLeft,
      paddingRight: _paddingRight,
      visible: _visible,
      ...domProps
    } = props

    // Register maxWidth with context so Layout can use it for grid columns
    // Use refs to track values and avoid infinite loops
    const prevMaxWidthStringRef = useRef<string>('')
    const isInitialMountRef = useRef(true)

    useEffect(() => {
      if (!setMaxWidth) return

      const currentMaxWidthString = JSON.stringify(maxWidth)

      // On initial mount, always set the value
      if (isInitialMountRef.current) {
        prevMaxWidthStringRef.current = currentMaxWidthString
        setMaxWidth(maxWidth)
        isInitialMountRef.current = false
        return
      }

      // On subsequent renders, only update if the value has actually changed
      if (prevMaxWidthStringRef.current !== currentMaxWidthString) {
        prevMaxWidthStringRef.current = currentMaxWidthString
        setMaxWidth(maxWidth)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maxWidth])

    // Container should never have padding-top
    // If padding is provided, extract it to use for horizontal and bottom only
    // Otherwise use the explicit paddingHorizontal and paddingBottom
    const effectivePaddingHorizontal = padding ? padding : paddingHorizontal
    const effectivePaddingBottom = padding ? padding : paddingBottom

    // Generate styles for centering the inner container (mobile only)
    const maxWidthStyles = responsiveStyles('maxWidth', maxWidth, maxWidthToCSS)
    const innerContainerStyles = css`
      ${maxWidthStyles}
      margin-left: auto;
      margin-right: auto;
      width: 100%;
      height: 100%;
      /* Hide inner container on desktop - grid handles width */
      @media (min-width: 1024px) {
        max-width: none;
        margin-left: 0;
        margin-right: 0;
      }
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

    // Content to render (menu or children)
    const content = isMenuOpen ? (
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
    )

    return (
      <>
        {/* Left shoji cell - only visible on desktop (md+) */}
        <ShojiGridCell
          area={{ md: 'left' }}
          shadowTop
          shadowRight
          visible={{ base: false, md: true }}
        />
        {/* Content cell */}
        <ShojiGridCell
          area="content"
          paddingHorizontal={effectivePaddingHorizontal}
          paddingBottom={effectivePaddingBottom}
          shadowTop
          shadowRight={{ base: false, md: true }}
          className={className}
          css={containerStyles}
          style={style}
          {...domProps}
        >
          <div ref={ref} css={innerContainerStyles}>
            {content}
          </div>
        </ShojiGridCell>
        {/* Right shoji cell - only visible on desktop (md+) */}
        <ShojiGridCell
          shadowTop
          area={{ md: 'right' }}
          visible={{ base: false, md: true }}
        />
      </>
    )
  },
)

LayoutContainer.displayName = 'Layout.Container'
