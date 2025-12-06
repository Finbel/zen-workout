import { forwardRef } from 'react'
import { BoxProps } from '../Box'
import '../Box/Box.css'
import './Flex.css'

export type FlexGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type FlexDirection = 'row' | 'column'
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch'
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around'

export interface FlexProps extends BoxProps {
  /** Gap between flex items */
  gap?: FlexGap
  /** Whether items should wrap to new lines */
  wrap?: boolean
  /** Flex direction */
  direction?: FlexDirection
  /** Align items on the cross axis */
  align?: FlexAlign
  /** Justify content on the main axis */
  justify?: FlexJustify
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      gap = 'md',
      wrap = true,
      direction = 'row',
      align,
      justify,
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
      'zen-flex',
      `zen-flex--gap-${gap}`,
      `zen-flex--${direction}`,
      wrap && 'zen-flex--wrap',
      align && `zen-flex--align-${align}`,
      justify && `zen-flex--justify-${justify}`,
      // Box padding classes
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

Flex.displayName = 'Flex'
