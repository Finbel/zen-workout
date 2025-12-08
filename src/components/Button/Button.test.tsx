import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from './Button'
import {
  BUTTON_VARIANT_BASE,
  BUTTON_VARIANT_MD,
  BUTTON_SIZE_BASE,
  BUTTON_SIZE_MD,
} from './buttonConstants'

describe('Button', () => {
  describe('Component Rendering', () => {
    it('should render with children', () => {
      const { getByText } = render(<Button>Test Button</Button>)
      expect(getByText('Test Button')).toBeInTheDocument()
    })

    it('should render with default props', () => {
      const { container } = render(<Button>Button</Button>)
      const element = container.querySelector('.zen-button')
      expect(element).toBeInTheDocument()
    })

    it('should apply base class name', () => {
      const { container } = render(<Button>Button</Button>)
      const element = container.querySelector('.zen-button')
      expect(element).toHaveClass('zen-button')
    })
  })

  describe('Variants', () => {
    it('should apply variant class correctly', () => {
      const { container } = render(<Button variant="primary">Button</Button>)
      const element = container.querySelector('.zen-button')
      expect(element).toHaveClass('zen-button--primary')
    })

    it('should apply all variant classes', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'] as const
      variants.forEach((variant) => {
        const { container } = render(<Button variant={variant}>Button</Button>)
        const element = container.querySelector('.zen-button')
        expect(element).toHaveClass(`zen-button--${variant}`)
      })
    })
  })

  describe('Sizes', () => {
    it('should apply size class correctly', () => {
      const { container } = render(<Button size="md">Button</Button>)
      const element = container.querySelector('.zen-button')
      expect(element).toHaveClass('zen-button--md')
    })

    it('should apply all size classes', () => {
      const sizes = ['sm', 'md', 'lg'] as const
      sizes.forEach((size) => {
        const { container } = render(<Button size={size}>Button</Button>)
        const element = container.querySelector('.zen-button')
        expect(element).toHaveClass(`zen-button--${size}`)
      })
    })
  })

  describe('CSS Custom Properties for Responsive Props', () => {
    it('should set correct CSS custom properties for responsive variant', () => {
      const { container } = render(
        <Button variant={{ base: 'primary', md: 'secondary' }}>Button</Button>,
      )
      const element = container.querySelector('.zen-button') as HTMLElement

      // Check base value
      const baseValue =
        getComputedStyle(element).getPropertyValue(BUTTON_VARIANT_BASE)
      expect(baseValue.trim()).toBe('primary')

      // Check md value
      const mdValue =
        getComputedStyle(element).getPropertyValue(BUTTON_VARIANT_MD)
      expect(mdValue.trim()).toBe('secondary')
    })

    it('should set correct CSS custom properties for responsive size', () => {
      const { container } = render(
        <Button size={{ base: 'sm', md: 'lg' }}>Button</Button>,
      )
      const element = container.querySelector('.zen-button') as HTMLElement

      // Check base value
      const baseValue =
        getComputedStyle(element).getPropertyValue(BUTTON_SIZE_BASE)
      expect(baseValue.trim()).toBe('sm')

      // Check md value
      const mdValue = getComputedStyle(element).getPropertyValue(BUTTON_SIZE_MD)
      expect(mdValue.trim()).toBe('lg')
    })

    it('should set CSS custom properties for simple (non-responsive) variant', () => {
      const { container } = render(<Button variant="primary">Button</Button>)
      const element = container.querySelector('.zen-button') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(BUTTON_VARIANT_BASE)
      expect(baseValue.trim()).toBe('primary')
    })

    it('should set CSS custom properties for simple (non-responsive) size', () => {
      const { container } = render(<Button size="md">Button</Button>)
      const element = container.querySelector('.zen-button') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(BUTTON_SIZE_BASE)
      expect(baseValue.trim()).toBe('md')
    })
  })

  describe('Data Attributes for Responsive Props', () => {
    it('should set data-has-responsive-variant attribute when using responsive variant', () => {
      const { container } = render(
        <Button variant={{ base: 'primary', md: 'secondary' }}>Button</Button>,
      )
      const element = container.querySelector('.zen-button')

      expect(element).toHaveAttribute('data-has-responsive-variant', 'true')
    })

    it('should set data-has-responsive-size attribute when using responsive size', () => {
      const { container } = render(
        <Button size={{ base: 'sm', md: 'lg' }}>Button</Button>,
      )
      const element = container.querySelector('.zen-button')

      expect(element).toHaveAttribute('data-has-responsive-size', 'true')
    })

    it('should not set data attribute for simple (non-responsive) variant', () => {
      const { container } = render(<Button variant="primary">Button</Button>)
      const element = container.querySelector('.zen-button')

      expect(element).not.toHaveAttribute('data-has-responsive-variant')
    })

    it('should not set data attribute for simple (non-responsive) size', () => {
      const { container } = render(<Button size="md">Button</Button>)
      const element = container.querySelector('.zen-button')

      expect(element).not.toHaveAttribute('data-has-responsive-size')
    })

    it('should set breakpoint-specific data attributes for responsive variant', () => {
      const { container } = render(
        <Button variant={{ base: 'primary', md: 'secondary', lg: 'outline' }}>
          Button
        </Button>,
      )
      const element = container.querySelector('.zen-button')

      expect(element).toHaveAttribute('data-variant-base', 'primary')
      expect(element).toHaveAttribute('data-variant-md', 'secondary')
      expect(element).toHaveAttribute('data-variant-lg', 'outline')
    })

    it('should set breakpoint-specific data attributes for responsive size', () => {
      const { container } = render(
        <Button size={{ base: 'sm', md: 'md', lg: 'lg' }}>Button</Button>,
      )
      const element = container.querySelector('.zen-button')

      expect(element).toHaveAttribute('data-size-base', 'sm')
      expect(element).toHaveAttribute('data-size-md', 'md')
      expect(element).toHaveAttribute('data-size-lg', 'lg')
    })
  })

  describe('Class Names with Responsive Props', () => {
    it('should not apply variant class for responsive variant', () => {
      const { container } = render(
        <Button variant={{ base: 'primary', md: 'secondary' }}>Button</Button>,
      )
      const element = container.querySelector('.zen-button')

      // Should not have class-based variant when using responsive
      expect(element).not.toHaveClass('zen-button--primary')
      expect(element).not.toHaveClass('zen-button--secondary')
    })

    it('should not apply size class for responsive size', () => {
      const { container } = render(
        <Button size={{ base: 'sm', md: 'lg' }}>Button</Button>,
      )
      const element = container.querySelector('.zen-button')

      // Should not have class-based size when using responsive
      expect(element).not.toHaveClass('zen-button--sm')
      expect(element).not.toHaveClass('zen-button--lg')
    })

    it('should apply variant class for simple (non-responsive) variant', () => {
      const { container } = render(<Button variant="primary">Button</Button>)
      const element = container.querySelector('.zen-button')

      expect(element).toHaveClass('zen-button--primary')
    })

    it('should apply size class for simple (non-responsive) size', () => {
      const { container } = render(<Button size="md">Button</Button>)
      const element = container.querySelector('.zen-button')

      expect(element).toHaveClass('zen-button--md')
    })
  })

  describe('Disabled State', () => {
    it('should apply disabled attribute', () => {
      const { container } = render(<Button disabled>Button</Button>)
      const element = container.querySelector('.zen-button')

      expect(element).toBeDisabled()
    })

    it('should apply disabled class styles', () => {
      const { container } = render(<Button disabled>Button</Button>)
      const element = container.querySelector('.zen-button')

      expect(element).toHaveClass('zen-button')
    })
  })

  describe('Icons', () => {
    it('should render icon on the left', () => {
      const { container } = render(
        <Button icon={{ name: 'plus', position: 'left' }}>Add</Button>,
      )
      const element = container.querySelector('.zen-button')
      expect(element).toBeInTheDocument()
      // Icon component should be rendered (checking structure)
      expect(element?.children.length).toBeGreaterThan(0)
    })

    it('should render icon on the right', () => {
      const { container } = render(
        <Button icon={{ name: 'arrow-right', position: 'right' }}>
          Continue
        </Button>,
      )
      const element = container.querySelector('.zen-button')
      expect(element).toBeInTheDocument()
      // Icon component should be rendered (checking structure)
      expect(element?.children.length).toBeGreaterThan(0)
    })
  })

  describe('Responsive Behavior', () => {
    it('should handle responsive variant with multiple breakpoints', () => {
      const { container } = render(
        <Button
          variant={{
            base: 'primary',
            xs: 'secondary',
            sm: 'outline',
            md: 'ghost',
            lg: 'primary',
          }}
        >
          Button
        </Button>,
      )
      const element = container.querySelector('.zen-button') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(BUTTON_VARIANT_BASE)
      expect(baseValue.trim()).toBe('primary')

      expect(element).toHaveAttribute('data-variant-base', 'primary')
    })

    it('should handle responsive size with multiple breakpoints', () => {
      const { container } = render(
        <Button
          size={{
            base: 'sm',
            xs: 'md',
            sm: 'lg',
            md: 'sm',
            lg: 'md',
          }}
        >
          Button
        </Button>,
      )
      const element = container.querySelector('.zen-button') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(BUTTON_SIZE_BASE)
      expect(baseValue.trim()).toBe('sm')

      expect(element).toHaveAttribute('data-size-base', 'sm')
    })
  })
})
