import { HTMLAttributes, forwardRef } from 'react'
import './Table.scss'

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className = '', children, ...props }, ref) => {
    const classNames = ['zen-table-cell', className].filter(Boolean).join(' ')

    return (
      <td ref={ref} className={classNames} {...props}>
        {children}
      </td>
    )
  },
)

TableCell.displayName = 'Table.Cell'
