import { forwardRef, HTMLAttributes } from 'react'
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
  /** Click handler - if provided, renders as anchor/link */
  href?: string
}

/**
 * Logo component that displays an icon and text together.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Logo icon="check" text="Zen Design" />
 *
 * // With custom icon size
 * <Logo icon="check" text="Zen Design" iconSize={32} />
 *
 * // As a link
 * <Logo icon="check" text="Zen Design" href="/" />
 *
 * // With responsive icon size
 * <Logo icon="check" text="Zen Design" iconSize={{ base: 20, md: 28 }} />
 * ```
 */
export const Logo = forwardRef<HTMLDivElement | HTMLAnchorElement, LogoProps>(
  (
    { icon, text, iconSize = 24, href, className = '', style, ...props },
    ref,
  ) => {
    const classNames = ['zen-logo', className].filter(Boolean).join(' ')

    const logoContent = (
      <>
        <Icon name={icon} size={iconSize} />
        <span className="zen-logo__text">{text}</span>
      </>
    )

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
  },
)

Logo.displayName = 'Logo'
