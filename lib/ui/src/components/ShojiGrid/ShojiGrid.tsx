import { forwardRef, CSSProperties, createContext, useContext } from 'react'
import { css } from '@emotion/react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { responsiveStyles } from '../../utils/responsiveStyles'
import { BoxProps } from '../Box'
import '../Box/Box.css'
import './ShojiGrid.css'
import { ShojiGridCell } from './ShojiGridCell'

/**
 * Default minimum width for grid children when using auto-fill or auto-fit columns
 * This is used internally and not exposed as a prop - users can specify minmax() directly
 * via gridTemplateColumns if they need a different value.
 */
const DEFAULT_MIN_CHILD_WIDTH = '200px'

export type ShojiGridGap = 'none' | 'sm' | 'md'
export type ShojiGridColumns = number | 'auto-fill' | 'auto-fit'

/**
 * Context to provide gap information to ShojiGrid.Cell components
 */
interface ShojiGridContextValue {
  gap: Responsive<ShojiGridGap>
}

const ShojiGridContext = createContext<ShojiGridContextValue | null>(null)

/**
 * Hook to access ShojiGrid context
 */
export function useShojiGridContext(): ShojiGridContextValue | null {
  return useContext(ShojiGridContext)
}

/**
 * Convert ShojiGridGap value to CSS spacing token
 */
function gapToCSS(gap: ShojiGridGap): string {
  const mapping: Record<ShojiGridGap, string> = {
    none: '0',
    sm: 'var(--grid-gap-sm)',
    md: 'var(--grid-gap-md)',
  }
  return mapping[gap]
}

/**
 * Convert ShojiGridColumns to grid-template-columns CSS value
 * Uses a default minWidth for auto-fill/auto-fit - users can specify gridTemplateColumns
 * directly if they need a different minWidth.
 */
function columnsToCSS(columns: ShojiGridColumns): string {
  if (typeof columns === 'number') {
    return `repeat(${columns}, 1fr)`
  }
  return `repeat(${columns}, minmax(${DEFAULT_MIN_CHILD_WIDTH}, 1fr))`
}

/**
 * Normalize grid-template-areas string by removing extra whitespace and newlines
 * while preserving the essential structure (quoted area names)
 *
 * Example:
 *   Input:  `\n  "header"\n  "nav"\n  "main"\n  `
 *   Output: `"header" "nav" "main"`
 */
function normalizeGridTemplateAreas(value: string): string {
  // Split by newlines, trim each line, filter empty lines, then join with single space
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join(' ')
    .trim()
}

/**
 * Get class name for a gap prop
 * For responsive objects, returns the base value's class name
 * For simple values, returns the value's class name
 * This allows shoji styles to work with responsive props
 */
function getGapClassName(
  value: Responsive<ShojiGridGap> | undefined,
): string | false {
  if (!value) return false

  if (isResponsiveObject(value)) {
    // For responsive objects, use the base value for the class name
    // This allows shoji styles to work with responsive props at the base breakpoint
    return value.base !== undefined
      ? `zen-shoji-grid--gap-${value.base}`
      : false
  }

  return `zen-shoji-grid--gap-${value}`
}

export interface ShojiGridProps extends BoxProps {
  /** Number of columns or auto-fill/auto-fit for responsive grids */
  columns?: Responsive<ShojiGridColumns>
  /** Gap between grid items */
  gap?: Responsive<ShojiGridGap>
  /** Custom grid-template-rows CSS value */
  gridTemplateRows?: Responsive<string>
  /** Custom grid-template-columns CSS value. Takes precedence over columns prop when provided. Use this for custom minmax() values with auto-fill/auto-fit. */
  gridTemplateColumns?: Responsive<string>
  /** Grid template areas for named grid placement */
  gridTemplateAreas?: Responsive<string>
}

const ShojiGridRoot = forwardRef<HTMLDivElement, ShojiGridProps>(
  (
    {
      columns = 1,
      gap = 'md',
      gridTemplateRows,
      gridTemplateColumns,
      gridTemplateAreas,
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
    const classNames = [
      'zen-shoji-grid',
      getGapClassName(gap),
      // Box padding classes (handled by Box component)
      className,
    ]
      .filter(Boolean)
      .join(' ')

    // Generate Emotion styles for responsive gap
    const gapStyles = responsiveStyles('gap', gap, gapToCSS)

    // Generate Emotion styles for responsive gridTemplateRows
    const gridTemplateRowsStyles = responsiveStyles(
      'gridTemplateRows',
      gridTemplateRows,
      (val) => val,
    )

    // Generate Emotion styles for responsive gridTemplateColumns
    const gridTemplateColumnsStyles = responsiveStyles(
      'gridTemplateColumns',
      gridTemplateColumns,
      (val) => val,
    )

    // Generate Emotion styles for responsive gridTemplateAreas
    const gridTemplateAreasStyles = responsiveStyles(
      'gridTemplateAreas',
      gridTemplateAreas,
      normalizeGridTemplateAreas,
    )

    // Handle columns for grid-template-columns
    // Only process if gridTemplateColumns is not provided (it takes precedence)
    const columnsStyles = !gridTemplateColumns
      ? responsiveStyles('gridTemplateColumns', columns, columnsToCSS)
      : undefined

    // Combine all Emotion styles
    const emotionStyles = css`
      ${gapStyles}
      ${gridTemplateRowsStyles}
      ${gridTemplateColumnsStyles}
      ${gridTemplateAreasStyles}
      ${columnsStyles}
    `

    // Handle non-responsive inline styles for backward compatibility
    const gridStyle: CSSProperties = {
      ...style,
    }

    // gridTemplateColumns prop takes precedence over columns
    // Only set inline if not responsive (responsive handled via Emotion)
    if (
      gridTemplateColumns &&
      !isResponsiveObject(gridTemplateColumns) &&
      !isResponsiveObject(columns)
    ) {
      gridStyle.gridTemplateColumns = gridTemplateColumns
    } else if (!gridTemplateColumns && !isResponsiveObject(columns)) {
      // Only set inline style if not using responsive props
      gridStyle.gridTemplateColumns = columnsToCSS(columns)
    }

    if (gridTemplateRows && !isResponsiveObject(gridTemplateRows)) {
      gridStyle.gridTemplateRows = gridTemplateRows
    }

    if (gridTemplateAreas && !isResponsiveObject(gridTemplateAreas)) {
      gridStyle.gridTemplateAreas =
        normalizeGridTemplateAreas(gridTemplateAreas)
    }

    return (
      <ShojiGridContext.Provider value={{ gap }}>
        <div
          ref={ref}
          className={classNames}
          css={emotionStyles}
          style={gridStyle}
          {...props}
        >
          {children}
        </div>
      </ShojiGridContext.Provider>
    )
  },
)

ShojiGridRoot.displayName = 'ShojiGrid'

// Compound component pattern
export const ShojiGrid = Object.assign(ShojiGridRoot, {
  Cell: ShojiGridCell,
})
