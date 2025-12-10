import { InputHTMLAttributes, forwardRef } from 'react'
import { Icon } from '../Icon/Icon'
import './Checkbox.css'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Whether the checkbox is checked */
  checked?: boolean
  /** Whether the checkbox is checked by default (uncontrolled) */
  defaultChecked?: boolean
  /** Callback fired when the checkbox state changes */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Whether the checkbox is disabled */
  disabled?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      disabled,
      className = '',
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      style,
      ...props
    },
    ref,
  ) => {
    const wrapperClassNames = [
      'zen-checkbox-wrapper',
      disabled && 'zen-checkbox-wrapper--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={wrapperClassNames} style={style}>
        <input
          ref={ref}
          type="checkbox"
          id={id}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          className="zen-checkbox"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          {...props}
        />
        <span className="zen-checkbox-indicator">
          <Icon
            name="check"
            size={14}
            className="zen-checkbox-icon"
            aria-hidden="true"
          />
        </span>
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'
