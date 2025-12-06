---
name: Design System Improvements
overview: Recommendations to strengthen the Zen Design System foundation before building additional components, covering accessibility, tokens, component patterns, Storybook configuration, and build infrastructure.
todos:
  - id: a11y-addon
    content: Install @storybook/addon-a11y and register in main.ts
    status: in_progress
  - id: terracotta-tokens
    content: Add terracotta color palette to tokens.css
    status: pending
  - id: status-tokens
    content: Add error/warning/success semantic tokens using terracotta
    status: pending
  - id: playground-story
    content: Add Playground story to Button.stories.tsx
    status: pending
  - id: yagni-docs
    content: Add YAGNI section to CreatingComponents.mdx
    status: pending
  - id: a11y-docs
    content: Add Accessibility section to CreatingComponents.mdx
    status: pending
  - id: component-css-vars
    content: Add component-level CSS variables to Button.css
    status: pending
  - id: docs-css-vars
    content: Document component CSS variables pattern in CreatingComponents.mdx
    status: pending
  - id: story-tokens
    content: Update Button stories to use design tokens in layouts
    status: pending
  - id: docs-story-tokens
    content: Document token usage in stories in CreatingComponents.mdx
    status: pending
  - id: docs-playground
    content: Document Playground story requirement in CreatingComponents.mdx
    status: pending
---

# Design System Improvement Plan

Prioritized improvements to strengthen the Zen Design System foundation before building additional components.

---

## 1. Add Accessibility Addon to Storybook

Install and configure `@storybook/addon-a11y` for accessibility auditing.

**Files:** `.storybook/main.ts`, `package.json`

```bash
npm install -D @storybook/addon-a11y
```

```ts
// .storybook/main.ts
addons: [
  '@storybook/addon-links',
  '@storybook/addon-essentials',
  '@storybook/addon-interactions',
  '@storybook/addon-a11y',
],
```

---

## 2. Add Semantic Color Tokens

Add terracotta palette and semantic status tokens to `src/tokens/tokens.css`.

**Terracotta palette:**

- `--color-terracotta-100: #f0e0d0`
- `--color-terracotta-500: #c3592b`
- (fill in remaining scale)

**Semantic mappings:**

```css
--color-error: var(--color-terracotta-500);
--color-error-subtle: var(--color-terracotta-100);
--color-warning: /* derive from terracotta */ ;
--color-warning-subtle: /* derive from terracotta */ ;
--color-success: var(--color-secondary-500);
--color-success-subtle: var(--color-secondary-50);
```

---

## 3. Add Interactive Playground Story

Add a `Playground` story to Button as the default interactive example.

**File:** `src/components/Button/Button.stories.tsx`

```tsx
export const Playground: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
}
```

Update `CreatingComponents.mdx` to document this as a required story pattern.

---

## 4. Add YAGNI Section to CreatingComponents.mdx

Add a new section emphasizing minimal implementation approach:

- Only add props/functionality explicitly requested or documented
- Avoid speculative features
- Reference the design system philosophy of simplicity

---

## 5. Add Accessibility Section to CreatingComponents.mdx

Add a section covering:

- Focus management requirements
- Keyboard navigation patterns
- ARIA attribute guidelines
- Color contrast considerations
- Integration with a11y addon for verification

---

## 6. Add Component-Level CSS Variables

Update Button CSS and document the pattern in `CreatingComponents.mdx`.

**File:** `src/components/Button/Button.css`

```css
.zen-button {
  --button-height: 2.5rem;
  --button-padding-x: var(--space-4);
  --button-font-size: var(--font-size-base);

  height: var(--button-height);
  padding: 0 var(--button-padding-x);
  font-size: var(--button-font-size);
}
```

---

## 7. Use Design Tokens in Story Layouts

Update Button stories to use tokens instead of inline pixel/rem values.

**File:** `src/components/Button/Button.stories.tsx`

```tsx
// Before
<div style={{ display: 'flex', gap: '1rem' }}>

// After
<div style={{ display: 'flex', gap: 'var(--space-4)' }}>
```

Update `CreatingComponents.mdx` to document this as required practice.

---

## Files to Modify

| File | Changes |

|------|---------|

| `package.json` | Add @storybook/addon-a11y |

| `.storybook/main.ts` | Register a11y addon |

| `src/tokens/tokens.css` | Add terracotta palette + semantic status tokens |

| `src/components/Button/Button.css` | Add component-level CSS variables |

| `src/components/Button/Button.stories.tsx` | Add Playground story, use design tokens in layouts |

| `src/docs/CreatingComponents.mdx` | Add YAGNI, Accessibility, Playground story, component CSS vars, and token usage sections |
