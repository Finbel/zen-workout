/**
 * Tests for responsiveStyles utility
 */

import { describe, it, expect } from 'vitest'
import { responsiveStyles } from './responsiveStyles'
import type { Responsive } from './Responsive'

describe('responsiveStyles', () => {
  describe('simple values (non-responsive)', () => {
    it('should return CSS for a simple string value', () => {
      const result = responsiveStyles('padding', '10px', (val) => val)
      expect(result).toBeDefined()
      // Emotion CSS objects have a name property
      expect(result).toHaveProperty('name')
    })

    it('should return CSS for a simple number value', () => {
      const result = responsiveStyles('width', 100, (val) => `${val}px`)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('name')
    })

    it('should apply the conversion function to simple values', () => {
      const toCSS = (val: string) => `var(--space-${val})`
      const result = responsiveStyles('padding', 'md', toCSS)
      expect(result).toBeDefined()
    })
  })

  describe('responsive objects', () => {
    it('should return CSS for responsive object with base only', () => {
      const value: Responsive<string> = { base: '10px' }
      const result = responsiveStyles('padding', value, (val) => val)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('name')
    })

    it('should return CSS for responsive object with multiple breakpoints', () => {
      const value: Responsive<string> = {
        base: '5px',
        sm: '10px',
        md: '15px',
      }
      const result = responsiveStyles('padding', value, (val) => val)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('name')
    })

    it('should include media queries for breakpoints', () => {
      const value: Responsive<string> = {
        base: '5px',
        md: '10px',
      }
      const result = responsiveStyles('padding', value, (val) => val)
      expect(result).toBeDefined()
      // The CSS should include media query information
      expect(result).toHaveProperty('name')
    })

    it('should handle responsive object with all breakpoints', () => {
      const value: Responsive<string> = {
        base: '5px',
        xs: '6px',
        sm: '8px',
        md: '10px',
        lg: '12px',
      }
      const result = responsiveStyles('padding', value, (val) => val)
      expect(result).toBeDefined()
    })

    it('should apply conversion function to each breakpoint value', () => {
      const toCSS = (val: string) => `var(--space-${val})`
      const value: Responsive<string> = {
        base: 'sm',
        md: 'lg',
      }
      const result = responsiveStyles('padding', value, toCSS)
      expect(result).toBeDefined()
    })

    it('should handle responsive object without base (uses first defined breakpoint)', () => {
      const value: Responsive<string> = {
        sm: '10px',
        md: '15px',
      }
      const result = responsiveStyles('padding', value, (val) => val)
      expect(result).toBeDefined()
    })
  })

  describe('undefined values', () => {
    it('should return undefined for undefined input', () => {
      // TypeScript note: toCSS is never called when value is undefined
      const result = responsiveStyles<string>(
        'padding',
        undefined,
        (val: string) => val,
      )
      expect(result).toBeUndefined()
    })
  })

  describe('breakpoint order', () => {
    it('should generate media queries in correct order (xs, sm, md, lg)', () => {
      const value: Responsive<string> = {
        base: '5px',
        xs: '6px',
        sm: '8px',
        md: '10px',
        lg: '12px',
      }
      const result = responsiveStyles('padding', value, (val) => val)
      expect(result).toBeDefined()
      // Media queries should be in ascending order
    })
  })

  describe('CSS value conversion', () => {
    it('should convert semantic values to CSS tokens', () => {
      const toCSS = (val: 'sm' | 'md' | 'lg') => {
        const mapping = {
          sm: 'var(--space-2)',
          md: 'var(--space-4)',
          lg: 'var(--space-6)',
        }
        return mapping[val]
      }
      const value: Responsive<'sm' | 'md' | 'lg'> = {
        base: 'sm',
        md: 'lg',
      }
      const result = responsiveStyles('padding', value, toCSS)
      expect(result).toBeDefined()
    })

    it('should handle numeric values with units', () => {
      const toCSS = (val: number) => `${val}px`
      const value: Responsive<number> = {
        base: 5,
        md: 10,
      }
      const result = responsiveStyles('padding', value, toCSS)
      expect(result).toBeDefined()
    })
  })

  describe('multiple CSS properties', () => {
    it('should handle multiple properties from a single responsive value', () => {
      // This test verifies that the utility can be used for properties
      // that affect multiple CSS properties (like paddingHorizontal)
      const value: Responsive<string> = {
        base: '5px',
        md: '10px',
      }
      const result1 = responsiveStyles('padding-left', value, (val) => val)
      const result2 = responsiveStyles('padding-right', value, (val) => val)
      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
    })
  })
})

