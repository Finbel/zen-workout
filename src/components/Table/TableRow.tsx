import { HTMLAttributes, forwardRef } from 'react'
import './Table.css'

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className = '', children, ...props }, ref) => {
    const classNames = ['zen-table-row', className].filter(Boolean).join(' ')

    return (
      <tr ref={ref} className={classNames} {...props}>
        {children}
      </tr>
    )
  },
)

TableRow.displayName = 'Table.Row'
