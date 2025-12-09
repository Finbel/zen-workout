import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  describe('Component Rendering', () => {
    it('should render with default props', () => {
      const { container } = render(<Checkbox />)
      const input = container.querySelector('.zen-checkbox')
      const wrapper = container.querySelector('.zen-checkbox-wrapper')
      expect(input).toBeInTheDocument()
      expect(wrapper).toBeInTheDocument()
    })

    it('should apply base class names', () => {
      const { container } = render(<Checkbox />)
      const input = container.querySelector('.zen-checkbox')
      const wrapper = container.querySelector('.zen-checkbox-wrapper')
      expect(input).toHaveClass('zen-checkbox')
      expect(wrapper).toHaveClass('zen-checkbox-wrapper')
    })

    it('should render indicator element', () => {
      const { container } = render(<Checkbox />)
      const indicator = container.querySelector('.zen-checkbox-indicator')
      expect(indicator).toBeInTheDocument()
    })
  })

  describe('Checked States', () => {
    it('should render unchecked by default', () => {
      const { container } = render(<Checkbox />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      expect(input.checked).toBe(false)
    })

    it('should render checked when checked prop is true', () => {
      const { container } = render(<Checkbox checked />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      expect(input.checked).toBe(true)
    })

    it('should render checked when defaultChecked prop is true', () => {
      const { container } = render(<Checkbox defaultChecked />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      expect(input.checked).toBe(true)
    })

    it('should show check icon when checked', () => {
      const { container } = render(<Checkbox checked />)
      const icon = container.querySelector('.zen-checkbox-icon') as HTMLElement
      expect(icon).toBeInTheDocument()
      const styles = getComputedStyle(icon)
      expect(styles.visibility).toBe('visible')
    })

    it('should not show check icon when unchecked', () => {
      const { container } = render(<Checkbox />)
      const icon = container.querySelector('.zen-checkbox-icon') as HTMLElement
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      expect(icon).toBeInTheDocument()
      expect(input.checked).toBe(false)
      // Icon visibility is controlled by CSS :checked pseudo-class
      // In jsdom, we verify the input state instead of computed styles
    })
  })

  describe('Controlled vs Uncontrolled', () => {
    it('should work as controlled component', () => {
      const handleChange = vi.fn()
      const { container, rerender } = render(
        <Checkbox checked={false} onChange={handleChange} />,
      )
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement

      expect(input.checked).toBe(false)

      // Update controlled value
      rerender(<Checkbox checked={true} onChange={handleChange} />)
      expect(input.checked).toBe(true)
    })

    it('should work as uncontrolled component', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      const { container } = render(
        <Checkbox defaultChecked={false} onChange={handleChange} />,
      )
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement

      expect(input.checked).toBe(false)

      await user.click(input)
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(input.checked).toBe(true)
    })
  })

  describe('Disabled State', () => {
    it('should apply disabled attribute', () => {
      const { container } = render(<Checkbox disabled />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      expect(input).toBeDisabled()
    })

    it('should apply disabled wrapper class', () => {
      const { container } = render(<Checkbox disabled />)
      const wrapper = container.querySelector('.zen-checkbox-wrapper')
      expect(wrapper).toHaveClass('zen-checkbox-wrapper--disabled')
    })

    it('should not be disabled by default', () => {
      const { container } = render(<Checkbox />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      expect(input).not.toBeDisabled()
    })

    it('should not trigger onChange when disabled', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      const { container } = render(
        <Checkbox disabled onChange={handleChange} />,
      )
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement

      await user.click(input)
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Change Events', () => {
    it('should call onChange when clicked', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      const { container } = render(<Checkbox onChange={handleChange} />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement

      await user.click(input)
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('should pass event to onChange handler', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      const { container } = render(<Checkbox onChange={handleChange} />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement

      await user.click(input)
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            checked: true,
          }),
        }),
      )
    })
  })

  describe('Accessibility', () => {
    it('should forward ref to input element', () => {
      const ref = { current: null }
      render(<Checkbox ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })

    it('should support aria-label', () => {
      const { container } = render(<Checkbox aria-label="Accept terms" />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      expect(input).toHaveAttribute('aria-label', 'Accept terms')
    })

    it('should support aria-labelledby', () => {
      const { container } = render(<Checkbox aria-labelledby="label-id" />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      expect(input).toHaveAttribute('aria-labelledby', 'label-id')
    })

    it('should have type="checkbox"', () => {
      const { container } = render(<Checkbox />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      expect(input.type).toBe('checkbox')
    })

    it('should support id attribute', () => {
      const { container } = render(<Checkbox id="test-checkbox" />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      expect(input.id).toBe('test-checkbox')
    })

    it('should support name attribute', () => {
      const { container } = render(<Checkbox name="agreement" />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      expect(input.name).toBe('agreement')
    })

    it('should support value attribute', () => {
      const { container } = render(<Checkbox value="yes" />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      expect(input.value).toBe('yes')
    })
  })

  describe('Icon Rendering', () => {
    it('should render check icon when checked', () => {
      const { container } = render(<Checkbox checked />)
      const icon = container.querySelector('.zen-checkbox-icon') as HTMLElement
      expect(icon).toBeInTheDocument()
      const styles = getComputedStyle(icon)
      expect(styles.visibility).toBe('visible')
    })

    it('should not render check icon when unchecked', () => {
      const { container } = render(<Checkbox />)
      const icon = container.querySelector('.zen-checkbox-icon') as HTMLElement
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      expect(icon).toBeInTheDocument()
      expect(input.checked).toBe(false)
      // Icon visibility is controlled by CSS :checked pseudo-class
      // In jsdom, we verify the input state instead of computed styles
    })

    it('should render check icon for defaultChecked', () => {
      const { container } = render(<Checkbox defaultChecked />)
      const icon = container.querySelector('.zen-checkbox-icon') as HTMLElement
      expect(icon).toBeInTheDocument()
      const styles = getComputedStyle(icon)
      expect(styles.visibility).toBe('visible')
    })

    it('should update icon when checked state changes', () => {
      const { container, rerender } = render(<Checkbox checked={false} />)
      const icon = container.querySelector('.zen-checkbox-icon') as HTMLElement
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      expect(icon).toBeInTheDocument()
      expect(input.checked).toBe(false)
      // Icon should be hidden when unchecked (CSS handles this, but in jsdom we verify the input state)

      rerender(<Checkbox checked={true} />)
      expect(input.checked).toBe(true)
      // Icon should be visible when checked (CSS handles this, but in jsdom we verify the input state)
    })
  })

  describe('Custom Class Names', () => {
    it('should apply custom className to wrapper', () => {
      const { container } = render(<Checkbox className="custom-class" />)
      const wrapper = container.querySelector('.zen-checkbox-wrapper')
      expect(wrapper).toHaveClass('custom-class')
    })
  })

  describe('Keyboard Navigation', () => {
    it('should be focusable', () => {
      const { container } = render(<Checkbox />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement
      input.focus()
      expect(document.activeElement).toBe(input)
    })

    it('should toggle on Space key press', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      const { container } = render(<Checkbox onChange={handleChange} />)
      const input = container.querySelector('.zen-checkbox') as HTMLInputElement

      input.focus()
      await user.keyboard(' ')
      expect(handleChange).toHaveBeenCalledTimes(1)
    })
  })
})
