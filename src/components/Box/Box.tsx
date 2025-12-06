import { HTMLAttributes, forwardRef } from 'react'
import './Box.css'

export type BoxPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  /** Padding on all sides */
  padding?: BoxPadding
  /** Horizontal padding (left and right) */
  paddingHorizontal?: BoxPadding
  /** Vertical padding (top and bottom) */
  paddingVertical?: BoxPadding
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      padding,
      paddingHorizontal,
      paddingVertical,
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    const classNames = [
      'zen-box',
      padding && `zen-box--p-${padding}`,
      paddingHorizontal && `zen-box--px-${paddingHorizontal}`,
      paddingVertical && `zen-box--py-${paddingVertical}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    )
  },
)

Box.displayName = 'Box'
