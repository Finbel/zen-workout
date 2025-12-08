import { forwardRef, CSSProperties } from 'react'
import type { Responsive } from '../../utils/Responsive'
import { isResponsiveObject } from '../../utils/Responsive'
import { processResponsiveProps } from '../../utils/responsiveProps'
import { createNormalizeResponsive } from '../../utils/normalizeResponsive'
import { generateResponsiveDataAttributes } from '../../utils/responsiveDataAttributes'
import { BoxProps } from '../Box'
import '../Box/Box.scss'
import './ShojiGrid.scss'
import { ShojiGridCell } from './ShojiGridCell'
import { SHOJI_GRID_COLUMNS_BASE } from './shojiGridConstants'

/**
 * Default minimum width for grid children when using auto-fill or auto-fit columns
 * This is used internally and not exposed as a prop - users can specify minmax() directly
 * via gridTemplateColumns if they need a different value.
 */
const DEFAULT_MIN_CHILD_WIDTH = '200px'

export type ShojiGridGap = 'none' | 'sm' | 'md'
export type ShojiGridColumns = number | 'auto-fill' | 'auto-fit'

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
 * Convert responsive gap value to CSS value
 */
const normalizeResponsiveGap = createNormalizeResponsive(gapToCSS)

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
 * Process responsive columns into CSS custom properties
 */
function processResponsiveColumns(
  columns: Responsive<ShojiGridColumns> | undefined,
): Record<string, string> {
  const cssProps: Record<string, string> = {}

  if (columns === undefined) return cssProps

  if (isResponsiveObject(columns)) {
    if (columns.base !== undefined) {
      cssProps[SHOJI_GRID_COLUMNS_BASE] = columnsToCSS(columns.base)
    }
    for (const breakpoint of ['xs', 'sm', 'md', 'lg'] as const) {
      if (columns[breakpoint] !== undefined) {
        cssProps[`--shoji-grid-columns-${breakpoint}`] = columnsToCSS(
          columns[breakpoint],
        )
      }
    }
  } else {
    cssProps[SHOJI_GRID_COLUMNS_BASE] = columnsToCSS(columns)
  }

  return cssProps
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
 * Convert responsive grid-template-areas value to normalized CSS value
 */
const normalizeResponsiveGridTemplateAreas = createNormalizeResponsive(
  normalizeGridTemplateAreas,
)

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
      gap = { base: 'sm', md: 'md' },
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
    // Process responsive props to CSS custom properties
    const responsiveStyles = processResponsiveProps('shoji-grid', {
      gap: normalizeResponsiveGap(gap),
      gridTemplateRows: gridTemplateRows,
      gridTemplateColumns: gridTemplateColumns,
      gridTemplateAreas:
        normalizeResponsiveGridTemplateAreas(gridTemplateAreas),
    })

    // Handle columns for grid-template-columns
    // Only process if gridTemplateColumns is not provided (it takes precedence)
    if (!gridTemplateColumns) {
      const columnsStyles = processResponsiveColumns(columns)
      Object.assign(responsiveStyles, columnsStyles)
    }

    // Build class names for non-responsive usage (backward compatibility)
    const classNames = [
      'zen-shoji-grid',
      getGapClassName(gap),
      // Box padding classes (handled by Box component)
      className,
    ]
      .filter(Boolean)
      .join(' ')

    // Add data attributes to indicate which responsive props are used
    // Generate base data attributes for simple props (non-camelCase)
    const dataAttributes = generateResponsiveDataAttributes({
      gap,
      columns,
    })

    // Handle camelCase prop names for gridTemplate* props (use kebab-case in data attributes)
    if (gridTemplateRows && isResponsiveObject(gridTemplateRows)) {
      dataAttributes['data-has-responsive-grid-template-rows'] = 'true'
    }
    if (gridTemplateColumns && isResponsiveObject(gridTemplateColumns)) {
      dataAttributes['data-has-responsive-grid-template-columns'] = 'true'
    }
    if (gridTemplateAreas && isResponsiveObject(gridTemplateAreas)) {
      dataAttributes['data-has-responsive-grid-template-areas'] = 'true'
    }

    // Add breakpoint-specific data attributes for gap (needed for shoji styles)
    if (gap && isResponsiveObject(gap)) {
      if (gap.base !== undefined) {
        dataAttributes['data-gap-base'] = gap.base
      }
      if (gap.xs !== undefined) {
        dataAttributes['data-gap-xs'] = gap.xs
      }
      if (gap.sm !== undefined) {
        dataAttributes['data-gap-sm'] = gap.sm
      }
      if (gap.md !== undefined) {
        dataAttributes['data-gap-md'] = gap.md
      }
      if (gap.lg !== undefined) {
        dataAttributes['data-gap-lg'] = gap.lg
      }
    }

    // Handle non-responsive inline styles for backward compatibility
    const gridStyle: CSSProperties = {
      ...style,
    }

    // gridTemplateColumns prop takes precedence over columns
    // Only set inline if not responsive (responsive handled via CSS custom properties)
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
      <div
        ref={ref}
        className={classNames}
        style={{ ...responsiveStyles, ...gridStyle }}
        {...dataAttributes}
        {...props}
      >
        {children}
      </div>
    )
  },
)

ShojiGridRoot.displayName = 'ShojiGrid'

// Compound component pattern
export const ShojiGrid = Object.assign(ShojiGridRoot, {
  Cell: ShojiGridCell,
})
