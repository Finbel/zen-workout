import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Flex } from './Flex'
import {
  FLEX_GAP_BASE,
  FLEX_GAP_MD,
  FLEX_DIRECTION_BASE,
  FLEX_DIRECTION_MD,
  FLEX_ALIGN_BASE,
  FLEX_ALIGN_MD,
  FLEX_JUSTIFY_BASE,
  FLEX_JUSTIFY_MD,
  FLEX_WRAP_BASE,
  FLEX_WRAP_MD,
} from './flexConstants'

describe('Flex', () => {
  describe('Component Rendering', () => {
    it('should render with children', () => {
      const { getByText } = render(<Flex>Test Content</Flex>)
      expect(getByText('Test Content')).toBeInTheDocument()
    })

    it('should render with default props', () => {
      const { container } = render(<Flex />)
      const element = container.querySelector('.zen-flex')
      expect(element).toBeInTheDocument()
    })

    it('should apply base class name', () => {
      const { container } = render(<Flex />)
      const element = container.querySelector('.zen-flex')
      expect(element).toHaveClass('zen-flex')
    })
  })

  describe('CSS Custom Properties', () => {
    it('should set correct CSS custom properties for responsive gap', () => {
      const { container } = render(
        <Flex gap={{ base: 'sm', md: 'lg' }}>
          <div>Item 1</div>
          <div>Item 2</div>
        </Flex>,
      )
      const element = container.querySelector('.zen-flex') as HTMLElement

      // Check base value
      const baseValue =
        getComputedStyle(element).getPropertyValue(FLEX_GAP_BASE)
      expect(baseValue.trim()).toBe('var(--space-2)')

      // Check md value
      const mdValue = getComputedStyle(element).getPropertyValue(FLEX_GAP_MD)
      expect(mdValue.trim()).toBe('var(--space-6)')
    })

    it('should set correct CSS custom properties for responsive direction', () => {
      const { container } = render(
        <Flex direction={{ base: 'row', md: 'column' }}>
          <div>Item 1</div>
          <div>Item 2</div>
        </Flex>,
      )
      const element = container.querySelector('.zen-flex') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(FLEX_DIRECTION_BASE)
      expect(baseValue.trim()).toBe('row')

      const mdValue =
        getComputedStyle(element).getPropertyValue(FLEX_DIRECTION_MD)
      expect(mdValue.trim()).toBe('column')
    })

    it('should set correct CSS custom properties for responsive align', () => {
      const { container } = render(
        <Flex align={{ base: 'start', md: 'center' }}>
          <div>Item 1</div>
          <div>Item 2</div>
        </Flex>,
      )
      const element = container.querySelector('.zen-flex') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(FLEX_ALIGN_BASE)
      expect(baseValue.trim()).toBe('flex-start')

      const mdValue = getComputedStyle(element).getPropertyValue(FLEX_ALIGN_MD)
      expect(mdValue.trim()).toBe('center')
    })

    it('should set correct CSS custom properties for responsive justify', () => {
      const { container } = render(
        <Flex justify={{ base: 'start', md: 'between' }}>
          <div>Item 1</div>
          <div>Item 2</div>
        </Flex>,
      )
      const element = container.querySelector('.zen-flex') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(FLEX_JUSTIFY_BASE)
      expect(baseValue.trim()).toBe('flex-start')

      const mdValue =
        getComputedStyle(element).getPropertyValue(FLEX_JUSTIFY_MD)
      expect(mdValue.trim()).toBe('space-between')
    })

    it('should set correct CSS custom properties for responsive wrap', () => {
      const { container } = render(
        <Flex wrap={{ base: false, md: true }}>
          <div>Item 1</div>
          <div>Item 2</div>
        </Flex>,
      )
      const element = container.querySelector('.zen-flex') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(FLEX_WRAP_BASE)
      expect(baseValue.trim()).toBe('nowrap')

      const mdValue = getComputedStyle(element).getPropertyValue(FLEX_WRAP_MD)
      expect(mdValue.trim()).toBe('wrap')
    })
  })

  describe('Data Attributes', () => {
    it('should set data-has-responsive-gap attribute when using responsive gap', () => {
      const { container } = render(
        <Flex gap={{ base: 'sm', md: 'lg' }}>
          <div>Item 1</div>
        </Flex>,
      )
      const element = container.querySelector('.zen-flex')

      expect(element).toHaveAttribute('data-has-responsive-gap', 'true')
    })

    it('should not set data attribute for simple (non-responsive) values', () => {
      const { container } = render(<Flex gap="sm">Item</Flex>)
      const element = container.querySelector('.zen-flex')

      expect(element).not.toHaveAttribute('data-has-responsive-gap')
    })

    it('should set data attributes for all responsive props', () => {
      const { container } = render(
        <Flex
          gap={{ base: 'sm', md: 'lg' }}
          direction={{ base: 'row', md: 'column' }}
          align={{ base: 'start', md: 'center' }}
          justify={{ base: 'start', md: 'between' }}
          wrap={{ base: false, md: true }}
        >
          <div>Item</div>
        </Flex>,
      )
      const element = container.querySelector('.zen-flex')

      expect(element).toHaveAttribute('data-has-responsive-gap', 'true')
      expect(element).toHaveAttribute('data-has-responsive-direction', 'true')
      expect(element).toHaveAttribute('data-has-responsive-align', 'true')
      expect(element).toHaveAttribute('data-has-responsive-justify', 'true')
      expect(element).toHaveAttribute('data-has-responsive-wrap', 'true')
    })
  })

  describe('Responsive Behavior', () => {
    it('should apply correct values at base breakpoint', () => {
      const { container } = render(
        <Flex gap={{ base: 'sm', md: 'md' }}>
          <div>Item 1</div>
        </Flex>,
      )
      const element = container.querySelector('.zen-flex') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(FLEX_GAP_BASE)
      expect(baseValue.trim()).toBe('var(--space-2)')
    })

    it('should set breakpoint-specific values', () => {
      const { container } = render(
        <Flex gap={{ base: 'sm', md: 'md' }}>
          <div>Item 1</div>
        </Flex>,
      )
      const element = container.querySelector('.zen-flex') as HTMLElement

      const mdValue = getComputedStyle(element).getPropertyValue(FLEX_GAP_MD)
      expect(mdValue.trim()).toBe('var(--space-4)')
    })

    it('should have correct fallback chain structure', () => {
      const { container } = render(
        <Flex gap={{ base: 'sm', md: 'md' }}>
          <div>Item 1</div>
        </Flex>,
      )
      const element = container.querySelector('.zen-flex') as HTMLElement

      // Verify base is set
      const base = getComputedStyle(element).getPropertyValue(FLEX_GAP_BASE)
      expect(base.trim()).toBe('var(--space-2)')

      // Verify md is set
      const md = getComputedStyle(element).getPropertyValue(FLEX_GAP_MD)
      expect(md.trim()).toBe('var(--space-4)')

      // Verify xs is not set (should be empty)
      const xs = getComputedStyle(element).getPropertyValue('--flex-gap-xs')
      expect(xs.trim()).toBe('')
    })
  })

  describe('CSS Variable Resolution', () => {
    it('should have root-level tokens defined with correct values', () => {
      const rootStyles = getComputedStyle(document.documentElement)

      const space2 = rootStyles.getPropertyValue('--space-2')
      const space4 = rootStyles.getPropertyValue('--space-4')
      const space6 = rootStyles.getPropertyValue('--space-6')

      // Verify tokens exist (values may vary, but should be truthy)
      expect(space2.trim()).toBeTruthy()
      expect(space4.trim()).toBeTruthy()
      expect(space6.trim()).toBeTruthy()
    })

    it('should set component-level variables that reference root tokens', () => {
      const { container } = render(
        <Flex gap={{ base: 'sm', md: 'lg' }}>
          <div>Item 1</div>
        </Flex>,
      )
      const element = container.querySelector('.zen-flex') as HTMLElement
      const elementStyles = getComputedStyle(element)

      const baseValue = elementStyles.getPropertyValue(FLEX_GAP_BASE)
      expect(baseValue.trim()).toBe('var(--space-2)')

      // Verify root token exists
      const rootStyles = getComputedStyle(document.documentElement)
      const rootSpace2 = rootStyles.getPropertyValue('--space-2')
      expect(rootSpace2.trim()).toBeTruthy()
    })
  })

  describe('Component Props and Variants', () => {
    it('should apply gap class correctly', () => {
      const { container } = render(<Flex gap="md">Item</Flex>)
      const element = container.querySelector('.zen-flex')

      expect(element).toHaveClass('zen-flex--gap-md')
    })

    it('should apply direction class correctly', () => {
      const { container } = render(<Flex direction="column">Item</Flex>)
      const element = container.querySelector('.zen-flex')

      expect(element).toHaveClass('zen-flex--column')
    })

    it('should apply wrap class correctly', () => {
      const { container } = render(<Flex wrap={true}>Item</Flex>)
      const element = container.querySelector('.zen-flex')

      expect(element).toHaveClass('zen-flex--wrap')
    })

    it('should apply align class correctly', () => {
      const { container } = render(<Flex align="center">Item</Flex>)
      const element = container.querySelector('.zen-flex')

      expect(element).toHaveClass('zen-flex--align-center')
    })

    it('should apply justify class correctly', () => {
      const { container } = render(<Flex justify="between">Item</Flex>)
      const element = container.querySelector('.zen-flex')

      expect(element).toHaveClass('zen-flex--justify-between')
    })

    it('should handle default props', () => {
      const { container } = render(<Flex>Item</Flex>)
      const element = container.querySelector('.zen-flex')

      // Default gap is 'md'
      expect(element).toHaveClass('zen-flex--gap-md')
      // Default wrap is true
      expect(element).toHaveClass('zen-flex--wrap')
      // Default direction is 'row'
      expect(element).toHaveClass('zen-flex--row')
    })
  })

  describe('Normalization Functions', () => {
    it('should convert gap values correctly', () => {
      const { container } = render(<Flex gap="xs">Item</Flex>)
      const element = container.querySelector('.zen-flex') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(FLEX_GAP_BASE)
      expect(baseValue.trim()).toBe('var(--space-1)')
    })

    it('should convert direction values correctly', () => {
      const { container } = render(<Flex direction="column">Item</Flex>)
      const element = container.querySelector('.zen-flex') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(FLEX_DIRECTION_BASE)
      expect(baseValue.trim()).toBe('column')
    })

    it('should convert align values correctly', () => {
      const { container } = render(<Flex align="end">Item</Flex>)
      const element = container.querySelector('.zen-flex') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(FLEX_ALIGN_BASE)
      expect(baseValue.trim()).toBe('flex-end')
    })

    it('should convert justify values correctly', () => {
      const { container } = render(<Flex justify="around">Item</Flex>)
      const element = container.querySelector('.zen-flex') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(FLEX_JUSTIFY_BASE)
      expect(baseValue.trim()).toBe('space-around')
    })

    it('should convert wrap values correctly', () => {
      const { container } = render(<Flex wrap={false}>Item</Flex>)
      const element = container.querySelector('.zen-flex') as HTMLElement

      const baseValue =
        getComputedStyle(element).getPropertyValue(FLEX_WRAP_BASE)
      expect(baseValue.trim()).toBe('nowrap')
    })
  })

  describe('Backward Compatibility', () => {
    it('should work with simple (non-responsive) values', () => {
      const { container } = render(
        <Flex
          gap="sm"
          direction="row"
          align="center"
          justify="between"
          wrap={true}
        >
          <div>Item 1</div>
        </Flex>,
      )
      const element = container.querySelector('.zen-flex')

      // Should have classes but no data attributes
      expect(element).toHaveClass('zen-flex--gap-sm')
      expect(element).toHaveClass('zen-flex--row')
      expect(element).toHaveClass('zen-flex--align-center')
      expect(element).toHaveClass('zen-flex--justify-between')
      expect(element).toHaveClass('zen-flex--wrap')

      // Should not have responsive data attributes
      expect(element).not.toHaveAttribute('data-has-responsive-gap')
      expect(element).not.toHaveAttribute('data-has-responsive-direction')
    })

    it('should work with responsive object values', () => {
      const { container } = render(
        <Flex gap={{ base: 'sm', md: 'lg' }}>
          <div>Item 1</div>
        </Flex>,
      )
      const element = container.querySelector('.zen-flex')

      // Should have data attribute
      expect(element).toHaveAttribute('data-has-responsive-gap', 'true')

      // Should not have gap class (since it's responsive)
      expect(element).not.toHaveClass('zen-flex--gap-sm')
      expect(element).not.toHaveClass('zen-flex--gap-lg')
    })
  })
})
