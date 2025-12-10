# Responsive Shadow Pseudo-Elements Fix Report

## Executive Summary

Fixed an issue where responsive `shadowRight` and `shadowTop` props were not correctly applying pseudo-element styles (`::before` and `::after`) in media queries. The root cause was inconsistent use of Emotion's CSS syntax between simple (non-responsive) and responsive cases.

## Problem Statement

When using responsive shadow props like `shadowRight={{ base: false, md: true }}`, the `::after` pseudo-element was not appearing on desktop (md breakpoint) even though:

- The logic correctly calculated `hasRight: true` at the `md` breakpoint
- The CSS object structure appeared correct in console logs
- Simple (non-responsive) values like `shadowRight={true}` worked correctly

## Root Cause Analysis

### The Issue

The codebase had **two different code paths** for handling shadows:

1. **Simple case** (lines 144-182): Used Emotion's **object syntax** with `css({ ... })`

   - This worked correctly
   - Structure: `css({ '&::after': { ... } })`

2. **Responsive case** (original implementation): Used **template literal syntax** with `css('...')`
   - This did NOT work for nested selectors in media queries
   - Structure: `css('@media (...) { &::after { ... } }')`

### Why Template Literals Failed

While Emotion supports both object syntax and template literals, **nested selectors (`&::before`, `&::after`) inside media queries** are not reliably processed when using template literal syntax. The CSS string was being generated correctly, but Emotion's parser wasn't properly handling the nested pseudo-element selectors within media query blocks.

### Why Object Syntax Works

Emotion's object syntax provides better type safety and more reliable parsing of nested selectors in media queries. The structure:

```js
{
  '@media (min-width: 1024px)': {
    '&::after': { ... }
  }
}
```

is explicitly supported and correctly processed by Emotion's CSS-in-JS engine.

## Solution

### Changes Made

1. **Unified syntax approach**: Changed responsive case to use **object syntax** (matching the simple case)
2. **Consistent empty object handling**: Changed `{ display: 'none' }` to `{}` when shadows are hidden (matching the simple case)
3. **Removed debug code**: Cleaned up all console.log statements and `isNavCell` detection code

### Key Fix

```typescript
// BEFORE (template literal - didn't work)
cssString += `@media (min-width: ${minWidth}px) { &::after { ... } }`
return css(cssString)

// AFTER (object syntax - works!)
cssObject[`@media (min-width: ${minWidth}px)`] = {
  '&::after': { ... }
}
return css(cssObject)
```

## Code Quality Improvements

### Completed

1. ✅ Removed all debug console.log statements
2. ✅ Removed `isNavCell` detection code
3. ✅ Updated comment to reflect correct approach
4. ✅ Ensured consistent syntax between simple and responsive cases

### Recommended Refactorings

#### 1. Extract Common Pseudo-Element Style Builder

**Problem**: Duplication between simple and responsive cases for pseudo-element style objects.

**Solution**: Create a helper function:

```typescript
function buildPseudoElementStyles(
  enabled: boolean,
  type: 'before' | 'after',
  gapPixels: string,
  shadowValue: string,
): Record<string, any> {
  if (!enabled) return {}

  const baseStyles = {
    content: '""',
    position: 'absolute',
    pointerEvents: 'none' as const,
    zIndex: 1,
    boxShadow: shadowValue,
  }

  if (type === 'before') {
    return {
      ...baseStyles,
      top: `-${gapPixels}`,
      left: 0,
      right: 0,
      height: gapPixels,
    }
  } else {
    return {
      ...baseStyles,
      top: 0,
      right: `-${gapPixels}`,
      bottom: 0,
      width: gapPixels,
    }
  }
}
```

**Usage**:

```typescript
'&::after': buildPseudoElementStyles(hasRight, 'after', gapPixels, shadowRightValue)
```

#### 2. Consolidate Base Value Calculation

**Problem**: Repetitive logic for calculating `baseRight` and `baseTop`.

**Solution**: Create a helper function:

```typescript
function getBaseBooleanValue(value: Responsive<boolean> | undefined): boolean {
  if (value === undefined) return false
  if (!isResponsiveObject(value)) return value === true

  const obj = value as ResponsiveObject<boolean>
  if (obj.base !== undefined) return obj.base === true

  // Find first defined breakpoint value
  for (const bp of breakpointOrder) {
    if (obj[bp] !== undefined) {
      return obj[bp] === true
    }
  }

  return false
}
```

#### 3. Extract Media Query Builder

**Problem**: Complex logic for building media queries is embedded in the main function.

**Solution**: Create a dedicated function:

```typescript
function buildMediaQueries(
  shadowRight: Responsive<boolean> | undefined,
  shadowTop: Responsive<boolean> | undefined,
  gap: Responsive<ShojiGridGap> | undefined,
  shadowTopValue: string,
  shadowRightValue: string,
): Record<string, any> {
  const mediaQueries: Record<string, any> = {}
  // ... implementation
  return mediaQueries
}
```

## Testing Recommendations

### 1. Visual Regression Tests

Add Storybook visual regression tests for responsive shadows:

```typescript
// ShojiGrid.stories.tsx
export const ResponsiveShadows: Story = {
  render: () => (
    <ShojiGrid gap="md">
      <ShojiGrid.Cell shadowRight={{ base: false, md: true }}>
        Should show ::after on desktop only
      </ShojiGrid.Cell>
      <ShojiGrid.Cell shadowRight={{ base: true, md: false }}>
        Should show ::after on mobile only
      </ShojiGrid.Cell>
    </ShojiGrid>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
}
```

### 2. Unit Tests for generateShadowStyles

Add comprehensive unit tests:

```typescript
describe('generateShadowStyles', () => {
  it('should create ::after in media query for shadowRight={{ base: false, md: true }}', () => {
    const result = generateShadowStyles(
      { base: false, md: true },
      undefined,
      'md',
    )

    // Verify the CSS object structure
    expect(result).toBeDefined()
    // Check that media query exists
    // Check that &::after has correct styles at md breakpoint
  })

  it('should use same structure for simple and responsive cases', () => {
    const simple = generateShadowStyles(true, undefined, 'md')
    const responsive = generateShadowStyles({ base: true }, undefined, 'md')

    // Both should use object syntax
    // Both should have same structure
  })
})
```

### 3. Integration Tests with Browser Testing

Use Playwright or Cypress to test actual rendering:

```typescript
it('should render ::after pseudo-element on desktop for responsive shadow', async () => {
  await page.setViewportSize({ width: 1200, height: 800 })
  await page.goto('/storybook')

  const navCell = page.locator('[data-area="nav"]')
  const afterElement = await navCell.evaluate((el) => {
    const styles = window.getComputedStyle(el, '::after')
    return styles.content !== 'none' && styles.content !== ''
  })

  expect(afterElement).toBe(true)
})
```

### 4. Test Coverage Requirements

Ensure tests cover:

- ✅ Simple boolean values (true/false)
- ✅ Responsive objects with base value
- ✅ Responsive objects without base value (first breakpoint fallback)
- ✅ Multiple breakpoints (xs, sm, md, lg)
- ✅ Both shadowTop and shadowRight
- ✅ Combinations of responsive and non-responsive props
- ✅ Edge cases (undefined, all false, etc.)

## Prevention Strategies

### 1. Code Review Checklist

When adding responsive styles with pseudo-elements:

- [ ] Use object syntax for Emotion CSS
- [ ] Match structure between simple and responsive cases
- [ ] Test in browser at multiple viewport sizes
- [ ] Verify pseudo-elements appear in DevTools

### 2. Linting Rules

Consider adding ESLint rules to enforce:

- Consistent use of object syntax for Emotion
- No template literals for complex nested selectors

### 3. Documentation

Update component documentation to include:

- Examples of responsive shadow usage
- Note about object syntax requirement for nested selectors
- Common pitfalls and solutions

### 4. Type Safety

Add TypeScript types to ensure correct structure:

```typescript
type EmotionMediaQuery = {
  [K in `@media ${string}`]?: {
    '&::before'?: Record<string, any>
    '&::after'?: Record<string, any>
  }
}
```

## Lessons Learned

1. **Consistency is key**: Using the same syntax pattern (object syntax) for both simple and responsive cases prevents subtle bugs
2. **Test what works**: The fact that simple values worked was a clue that the syntax difference was the issue
3. **Debug systematically**: Console logs helped identify that the logic was correct, pointing to a rendering/parsing issue
4. **Emotion's limitations**: Template literals work for simple cases but object syntax is more reliable for complex nested selectors in media queries

## Related Files

- `src/components/ShojiGrid/ShojiGridCell.tsx` - Main implementation
- `src/components/ShojiGrid/ShojiGrid.test.tsx` - Test file (needs expansion)
- `src/components/ShojiGrid/ShojiGrid.stories.tsx` - Storybook examples

## Conclusion

The issue was resolved by unifying the CSS generation approach to use Emotion's object syntax consistently. This ensures reliable rendering of nested pseudo-element selectors in media queries. Future development should maintain this consistency and add comprehensive tests to catch similar issues early.

