import { HTMLAttributes, forwardRef } from 'react'
import './Table.css'

export interface TableHeaderProps
  extends HTMLAttributes<HTMLTableCellElement> {}

export const TableHeader = forwardRef<HTMLTableCellElement, TableHeaderProps>(
  ({ className = '', children, ...props }, ref) => {
    const classNames = ['zen-table-header', className].filter(Boolean).join(' ')

    return (
      <th ref={ref} className={classNames} {...props}>
        {children}
      </th>
    )
  },
)

TableHeader.displayName = 'Table.Header'
