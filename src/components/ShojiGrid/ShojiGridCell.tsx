import { forwardRef, CSSProperties } from 'react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { processResponsiveProps } from '../../utils/responsiveProps'
import { generateResponsiveDataAttributes } from '../../utils/responsiveDataAttributes'
import { BoxProps, BoxPadding } from '../Box'
import { createNormalizeResponsive } from '../../utils/normalizeResponsive'
import '../Box/Box.scss'
import './ShojiGrid.scss'

/**
 * Convert BoxPadding value to CSS spacing token
 */
function paddingToCSS(padding: BoxPadding): string {
  const mapping: Record<BoxPadding, string> = {
    none: '0',
    xs: 'var(--space-1)',
    sm: 'var(--space-2)',
    md: 'var(--space-4)',
    lg: 'var(--space-6)',
    xl: 'var(--space-8)',
  }
  return mapping[padding]
}

/**
 * Convert responsive padding value to CSS value
 */
const normalizeResponsivePadding = createNormalizeResponsive(paddingToCSS)

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
  area?: string
  /** Grid column placement (e.g., "1 / 3" or "span 2") */
  column?: string
  /** Grid row placement (e.g., "1 / 3" or "span 2") */
  row?: string
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
    // Process responsive props to CSS custom properties
    const responsiveStyles = processResponsiveProps('box', {
      padding: normalizeResponsivePadding(padding),
      paddingHorizontal: normalizeResponsivePadding(paddingHorizontal),
      paddingVertical: normalizeResponsivePadding(paddingVertical),
    })

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

    // Add data attributes to indicate which responsive props are used
    const dataAttributes = generateResponsiveDataAttributes({
      padding,
      paddingHorizontal,
      paddingVertical,
    })

    const cellStyle: CSSProperties = {
      ...style,
    }

    if (area) {
      cellStyle.gridArea = area
    }

    if (column) {
      cellStyle.gridColumn = column
    }

    if (row) {
      cellStyle.gridRow = row
    }

    return (
      <div
        ref={ref}
        className={classNames}
        style={{ ...responsiveStyles, ...cellStyle }}
        {...dataAttributes}
        {...props}
      >
        {children}
      </div>
    )
  },
)

ShojiGridCell.displayName = 'ShojiGrid.Cell'
