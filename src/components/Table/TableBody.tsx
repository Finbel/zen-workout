import { HTMLAttributes, forwardRef } from 'react'
import './Table.scss'

export interface TableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className = '', children, ...props }, ref) => {
    const classNames = ['zen-table-body', className].filter(Boolean).join(' ')

    return (
      <tbody ref={ref} className={classNames} {...props}>
        {children}
      </tbody>
    )
  },
)

TableBody.displayName = 'Table.Body'
