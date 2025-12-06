import { forwardRef, CSSProperties } from 'react'
import { BoxProps } from '../Box'
import { FlexProps } from '../Flex'
import '../Box/Box.css'
import '../Flex/Flex.css'
import './Grid.css'

export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type GridColumns = number | 'auto-fill' | 'auto-fit'
export type GridShoji = 'heavy' | 'light' | false

export interface GridProps extends BoxProps {
  /** Number of columns or auto-fill/auto-fit for responsive grids */
  columns?: GridColumns
  /** Gap between grid items */
  gap?: GridGap
  /** Minimum width for each child when using auto-fill or auto-fit */
  minChildWidth?: string
  /** Shoji (Japanese room divider) frame style. 'heavy' for full-screen layouts, 'light' for inset grids */
  shoji?: GridShoji
  /** Custom grid-template-rows CSS value */
  gridTemplateRows?: string
  /** Custom grid-template-columns CSS value. Takes precedence over columns prop when provided */
  gridTemplateColumns?: string
  /** Grid template areas for named grid placement */
  gridTemplateAreas?: string
}

export interface GridCellProps extends FlexProps {
  /** Grid area name (for use with gridTemplateAreas) */
  area?: string
  /** Grid column placement (e.g., "1 / 3" or "span 2") */
  column?: string
  /** Grid row placement (e.g., "1 / 3" or "span 2") */
  row?: string
}

const GridRoot = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      columns = 1,
      gap = 'md',
      minChildWidth = '200px',
      shoji = 'heavy',
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
    const classNames = [
      'zen-grid',
      `zen-grid--gap-${gap}`,
      shoji && `zen-grid--shoji-${shoji}`,
      // Box padding classes
      padding && `zen-box--p-${padding}`,
      paddingHorizontal && `zen-box--px-${paddingHorizontal}`,
      paddingVertical && `zen-box--py-${paddingVertical}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const gridStyle: CSSProperties = {
      ...style,
    }

    // gridTemplateColumns prop takes precedence over columns
    if (gridTemplateColumns) {
      gridStyle.gridTemplateColumns = gridTemplateColumns
    } else if (typeof columns === 'number') {
      gridStyle.gridTemplateColumns = `repeat(${columns}, 1fr)`
    } else {
      gridStyle.gridTemplateColumns = `repeat(${columns}, minmax(${minChildWidth}, 1fr))`
    }

    if (gridTemplateRows) {
      gridStyle.gridTemplateRows = gridTemplateRows
    }

    if (gridTemplateAreas) {
      gridStyle.gridTemplateAreas = gridTemplateAreas
    }

    return (
      <div ref={ref} className={classNames} style={gridStyle} {...props}>
        {children}
      </div>
    )
  },
)

GridRoot.displayName = 'Grid'

const GridCell = forwardRef<HTMLDivElement, GridCellProps>(
  (
    {
      area,
      column,
      row,
      gap = 'none',
      wrap = false,
      direction = 'column',
      align,
      justify,
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
    const classNames = [
      'zen-grid-cell',
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
      <div ref={ref} className={classNames} style={cellStyle} {...props}>
        {children}
      </div>
    )
  },
)

GridCell.displayName = 'Grid.Cell'

// Compound component pattern
export const Grid = Object.assign(GridRoot, {
  Cell: GridCell,
})
