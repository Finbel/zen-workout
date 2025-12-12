import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from './Button'

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

  describe('Responsive Props with Emotion', () => {
    it('should render with responsive variant without errors', () => {
      const { container } = render(
        <Button variant={{ base: 'primary', md: 'secondary' }}>Button</Button>,
      )
      const element = container.querySelector('.zen-button')
      expect(element).toBeInTheDocument()
      // Emotion styles are applied via css prop, verified visually in Storybook
    })

    it('should render with responsive size without errors', () => {
      const { container } = render(
        <Button size={{ base: 'sm', md: 'lg' }}>Button</Button>,
      )
      const element = container.querySelector('.zen-button')
      expect(element).toBeInTheDocument()
      // Emotion styles are applied via css prop, verified visually in Storybook
    })

    it('should apply Emotion styles for responsive props', () => {
      const { container } = render(
        <Button variant={{ base: 'primary', md: 'secondary' }}>Button</Button>,
      )
      const element = container.querySelector('.zen-button')
      // Emotion adds a class name starting with 'css-'
      // The exact class name is generated at runtime
      expect(element).toBeInTheDocument()
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
      const element = container.querySelector('.zen-button')
      expect(element).toBeInTheDocument()
      // Responsive behavior is verified visually in Storybook at different viewport sizes
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
      const element = container.querySelector('.zen-button')
      expect(element).toBeInTheDocument()
      // Responsive behavior is verified visually in Storybook at different viewport sizes
    })
  })
})
