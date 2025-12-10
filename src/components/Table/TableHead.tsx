import { HTMLAttributes, forwardRef } from 'react'
import './Table.css'

export interface TableHeadProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  ({ className = '', children, ...props }, ref) => {
    const classNames = ['zen-table-head', className].filter(Boolean).join(' ')

    return (
      <thead ref={ref} className={classNames} {...props}>
        {children}
      </thead>
    )
  },
)

TableHead.displayName = 'Table.Head'
