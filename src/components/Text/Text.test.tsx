import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Text } from './Text'

describe('Text', () => {
  describe('Component Rendering', () => {
    it('should render with children', () => {
      const { getByText } = render(<Text>Test Content</Text>)
      expect(getByText('Test Content')).toBeInTheDocument()
    })

    it('should render with default props', () => {
      const { container } = render(<Text />)
      const element = container.querySelector('.zen-text')
      expect(element).toBeInTheDocument()
    })

    it('should apply base class name', () => {
      const { container } = render(<Text />)
      const element = container.querySelector('.zen-text')
      expect(element).toHaveClass('zen-text')
    })

    it('should render as p element', () => {
      const { container } = render(<Text>Content</Text>)
      const element = container.querySelector('p.zen-text')
      expect(element).toBeInTheDocument()
    })
  })

  describe('CSS Custom Properties', () => {
    it('should set correct CSS custom properties for responsive size', () => {
      const { container } = render(
        <Text size={{ base: 'sm', md: 'lg' }}>Content</Text>,
      )
      const element = container.querySelector('.zen-text') as HTMLElement

      // Check base value
      const baseValue =
        getComputedStyle(element).getPropertyValue('--text-size-base')
      expect(baseValue.trim()).toBe('var(--font-size-sm)')

      // Check md value
      const mdValue =
        getComputedStyle(element).getPropertyValue('--text-size-md')
      expect(mdValue.trim()).toBe('var(--font-size-lg)')
    })

    it('should set correct CSS custom properties for simple size value', () => {
      const { container } = render(<Text size="base">Content</Text>)
      const element = container.querySelector('.zen-text') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue('--text-size-base')
      expect(baseValue.trim()).toBe('var(--font-size-base)')
    })

    it('should set CSS custom properties for all breakpoints', () => {
      const { container } = render(
        <Text
          size={{
            base: 'xs',
            xs: 'sm',
            sm: 'base',
            md: 'lg',
            lg: 'xl',
          }}
        >
          Content
        </Text>,
      )
      const element = container.querySelector('.zen-text') as HTMLElement

      expect(
        getComputedStyle(element).getPropertyValue('--text-size-base').trim(),
      ).toBe('var(--font-size-xs)')
      expect(
        getComputedStyle(element).getPropertyValue('--text-size-xs').trim(),
      ).toBe('var(--font-size-sm)')
      expect(
        getComputedStyle(element).getPropertyValue('--text-size-sm').trim(),
      ).toBe('var(--font-size-base)')
      expect(
        getComputedStyle(element).getPropertyValue('--text-size-md').trim(),
      ).toBe('var(--font-size-lg)')
      expect(
        getComputedStyle(element).getPropertyValue('--text-size-lg').trim(),
      ).toBe('var(--font-size-xl)')
    })
  })

  describe('Data Attributes', () => {
    it('should set data-has-responsive-size attribute when using responsive size', () => {
      const { container } = render(
        <Text size={{ base: 'sm', md: 'lg' }}>Content</Text>,
      )
      const element = container.querySelector('.zen-text')

      expect(element).toHaveAttribute('data-has-responsive-size', 'true')
    })

    it('should not set data attribute for simple (non-responsive) values', () => {
      const { container } = render(<Text size="sm">Content</Text>)
      const element = container.querySelector('.zen-text')

      expect(element).not.toHaveAttribute('data-has-responsive-size')
    })
  })

  describe('Class Names', () => {
    it('should apply class name for simple size value', () => {
      const { container } = render(<Text size="lg">Content</Text>)
      const element = container.querySelector('.zen-text')

      expect(element).toHaveClass('zen-text--lg')
    })

    it('should apply default class name when size is base', () => {
      const { container } = render(<Text size="base">Content</Text>)
      const element = container.querySelector('.zen-text')

      expect(element).toHaveClass('zen-text--base')
    })

    it('should not apply class name for responsive size values', () => {
      const { container } = render(
        <Text size={{ base: 'sm', md: 'lg' }}>Content</Text>,
      )
      const element = container.querySelector('.zen-text')

      expect(element).not.toHaveClass('zen-text--sm')
      expect(element).not.toHaveClass('zen-text--lg')
    })

    it('should apply class name for all size variants', () => {
      const sizes: Array<
        'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
      > = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']

      sizes.forEach((size) => {
        const { container } = render(<Text size={size}>Content</Text>)
        const element = container.querySelector('.zen-text')
        expect(element).toHaveClass(`zen-text--${size}`)
      })
    })
  })

  describe('Responsive Behavior', () => {
    it('should apply correct values at base breakpoint', () => {
      const { container } = render(
        <Text size={{ base: 'sm', md: 'base' }}>Content</Text>,
      )
      const element = container.querySelector('.zen-text') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue('--text-size-base')
      expect(baseValue.trim()).toBe('var(--font-size-sm)')
    })

    it('should set breakpoint-specific values', () => {
      const { container } = render(
        <Text size={{ base: 'sm', md: 'base' }}>Content</Text>,
      )
      const element = container.querySelector('.zen-text') as HTMLElement

      const mdValue =
        getComputedStyle(element).getPropertyValue('--text-size-md')
      expect(mdValue.trim()).toBe('var(--font-size-base)')
    })

    it('should handle undefined breakpoint values', () => {
      const { container } = render(
        <Text size={{ base: 'sm', lg: 'xl' }}>Content</Text>,
      )
      const element = container.querySelector('.zen-text') as HTMLElement

      // Base should be set
      const baseValue =
        getComputedStyle(element).getPropertyValue('--text-size-base')
      expect(baseValue.trim()).toBe('var(--font-size-sm)')

      // lg should be set
      const lgValue =
        getComputedStyle(element).getPropertyValue('--text-size-lg')
      expect(lgValue.trim()).toBe('var(--font-size-xl)')

      // md should not be set (undefined)
      const mdValue =
        getComputedStyle(element).getPropertyValue('--text-size-md')
      expect(mdValue.trim()).toBe('')
    })
  })

  describe('Edge Cases', () => {
    it('should handle default size', () => {
      const { container } = render(<Text>Content</Text>)
      const element = container.querySelector('.zen-text') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue('--text-size-base')
      expect(baseValue.trim()).toBe('var(--font-size-base)')
    })

    it('should merge custom className', () => {
      const { container } = render(
        <Text className="custom-class">Content</Text>,
      )
      const element = container.querySelector('.zen-text')

      expect(element).toHaveClass('zen-text')
      expect(element).toHaveClass('custom-class')
    })

    it('should merge custom style', () => {
      const { container } = render(
        <Text style={{ color: 'red' }}>Content</Text>,
      )
      const element = container.querySelector('.zen-text') as HTMLElement

      const style = getComputedStyle(element)
      // getComputedStyle returns RGB values, not color names
      expect(style.color).toBe('rgb(255, 0, 0)')
    })
  })
})
