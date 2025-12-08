import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Icon, ICON_NAMES } from './Icon'

describe('Icon', () => {
  describe('Component Rendering', () => {
    it('should render with a valid icon name', () => {
      const { container } = render(<Icon name="check" />)
      const element = container.querySelector('.zen-icon')
      expect(element).toBeInTheDocument()
    })

    it('should render with default props', () => {
      const { container } = render(<Icon name="check" />)
      const element = container.querySelector('.zen-icon')
      expect(element).toBeInTheDocument()
      expect(element).toHaveClass('zen-icon')
    })

    it('should apply base class name', () => {
      const { container } = render(<Icon name="check" />)
      const element = container.querySelector('.zen-icon')
      expect(element).toHaveClass('zen-icon')
    })

    it('should apply custom className', () => {
      const { container } = render(
        <Icon name="check" className="custom-class" />,
      )
      const element = container.querySelector('.zen-icon')
      expect(element).toHaveClass('zen-icon')
      expect(element).toHaveClass('custom-class')
    })

    it('should render all available icon names', () => {
      ICON_NAMES.forEach((name) => {
        const { container } = render(<Icon name={name} />)
        const element = container.querySelector('.zen-icon')
        expect(element).toBeInTheDocument()
      })
    })

    it('should return null and warn for invalid icon name', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      // @ts-expect-error - Testing invalid icon name
      const { container } = render(<Icon name="invalid-icon" />)
      const element = container.querySelector('.zen-icon')
      expect(element).not.toBeInTheDocument()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Icon "invalid-icon" not found in ICON_MAP',
      )
      consoleSpy.mockRestore()
    })
  })

  describe('Size Prop', () => {
    it('should apply simple size value', () => {
      const { container } = render(<Icon name="check" size={24} />)
      const element = container.querySelector('.zen-icon') as HTMLElement
      const styles = getComputedStyle(element)

      // Check that CSS custom property is set
      const baseValue = styles.getPropertyValue('--icon-size-base')
      expect(baseValue.trim()).toBe('24')
    })

    it('should apply responsive size values', () => {
      const { container } = render(
        <Icon name="check" size={{ base: 20, md: 24 }} />,
      )
      const element = container.querySelector('.zen-icon') as HTMLElement
      const styles = getComputedStyle(element)

      // Check base value
      const baseValue = styles.getPropertyValue('--icon-size-base')
      expect(baseValue.trim()).toBe('20')

      // Check md value
      const mdValue = styles.getPropertyValue('--icon-size-md')
      expect(mdValue.trim()).toBe('24')
    })

    it('should handle string size values', () => {
      const { container } = render(<Icon name="check" size="1.5rem" />)
      const element = container.querySelector('.zen-icon') as HTMLElement
      const styles = getComputedStyle(element)

      const baseValue = styles.getPropertyValue('--icon-size-base')
      expect(baseValue.trim()).toBe('1.5rem')
    })

    it('should handle responsive string size values', () => {
      const { container } = render(
        <Icon name="check" size={{ base: '1rem', md: '1.5rem' }} />,
      )
      const element = container.querySelector('.zen-icon') as HTMLElement
      const styles = getComputedStyle(element)

      const baseValue = styles.getPropertyValue('--icon-size-base')
      expect(baseValue.trim()).toBe('1rem')

      const mdValue = styles.getPropertyValue('--icon-size-md')
      expect(mdValue.trim()).toBe('1.5rem')
    })
  })

  describe('Color Prop', () => {
    it('should apply simple color value', () => {
      const { container } = render(
        <Icon name="check" color="var(--color-primary)" />,
      )
      const element = container.querySelector('.zen-icon') as HTMLElement
      const styles = getComputedStyle(element)

      const baseValue = styles.getPropertyValue('--icon-color-base')
      expect(baseValue.trim()).toBe('var(--color-primary)')
    })

    it('should apply responsive color values', () => {
      const { container } = render(
        <Icon
          name="check"
          color={{ base: 'currentColor', md: 'var(--color-primary)' }}
        />,
      )
      const element = container.querySelector('.zen-icon') as HTMLElement
      const styles = getComputedStyle(element)

      // Check base value
      const baseValue = styles.getPropertyValue('--icon-color-base')
      expect(baseValue.trim()).toBe('currentColor')

      // Check md value
      const mdValue = styles.getPropertyValue('--icon-color-md')
      expect(mdValue.trim()).toBe('var(--color-primary)')
    })
  })

  describe('Data Attributes for Responsive Props', () => {
    it('should set data-has-responsive-size attribute when using responsive size', () => {
      const { container } = render(
        <Icon name="check" size={{ base: 20, md: 24 }} />,
      )
      const element = container.querySelector('.zen-icon')

      expect(element).toHaveAttribute('data-has-responsive-size', 'true')
    })

    it('should set data-has-responsive-color attribute when using responsive color', () => {
      const { container } = render(
        <Icon
          name="check"
          color={{ base: 'currentColor', md: 'var(--color-primary)' }}
        />,
      )
      const element = container.querySelector('.zen-icon')

      expect(element).toHaveAttribute('data-has-responsive-color', 'true')
    })

    it('should not set data attribute for simple (non-responsive) size', () => {
      const { container } = render(<Icon name="check" size={24} />)
      const element = container.querySelector('.zen-icon')

      expect(element).not.toHaveAttribute('data-has-responsive-size')
    })

    it('should not set data attribute for simple (non-responsive) color', () => {
      const { container } = render(
        <Icon name="check" color="var(--color-primary)" />,
      )
      const element = container.querySelector('.zen-icon')

      expect(element).not.toHaveAttribute('data-has-responsive-color')
    })

    it('should set breakpoint-specific data attributes for responsive size', () => {
      const { container } = render(
        <Icon name="check" size={{ base: 20, md: 24, lg: 32 }} />,
      )
      const element = container.querySelector('.zen-icon')

      expect(element).toHaveAttribute('data-size-base', '20')
      expect(element).toHaveAttribute('data-size-md', '24')
      expect(element).toHaveAttribute('data-size-lg', '32')
    })

    it('should set breakpoint-specific data attributes for responsive color', () => {
      const { container } = render(
        <Icon
          name="check"
          color={{
            base: 'currentColor',
            md: 'var(--color-primary)',
            lg: 'var(--color-secondary)',
          }}
        />,
      )
      const element = container.querySelector('.zen-icon')

      expect(element).toHaveAttribute('data-color-base', 'currentColor')
      expect(element).toHaveAttribute('data-color-md', 'var(--color-primary)')
      expect(element).toHaveAttribute('data-color-lg', 'var(--color-secondary)')
    })
  })

  describe('Accessibility', () => {
    it('should set aria-label when alt prop is provided', () => {
      const { container } = render(<Icon name="x" alt="Close" />)
      const element = container.querySelector('.zen-icon')

      expect(element).toHaveAttribute('aria-label', 'Close')
      expect(element).toHaveAttribute('aria-hidden', 'false')
    })

    it('should set aria-hidden when alt prop is not provided', () => {
      const { container } = render(<Icon name="check" />)
      const element = container.querySelector('.zen-icon')

      expect(element).toHaveAttribute('aria-hidden', 'true')
      expect(element).not.toHaveAttribute('aria-label')
    })

    it('should set aria-hidden to false when alt is provided', () => {
      const { container } = render(<Icon name="check" alt="Checkmark" />)
      const element = container.querySelector('.zen-icon')

      expect(element).toHaveAttribute('aria-hidden', 'false')
      expect(element).toHaveAttribute('aria-label', 'Checkmark')
    })
  })

  describe('Responsive Behavior', () => {
    it('should handle responsive size with multiple breakpoints', () => {
      const { container } = render(
        <Icon
          name="check"
          size={{
            base: 16,
            xs: 20,
            sm: 24,
            md: 32,
            lg: 48,
          }}
        />,
      )
      const element = container.querySelector('.zen-icon') as HTMLElement
      const styles = getComputedStyle(element)

      const baseValue = styles.getPropertyValue('--icon-size-base')
      expect(baseValue.trim()).toBe('16')

      expect(element).toHaveAttribute('data-size-base', '16')
      expect(element).toHaveAttribute('data-size-xs', '20')
      expect(element).toHaveAttribute('data-size-sm', '24')
      expect(element).toHaveAttribute('data-size-md', '32')
      expect(element).toHaveAttribute('data-size-lg', '48')
    })

    it('should handle responsive color with multiple breakpoints', () => {
      const { container } = render(
        <Icon
          name="check"
          color={{
            base: 'currentColor',
            xs: 'var(--color-text-primary)',
            sm: 'var(--color-primary)',
            md: 'var(--color-secondary)',
            lg: 'var(--color-accent)',
          }}
        />,
      )
      const element = container.querySelector('.zen-icon') as HTMLElement
      const styles = getComputedStyle(element)

      const baseValue = styles.getPropertyValue('--icon-color-base')
      expect(baseValue.trim()).toBe('currentColor')

      expect(element).toHaveAttribute('data-color-base', 'currentColor')
      expect(element).toHaveAttribute(
        'data-color-xs',
        'var(--color-text-primary)',
      )
      expect(element).toHaveAttribute('data-color-sm', 'var(--color-primary)')
      expect(element).toHaveAttribute('data-color-md', 'var(--color-secondary)')
      expect(element).toHaveAttribute('data-color-lg', 'var(--color-accent)')
    })
  })

  describe('Base Value Extraction', () => {
    it('should use base value for Phosphor icon size prop', () => {
      const { container } = render(
        <Icon name="check" size={{ base: 20, md: 24 }} />,
      )
      const element = container.querySelector('.zen-icon') as HTMLElement

      // The Phosphor icon should receive the base size value (20)
      // We can't directly test this, but we can verify the CSS custom properties are set
      const styles = getComputedStyle(element)
      const baseValue = styles.getPropertyValue('--icon-size-base')
      expect(baseValue.trim()).toBe('20')
    })

    it('should use base value for Phosphor icon color prop', () => {
      const { container } = render(
        <Icon
          name="check"
          color={{ base: 'currentColor', md: 'var(--color-primary)' }}
        />,
      )
      const element = container.querySelector('.zen-icon') as HTMLElement

      // The Phosphor icon should receive the base color value
      const styles = getComputedStyle(element)
      const baseValue = styles.getPropertyValue('--icon-color-base')
      expect(baseValue.trim()).toBe('currentColor')
    })

    it('should use simple value when not responsive', () => {
      const { container } = render(<Icon name="check" size={24} />)
      const element = container.querySelector('.zen-icon') as HTMLElement

      const styles = getComputedStyle(element)
      const baseValue = styles.getPropertyValue('--icon-size-base')
      expect(baseValue.trim()).toBe('24')
    })
  })
})
