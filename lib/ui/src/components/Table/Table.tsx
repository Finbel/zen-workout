import { HTMLAttributes, forwardRef } from 'react'
import { TableHead } from './TableHead'
import { TableBody } from './TableBody'
import { TableRow } from './TableRow'
import { TableHeader } from './TableHeader'
import { TableCell } from './TableCell'
import './Table.css'

export interface TableProps extends HTMLAttributes<HTMLTableElement> {}

const TableRoot = forwardRef<HTMLTableElement, TableProps>(
  ({ className = '', children, ...props }, ref) => {
    const classNames = ['zen-table', className].filter(Boolean).join(' ')

    return (
      <table ref={ref} className={classNames} {...props}>
        {children}
      </table>
    )
  },
)

TableRoot.displayName = 'Table'

// Compound component pattern
export const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Header: TableHeader,
  Cell: TableCell,
})
