---
name: Typography System Update
overview: Update the design system to use Cormorant Garamond for headings and Lato for body text, implement generous line heights and letter spacing for headings, make the system more opinionated about line height, and update documentation to reflect the strongly opinionated approach.
todos:
  - id: load-fonts
    content: Add Google Fonts import for Cormorant Garamond and Lato in Storybook preview
    status: completed
  - id: update-tokens
    content: "Update tokens.css: add --font-family-heading, change --font-family-sans to Lato, simplify line height to single relaxed value"
    status: in_progress
  - id: update-typography-docs
    content: "Update Typography.mdx: new fonts, single line height, add Zen typography principles section, update usage examples"
    status: pending
  - id: update-design-system-docs
    content: "Update DesignSystem.mdx: emphasize strongly opinionated nature, update typography section with new fonts"
    status: pending
---

# Typography System Update

## Overview
Transform the typography system to use Cormorant Garamond for headings and Lato for body text, implement generous line heights (1.6-1.8), add letter spacing for headings, simplify line height options to a single relaxed value, and update documentation to emphasize the system's strongly opinionated nature.

## Implementation Steps

### 1. Font Loading Setup
- **File**: `.storybook/preview.ts`
  - Add Google Fonts import for Cormorant Garamond and Lato
  - Add `<link>` tags or use `@import` in CSS to load fonts from Google Fonts

### 2. Update Design Tokens
- **File**: `src/tokens/tokens.css`
  - Add new `--font-family-heading` token with `'Cormorant Garamond', serif` fallback
  - Update `--font-family-sans` to use `'Lato', sans-serif` instead of DM Sans
  - Replace multiple line height tokens with a single `--line-height-body` token (value: 1.6 or 1.8)
  - Update body default line height in base styles to use the new relaxed value
  - Keep `--letter-spacing-wide` for headings (already exists at 0.025em)

### 3. Update Typography Documentation
- **File**: `src/docs/Typography.mdx`
  - Update Font Families section to show Cormorant Garamond for headings and Lato for body
  - Remove the multiple Line Heights section, replace with single relaxed line height documentation
  - Update Usage examples to:
    - Use `--font-family-heading` for headings with `--letter-spacing-wide`
    - Use `--font-family-sans` (Lato) for body with relaxed line height
    - Show the generous line height approach
  - Add section explaining the Zen typography principles (generous leading, letter spacing for headings)

### 4. Update Design System Introduction
- **File**: `src/docs/DesignSystem.mdx`
  - Update Philosophy section to emphasize that Zen Design is a **strongly opinionated** design system
  - Update Typography section to reflect new font choices (Cormorant Garamond + Lato)
  - Update description to mention the relaxed line height approach

### 5. Update Base Styles
- **File**: `src/tokens/tokens.css`
  - Ensure body element uses the new relaxed line height by default
  - Verify font-family defaults are correct

## Key Changes Summary

**Fonts:**
- Headings: Cormorant Garamond (new `--font-family-heading` token)
- Body: Lato (update `--font-family-sans`)
- Code: JetBrains Mono (unchanged)

**Line Height:**
- Single relaxed value (1.6 or 1.8) replacing tight/normal/relaxed options
- Applied as default for body text

**Letter Spacing:**
- Use existing `--letter-spacing-wide` (0.025em) for headings, especially uppercase

**Documentation:**
- Emphasize strongly opinionated nature
- Document Zen typography principles
- Update all examples to reflect new fonts and relaxed approach