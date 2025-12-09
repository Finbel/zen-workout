import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Heading } from './Heading'

describe('Heading', () => {
  describe('Component Rendering', () => {
    it('should render with children', () => {
      const { getByText } = render(<Heading>Test Content</Heading>)
      expect(getByText('Test Content')).toBeInTheDocument()
    })

    it('should render with default props', () => {
      const { container } = render(<Heading />)
      const element = container.querySelector('.zen-heading')
      expect(element).toBeInTheDocument()
    })

    it('should apply base class name', () => {
      const { container } = render(<Heading />)
      const element = container.querySelector('.zen-heading')
      expect(element).toHaveClass('zen-heading')
    })

    it('should render as h1 element by default', () => {
      const { container } = render(<Heading>Content</Heading>)
      const element = container.querySelector('h1.zen-heading')
      expect(element).toBeInTheDocument()
    })

    it('should render correct element for each level', () => {
      const levels = [1, 2, 3, 4, 5, 6] as const

      levels.forEach((level) => {
        const { container } = render(<Heading level={level}>Content</Heading>)
        const element = container.querySelector(`h${level}.zen-heading`)
        expect(element).toBeInTheDocument()
      })
    })
  })

  describe('CSS Custom Properties', () => {
    it('should set correct CSS custom properties for responsive size', () => {
      const { container } = render(
        <Heading size={{ base: 'lg', md: '3xl' }}>Content</Heading>,
      )
      const element = container.querySelector('.zen-heading') as HTMLElement

      // Check base value
      const baseValue = getComputedStyle(element).getPropertyValue(
        '--heading-size-base',
      )
      expect(baseValue.trim()).toBe('var(--font-size-lg)')

      // Check md value
      const mdValue =
        getComputedStyle(element).getPropertyValue('--heading-size-md')
      expect(mdValue.trim()).toBe('var(--font-size-3xl)')
    })

    it('should set correct CSS custom properties for simple size value', () => {
      const { container } = render(<Heading size="xl">Content</Heading>)
      const element = container.querySelector('.zen-heading') as HTMLElement

      const baseValue = getComputedStyle(element).getPropertyValue(
        '--heading-size-base',
      )
      expect(baseValue.trim()).toBe('var(--font-size-xl)')
    })

    it('should set CSS custom properties for all breakpoints', () => {
      const { container } = render(
        <Heading
          size={{
            base: 'xs',
            xs: 'sm',
            sm: 'base',
            md: 'lg',
            lg: 'xl',
          }}
        >
          Content
        </Heading>,
      )
      const element = container.querySelector('.zen-heading') as HTMLElement

      expect(
        getComputedStyle(element)
          .getPropertyValue('--heading-size-base')
          .trim(),
      ).toBe('var(--font-size-xs)')
      expect(
        getComputedStyle(element).getPropertyValue('--heading-size-xs').trim(),
      ).toBe('var(--font-size-sm)')
      expect(
        getComputedStyle(element).getPropertyValue('--heading-size-sm').trim(),
      ).toBe('var(--font-size-base)')
      expect(
        getComputedStyle(element).getPropertyValue('--heading-size-md').trim(),
      ).toBe('var(--font-size-lg)')
      expect(
        getComputedStyle(element).getPropertyValue('--heading-size-lg').trim(),
      ).toBe('var(--font-size-xl)')
    })
  })

  describe('Data Attributes', () => {
    it('should set data-has-responsive-size attribute when using responsive size', () => {
      const { container } = render(
        <Heading size={{ base: 'lg', md: '3xl' }}>Content</Heading>,
      )
      const element = container.querySelector('.zen-heading')

      expect(element).toHaveAttribute('data-has-responsive-size', 'true')
    })

    it('should not set data attribute for simple (non-responsive) values', () => {
      const { container } = render(<Heading size="lg">Content</Heading>)
      const element = container.querySelector('.zen-heading')

      expect(element).not.toHaveAttribute('data-has-responsive-size')
    })
  })

  describe('Class Names', () => {
    it('should apply class name for level', () => {
      const { container } = render(<Heading level={2}>Content</Heading>)
      const element = container.querySelector('.zen-heading')

      expect(element).toHaveClass('zen-heading--level-2')
    })

    it('should apply class name for all levels', () => {
      const levels = [1, 2, 3, 4, 5, 6] as const

      levels.forEach((level) => {
        const { container } = render(<Heading level={level}>Content</Heading>)
        const element = container.querySelector('.zen-heading')
        expect(element).toHaveClass(`zen-heading--level-${level}`)
      })
    })

    it('should apply class name for simple size value', () => {
      const { container } = render(<Heading size="xl">Content</Heading>)
      const element = container.querySelector('.zen-heading')

      expect(element).toHaveClass('zen-heading--xl')
    })

    it('should apply default class name when size is 2xl', () => {
      const { container } = render(<Heading size="2xl">Content</Heading>)
      const element = container.querySelector('.zen-heading')

      expect(element).toHaveClass('zen-heading--2xl')
    })

    it('should not apply class name for responsive size values', () => {
      const { container } = render(
        <Heading size={{ base: 'lg', md: '3xl' }}>Content</Heading>,
      )
      const element = container.querySelector('.zen-heading')

      expect(element).not.toHaveClass('zen-heading--lg')
      expect(element).not.toHaveClass('zen-heading--3xl')
    })

    it('should apply class names for both level and size', () => {
      const { container } = render(
        <Heading level={2} size="xl">
          Content
        </Heading>,
      )
      const element = container.querySelector('.zen-heading')

      expect(element).toHaveClass('zen-heading--level-2')
      expect(element).toHaveClass('zen-heading--xl')
    })
  })

  describe('Responsive Behavior', () => {
    it('should apply correct values at base breakpoint', () => {
      const { container } = render(
        <Heading size={{ base: 'lg', md: '3xl' }}>Content</Heading>,
      )
      const element = container.querySelector('.zen-heading') as HTMLElement

      const baseValue = getComputedStyle(element).getPropertyValue(
        '--heading-size-base',
      )
      expect(baseValue.trim()).toBe('var(--font-size-lg)')
    })

    it('should set breakpoint-specific values', () => {
      const { container } = render(
        <Heading size={{ base: 'lg', md: '3xl' }}>Content</Heading>,
      )
      const element = container.querySelector('.zen-heading') as HTMLElement

      const mdValue =
        getComputedStyle(element).getPropertyValue('--heading-size-md')
      expect(mdValue.trim()).toBe('var(--font-size-3xl)')
    })

    it('should handle undefined breakpoint values', () => {
      const { container } = render(
        <Heading size={{ base: 'lg', lg: '4xl' }}>Content</Heading>,
      )
      const element = container.querySelector('.zen-heading') as HTMLElement

      // Base should be set
      const baseValue = getComputedStyle(element).getPropertyValue(
        '--heading-size-base',
      )
      expect(baseValue.trim()).toBe('var(--font-size-lg)')

      // lg should be set
      const lgValue =
        getComputedStyle(element).getPropertyValue('--heading-size-lg')
      expect(lgValue.trim()).toBe('var(--font-size-4xl)')

      // md should not be set (undefined)
      const mdValue =
        getComputedStyle(element).getPropertyValue('--heading-size-md')
      expect(mdValue.trim()).toBe('')
    })
  })

  describe('Edge Cases', () => {
    it('should handle default size', () => {
      const { container } = render(<Heading>Content</Heading>)
      const element = container.querySelector('.zen-heading') as HTMLElement

      const baseValue = getComputedStyle(element).getPropertyValue(
        '--heading-size-base',
      )
      expect(baseValue.trim()).toBe('var(--font-size-2xl)')
    })

    it('should handle default level', () => {
      const { container } = render(<Heading>Content</Heading>)
      const element = container.querySelector('.zen-heading')

      expect(element).toHaveClass('zen-heading--level-1')
      expect(container.querySelector('h1')).toBeInTheDocument()
    })

    it('should merge custom className', () => {
      const { container } = render(
        <Heading className="custom-class">Content</Heading>,
      )
      const element = container.querySelector('.zen-heading')

      expect(element).toHaveClass('zen-heading')
      expect(element).toHaveClass('custom-class')
    })

    it('should merge custom style', () => {
      const { container } = render(
        <Heading style={{ color: 'red' }}>Content</Heading>,
      )
      const element = container.querySelector('.zen-heading') as HTMLElement

      const style = getComputedStyle(element)
      // getComputedStyle returns RGB values, not color names
      expect(style.color).toBe('rgb(255, 0, 0)')
    })
  })
})
