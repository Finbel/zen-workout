import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Box } from './Box'
import {
  BOX_PADDING_BASE,
  BOX_PADDING_XS,
  BOX_PADDING_SM,
  BOX_PADDING_MD,
  BOX_PADDING_LG,
  BOX_PADDING_HORIZONTAL_BASE,
  BOX_PADDING_HORIZONTAL_MD,
  BOX_PADDING_VERTICAL_BASE,
  BOX_PADDING_VERTICAL_MD,
} from './boxConstants'

describe('Box', () => {
  describe('Component Rendering', () => {
    it('should render with children', () => {
      const { getByText } = render(<Box>Test Content</Box>)
      expect(getByText('Test Content')).toBeInTheDocument()
    })

    it('should render with default props', () => {
      const { container } = render(<Box />)
      const element = container.querySelector('.zen-box')
      expect(element).toBeInTheDocument()
    })

    it('should apply base class name', () => {
      const { container } = render(<Box />)
      const element = container.querySelector('.zen-box')
      expect(element).toHaveClass('zen-box')
    })
  })

  describe('CSS Custom Properties', () => {
    it('should set correct CSS custom properties for responsive padding', () => {
      const { container } = render(
        <Box padding={{ base: 'sm', md: 'lg' }}>
          <div>Content</div>
        </Box>,
      )
      const element = container.querySelector('.zen-box') as HTMLElement

      // Check base value
      const baseValue =
        getComputedStyle(element).getPropertyValue(BOX_PADDING_BASE)
      expect(baseValue.trim()).toBe('var(--space-2)')

      // Check md value
      const mdValue = getComputedStyle(element).getPropertyValue(BOX_PADDING_MD)
      expect(mdValue.trim()).toBe('var(--space-6)')
    })

    it('should set correct CSS custom properties for simple padding value', () => {
      const { container } = render(<Box padding="md">Content</Box>)
      const element = container.querySelector('.zen-box') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(BOX_PADDING_BASE)
      expect(baseValue.trim()).toBe('var(--space-4)')
    })

    it('should set correct CSS custom properties for responsive paddingHorizontal', () => {
      const { container } = render(
        <Box paddingHorizontal={{ base: 'xs', md: 'xl' }}>
          <div>Content</div>
        </Box>,
      )
      const element = container.querySelector('.zen-box') as HTMLElement

      const baseValue = getComputedStyle(element).getPropertyValue(
        BOX_PADDING_HORIZONTAL_BASE,
      )
      expect(baseValue.trim()).toBe('var(--space-1)')

      const mdValue = getComputedStyle(element).getPropertyValue(
        BOX_PADDING_HORIZONTAL_MD,
      )
      expect(mdValue.trim()).toBe('var(--space-8)')
    })

    it('should set correct CSS custom properties for responsive paddingVertical', () => {
      const { container } = render(
        <Box paddingVertical={{ base: 'sm', md: 'lg' }}>
          <div>Content</div>
        </Box>,
      )
      const element = container.querySelector('.zen-box') as HTMLElement

      const baseValue = getComputedStyle(element).getPropertyValue(
        BOX_PADDING_VERTICAL_BASE,
      )
      expect(baseValue.trim()).toBe('var(--space-2)')

      const mdValue = getComputedStyle(element).getPropertyValue(
        BOX_PADDING_VERTICAL_MD,
      )
      expect(mdValue.trim()).toBe('var(--space-6)')
    })

    it('should set CSS custom properties for all breakpoints', () => {
      const { container } = render(
        <Box
          padding={{
            base: 'xs',
            xs: 'sm',
            sm: 'md',
            md: 'lg',
            lg: 'xl',
          }}
        >
          <div>Content</div>
        </Box>,
      )
      const element = container.querySelector('.zen-box') as HTMLElement

      expect(
        getComputedStyle(element).getPropertyValue(BOX_PADDING_BASE).trim(),
      ).toBe('var(--space-1)')
      expect(
        getComputedStyle(element).getPropertyValue(BOX_PADDING_XS).trim(),
      ).toBe('var(--space-2)')
      expect(
        getComputedStyle(element).getPropertyValue(BOX_PADDING_SM).trim(),
      ).toBe('var(--space-4)')
      expect(
        getComputedStyle(element).getPropertyValue(BOX_PADDING_MD).trim(),
      ).toBe('var(--space-6)')
      expect(
        getComputedStyle(element).getPropertyValue(BOX_PADDING_LG).trim(),
      ).toBe('var(--space-8)')
    })
  })

  describe('Data Attributes', () => {
    it('should set data-has-responsive-padding attribute when using responsive padding', () => {
      const { container } = render(
        <Box padding={{ base: 'sm', md: 'lg' }}>
          <div>Content</div>
        </Box>,
      )
      const element = container.querySelector('.zen-box')

      expect(element).toHaveAttribute('data-has-responsive-padding', 'true')
    })

    it('should not set data attribute for simple (non-responsive) values', () => {
      const { container } = render(<Box padding="sm">Content</Box>)
      const element = container.querySelector('.zen-box')

      expect(element).not.toHaveAttribute('data-has-responsive-padding')
    })

    it('should set data attributes for all responsive props', () => {
      const { container } = render(
        <Box
          padding={{ base: 'sm', md: 'lg' }}
          paddingHorizontal={{ base: 'xs', md: 'xl' }}
          paddingVertical={{ base: 'sm', md: 'lg' }}
        >
          <div>Content</div>
        </Box>,
      )
      const element = container.querySelector('.zen-box')

      expect(element).toHaveAttribute('data-has-responsive-padding', 'true')
      expect(element).toHaveAttribute(
        'data-has-responsive-padding-horizontal',
        'true',
      )
      expect(element).toHaveAttribute(
        'data-has-responsive-padding-vertical',
        'true',
      )
    })

    it('should only set data attributes for responsive props that are actually responsive', () => {
      const { container } = render(
        <Box padding="sm" paddingHorizontal={{ base: 'xs', md: 'xl' }}>
          <div>Content</div>
        </Box>,
      )
      const element = container.querySelector('.zen-box')

      expect(element).not.toHaveAttribute('data-has-responsive-padding')
      expect(element).toHaveAttribute(
        'data-has-responsive-padding-horizontal',
        'true',
      )
    })
  })

  describe('Class Names', () => {
    it('should apply class name for simple padding value', () => {
      const { container } = render(<Box padding="md">Content</Box>)
      const element = container.querySelector('.zen-box')

      expect(element).toHaveClass('zen-box--p-md')
    })

    it('should apply class name for simple paddingHorizontal value', () => {
      const { container } = render(<Box paddingHorizontal="lg">Content</Box>)
      const element = container.querySelector('.zen-box')

      expect(element).toHaveClass('zen-box--px-lg')
    })

    it('should apply class name for simple paddingVertical value', () => {
      const { container } = render(<Box paddingVertical="sm">Content</Box>)
      const element = container.querySelector('.zen-box')

      expect(element).toHaveClass('zen-box--py-sm')
    })

    it('should not apply class name for responsive padding values', () => {
      const { container } = render(
        <Box padding={{ base: 'sm', md: 'lg' }}>Content</Box>,
      )
      const element = container.querySelector('.zen-box')

      expect(element).not.toHaveClass('zen-box--p-sm')
      expect(element).not.toHaveClass('zen-box--p-lg')
    })

    it('should apply multiple class names for different props', () => {
      const { container } = render(
        <Box padding="md" paddingHorizontal="lg" paddingVertical="sm">
          Content
        </Box>,
      )
      const element = container.querySelector('.zen-box')

      expect(element).toHaveClass('zen-box--p-md')
      expect(element).toHaveClass('zen-box--px-lg')
      expect(element).toHaveClass('zen-box--py-sm')
    })
  })

  describe('Responsive Behavior', () => {
    it('should apply correct values at base breakpoint', () => {
      const { container } = render(
        <Box padding={{ base: 'sm', md: 'md' }}>
          <div>Content</div>
        </Box>,
      )
      const element = container.querySelector('.zen-box') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(BOX_PADDING_BASE)
      expect(baseValue.trim()).toBe('var(--space-2)')
    })

    it('should set breakpoint-specific values', () => {
      const { container } = render(
        <Box padding={{ base: 'sm', md: 'md' }}>
          <div>Content</div>
        </Box>,
      )
      const element = container.querySelector('.zen-box') as HTMLElement

      const mdValue = getComputedStyle(element).getPropertyValue(BOX_PADDING_MD)
      expect(mdValue.trim()).toBe('var(--space-4)')
    })

    it('should handle undefined breakpoint values', () => {
      const { container } = render(
        <Box padding={{ base: 'sm', lg: 'xl' }}>
          <div>Content</div>
        </Box>,
      )
      const element = container.querySelector('.zen-box') as HTMLElement

      // Base should be set
      const baseValue =
        getComputedStyle(element).getPropertyValue(BOX_PADDING_BASE)
      expect(baseValue.trim()).toBe('var(--space-2)')

      // lg should be set
      const lgValue = getComputedStyle(element).getPropertyValue(BOX_PADDING_LG)
      expect(lgValue.trim()).toBe('var(--space-8)')

      // md should not be set (undefined)
      const mdValue = getComputedStyle(element).getPropertyValue(BOX_PADDING_MD)
      expect(mdValue.trim()).toBe('')
    })
  })

  describe('Edge Cases', () => {
    it('should handle padding="none"', () => {
      const { container } = render(<Box padding="none">Content</Box>)
      const element = container.querySelector('.zen-box') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(BOX_PADDING_BASE)
      expect(baseValue.trim()).toBe('0')
    })

    it('should handle responsive padding with "none"', () => {
      const { container } = render(
        <Box padding={{ base: 'none', md: 'sm' }}>
          <div>Content</div>
        </Box>,
      )
      const element = container.querySelector('.zen-box') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(BOX_PADDING_BASE)
      expect(baseValue.trim()).toBe('0')

      const mdValue = getComputedStyle(element).getPropertyValue(BOX_PADDING_MD)
      expect(mdValue.trim()).toBe('var(--space-2)')
    })

    it('should handle undefined props', () => {
      const { container } = render(<Box>Content</Box>)
      const element = container.querySelector('.zen-box') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(BOX_PADDING_BASE)
      expect(baseValue.trim()).toBe('')
    })

    it('should merge custom className', () => {
      const { container } = render(<Box className="custom-class">Content</Box>)
      const element = container.querySelector('.zen-box')

      expect(element).toHaveClass('zen-box')
      expect(element).toHaveClass('custom-class')
    })

    it('should merge custom style', () => {
      const { container } = render(
        <Box style={{ backgroundColor: 'red' }}>Content</Box>,
      )
      const element = container.querySelector('.zen-box') as HTMLElement

      const style = getComputedStyle(element)
      expect(style.backgroundColor).toBe('red')
    })
  })
})
