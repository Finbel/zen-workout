import { forwardRef, ButtonHTMLAttributes } from 'react'
import { Button } from '../Button'

export interface LayoutNavItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Display name of the navigation item */
  name: string
  /** Optional route/path (for use with routing libraries) */
  to?: string
}

export const LayoutNavItem = forwardRef<HTMLButtonElement, LayoutNavItemProps>(
  ({ name, to, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (to && !onClick) {
        // If 'to' is provided and no custom onClick, could integrate with router here
        // For now, just call the default onClick if provided
      }
      onClick?.(e)
    }

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="lg"
        onClick={handleClick}
        {...props}
      >
        {name}
      </Button>
    )
  },
)

LayoutNavItem.displayName = 'Layout.NavItem'

