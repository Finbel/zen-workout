import { forwardRef } from 'react'
import { css } from '@emotion/react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { responsiveStyles } from '../../utils/responsiveStyles'
import { BoxProps, BoxPadding } from '../Box'
import { getPaddingEmotionStyles } from '../Box/boxPaddingStyles'
import '../Box/Box.css'
import './ShojiGrid.css'

/**
 * Get class name for a padding prop if it's a simple (non-responsive) value
 */
function getPaddingClassName(
  value: Responsive<BoxPadding> | undefined,
  prefix: string,
): string | false {
  return value && !isResponsiveObject(value)
    ? `zen-box--${prefix}-${value}`
    : false
}

export interface ShojiGridCellProps extends BoxProps {
  /** Grid area name (for use with gridTemplateAreas) */
  area?: Responsive<string>
  /** Grid column placement (e.g., "1 / 3" or "span 2") */
  column?: Responsive<string>
  /** Grid row placement (e.g., "1 / 3" or "span 2") */
  row?: Responsive<string>
}

export const ShojiGridCell = forwardRef<HTMLDivElement, ShojiGridCellProps>(
  (
    {
      area,
      column,
      row,
      padding,
      paddingHorizontal,
      paddingVertical,
      className = '',
      style,
      children,
      ...props
    },
    ref,
  ) => {
    // Build class names for non-responsive usage (backward compatibility)
    // Only add classes if the value is a simple (non-responsive) value
    const classNames = [
      'zen-shoji-grid-cell',
      getPaddingClassName(padding, 'p'),
      getPaddingClassName(paddingHorizontal, 'px'),
      getPaddingClassName(paddingVertical, 'py'),
      className,
    ]
      .filter(Boolean)
      .join(' ')

    // Generate Emotion styles for responsive padding using shared utility
    const paddingStyles = getPaddingEmotionStyles(
      padding,
      paddingHorizontal,
      paddingVertical,
    )

    // Helper function to convert string values to CSS (identity function)
    const stringToCSS = (val: string): string => val

    // Generate Emotion styles for responsive grid placement props
    const areaStyles = responsiveStyles('gridArea', area, stringToCSS)
    const columnStyles = responsiveStyles('gridColumn', column, stringToCSS)
    const rowStyles = responsiveStyles('gridRow', row, stringToCSS)

    // Combine all Emotion styles
    const emotionStyles = css`
      ${paddingStyles}
      ${areaStyles}
      ${columnStyles}
      ${rowStyles}
    `

    return (
      <div
        ref={ref}
        className={classNames}
        css={emotionStyles}
        style={style}
        {...props}
      >
        {children}
      </div>
    )
  },
)

ShojiGridCell.displayName = 'ShojiGrid.Cell'
