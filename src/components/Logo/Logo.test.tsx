import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Logo } from './Logo'

describe('Logo', () => {
  describe('Component Rendering', () => {
    it('should render icon and text correctly', () => {
      const { getByText, container } = render(
        <Logo icon="check" text="Zen Design" />,
      )
      expect(getByText('Zen Design')).toBeInTheDocument()
      const icon = container.querySelector('.zen-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render with default props', () => {
      const { container } = render(<Logo icon="check" text="Test" />)
      const element = container.querySelector('.zen-logo')
      expect(element).toBeInTheDocument()
    })

    it('should apply base class name', () => {
      const { container } = render(<Logo icon="check" text="Test" />)
      const element = container.querySelector('.zen-logo')
      expect(element).toHaveClass('zen-logo')
    })

    it('should render as div element when href is not provided', () => {
      const { container } = render(<Logo icon="check" text="Test" />)
      const element = container.querySelector('div.zen-logo')
      expect(element).toBeInTheDocument()
    })

    it('should render as anchor element when href is provided', () => {
      const { container } = render(<Logo icon="check" text="Test" href="/" />)
      const element = container.querySelector('a.zen-logo')
      expect(element).toBeInTheDocument()
      expect(element).toHaveAttribute('href', '/')
    })
  })

  describe('Responsive Icon Size', () => {
    it('should apply simple iconSize value', () => {
      const { container } = render(
        <Logo icon="check" text="Test" iconSize={32} />,
      )
      const icon = container.querySelector('.zen-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should apply responsive iconSize values', () => {
      const { container } = render(
        <Logo icon="check" text="Test" iconSize={{ base: 20, md: 32 }} />,
      )
      const icon = container.querySelector('.zen-icon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Class Names', () => {
    it('should merge custom className', () => {
      const { container } = render(
        <Logo icon="check" text="Test" className="custom-class" />,
      )
      const element = container.querySelector('.zen-logo')
      expect(element).toHaveClass('zen-logo')
      expect(element).toHaveClass('custom-class')
    })
  })

  describe('Ref Forwarding', () => {
    it('should forward ref to div element', () => {
      const ref = { current: null }
      render(<Logo icon="check" text="Test" ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('should forward ref to anchor element when href is provided', () => {
      const ref = { current: null }
      render(<Logo icon="check" text="Test" href="/" ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('Edge Cases', () => {
    it('should handle different icon names', () => {
      const icons = ['check', 'gear', 'user', 'search'] as const
      icons.forEach((icon) => {
        const { container } = render(<Logo icon={icon} text="Test" />)
        const logoElement = container.querySelector('.zen-logo')
        expect(logoElement).toBeInTheDocument()
      })
    })

    it('should handle empty text', () => {
      const { container } = render(<Logo icon="check" text="" />)
      const element = container.querySelector('.zen-logo')
      expect(element).toBeInTheDocument()
    })

    it('should handle custom style prop', () => {
      const { container } = render(
        <Logo icon="check" text="Test" style={{ marginTop: '10px' }} />,
      )
      const element = container.querySelector('.zen-logo') as HTMLElement
      expect(element).toHaveStyle({ marginTop: '10px' })
    })
  })
})
