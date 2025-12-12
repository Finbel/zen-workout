import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TextInput } from './TextInput'

describe('TextInput', () => {
  describe('Component Rendering', () => {
    it('should render with default props', () => {
      const { container } = render(<TextInput />)
      const element = container.querySelector('.zen-text-input')
      expect(element).toBeInTheDocument()
    })

    it('should render with placeholder', () => {
      const { getByPlaceholderText } = render(
        <TextInput placeholder="Enter text" />,
      )
      expect(getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('should apply base class name', () => {
      const { container } = render(<TextInput />)
      const element = container.querySelector('.zen-text-input')
      expect(element).toHaveClass('zen-text-input')
    })

    it('should render wrapper element', () => {
      const { container } = render(<TextInput />)
      const wrapper = container.querySelector('.zen-text-input-wrapper')
      expect(wrapper).toBeInTheDocument()
    })
  })

  describe('Input Types', () => {
    it('should render with text type by default', () => {
      const { container } = render(<TextInput />)
      const element = container.querySelector(
        '.zen-text-input',
      ) as HTMLInputElement
      expect(element.type).toBe('text')
    })

    it('should render with specified type', () => {
      const types = [
        'password',
        'email',
        'search',
        'url',
        'tel',
        'number',
      ] as const
      types.forEach((type) => {
        const { container } = render(<TextInput type={type} />)
        const element = container.querySelector(
          '.zen-text-input',
        ) as HTMLInputElement
        expect(element.type).toBe(type)
      })
    })
  })

  describe('Sizes', () => {
    it('should apply size class correctly', () => {
      const { container } = render(<TextInput size="md" />)
      const element = container.querySelector('.zen-text-input')
      expect(element).toHaveClass('zen-text-input--md')
    })

    it('should apply all size classes', () => {
      const sizes = ['sm', 'md', 'lg'] as const
      sizes.forEach((size) => {
        const { container } = render(<TextInput size={size} />)
        const element = container.querySelector('.zen-text-input')
        expect(element).toHaveClass(`zen-text-input--${size}`)
      })
    })
  })

  describe('CSS Custom Properties for Responsive Props', () => {
    it('should set correct CSS custom properties for responsive size', () => {
      const { container } = render(
        <TextInput size={{ base: 'sm', md: 'lg' }} />,
      )
      const element = container.querySelector('.zen-text-input') as HTMLElement

      // Check base value
      const baseValue = getComputedStyle(element).getPropertyValue(
        '--text-input-size-base',
      )
      expect(baseValue.trim()).toBe('sm')

      // Check md value
      const mdValue = getComputedStyle(element).getPropertyValue(
        '--text-input-size-md',
      )
      expect(mdValue.trim()).toBe('lg')
    })

    it('should set CSS custom properties for simple (non-responsive) size', () => {
      const { container } = render(<TextInput size="md" />)
      const element = container.querySelector('.zen-text-input') as HTMLElement

      const baseValue = getComputedStyle(element).getPropertyValue(
        '--text-input-size-base',
      )
      expect(baseValue.trim()).toBe('md')
    })
  })

  describe('Data Attributes for Responsive Props', () => {
    it('should set data-has-responsive-size attribute when using responsive size', () => {
      const { container } = render(
        <TextInput size={{ base: 'sm', md: 'lg' }} />,
      )
      const element = container.querySelector('.zen-text-input')

      expect(element).toHaveAttribute('data-has-responsive-size', 'true')
    })

    it('should not set data attribute for simple (non-responsive) size', () => {
      const { container } = render(<TextInput size="md" />)
      const element = container.querySelector('.zen-text-input')

      expect(element).not.toHaveAttribute('data-has-responsive-size')
    })

    it('should set breakpoint-specific data attributes for responsive size', () => {
      const { container } = render(
        <TextInput size={{ base: 'sm', md: 'md', lg: 'lg' }} />,
      )
      const element = container.querySelector('.zen-text-input')

      expect(element).toHaveAttribute('data-size-base', 'sm')
      expect(element).toHaveAttribute('data-size-md', 'md')
      expect(element).toHaveAttribute('data-size-lg', 'lg')
    })
  })

  describe('Class Names with Responsive Props', () => {
    it('should not apply size class for responsive size', () => {
      const { container } = render(
        <TextInput size={{ base: 'sm', md: 'lg' }} />,
      )
      const element = container.querySelector('.zen-text-input')

      // Should not have class-based size when using responsive
      expect(element).not.toHaveClass('zen-text-input--sm')
      expect(element).not.toHaveClass('zen-text-input--lg')
    })

    it('should apply size class for simple (non-responsive) size', () => {
      const { container } = render(<TextInput size="md" />)
      const element = container.querySelector('.zen-text-input')

      expect(element).toHaveClass('zen-text-input--md')
    })
  })

  describe('Error State', () => {
    it('should apply error class when error is true', () => {
      const { container } = render(<TextInput error />)
      const element = container.querySelector('.zen-text-input')
      expect(element).toHaveClass('zen-text-input--error')
    })

    it('should apply wrapper error class when error is true', () => {
      const { container } = render(<TextInput error />)
      const wrapper = container.querySelector('.zen-text-input-wrapper')
      expect(wrapper).toHaveClass('zen-text-input-wrapper--error')
    })

    it('should set aria-invalid attribute when error is true', () => {
      const { container } = render(<TextInput error />)
      const element = container.querySelector('.zen-text-input')
      expect(element).toHaveAttribute('aria-invalid', 'true')
    })

    it('should not set aria-invalid attribute when error is false', () => {
      const { container } = render(<TextInput error={false} />)
      const element = container.querySelector('.zen-text-input')
      expect(element).toHaveAttribute('aria-invalid', 'false')
    })
  })

  describe('Disabled State', () => {
    it('should apply disabled attribute', () => {
      const { container } = render(<TextInput disabled />)
      const element = container.querySelector('.zen-text-input')
      expect(element).toBeDisabled()
    })

    it('should not be disabled by default', () => {
      const { container } = render(<TextInput />)
      const element = container.querySelector('.zen-text-input')
      expect(element).not.toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should forward ref to input element', () => {
      const ref = { current: null }
      render(<TextInput ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })

    it('should support native input attributes', () => {
      const { container } = render(
        <TextInput id="test-input" name="test" value="test value" />,
      )
      const element = container.querySelector(
        '.zen-text-input',
      ) as HTMLInputElement
      expect(element.id).toBe('test-input')
      expect(element.name).toBe('test')
      expect(element.value).toBe('test value')
    })
  })

  describe('Responsive Behavior', () => {
    it('should handle responsive size with multiple breakpoints', () => {
      const { container } = render(
        <TextInput
          size={{
            base: 'sm',
            xs: 'md',
            sm: 'lg',
            md: 'sm',
            lg: 'md',
          }}
        />,
      )
      const element = container.querySelector('.zen-text-input') as HTMLElement

      const baseValue = getComputedStyle(element).getPropertyValue(
        '--text-input-size-base',
      )
      expect(baseValue.trim()).toBe('sm')

      expect(element).toHaveAttribute('data-size-base', 'sm')
    })
  })
})
