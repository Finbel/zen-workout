import React from 'react'
import type { Decorator } from '@storybook/react'

/**
 * Wraps the story in a container with the surface background color.
 * Useful for presenting components on the intended surface color.
 */
export const withSurface: Decorator = (Story) => (
  <div
    style={{
      backgroundColor: 'var(--color-surface)',
      padding: '2rem',
    }}
  >
    <Story />
  </div>
)

/**
 * Wraps the story in a container with the background color.
 * Useful for full-page layouts.
 */
export const withBackground: Decorator = (Story) => (
  <div
    style={{
      backgroundColor: 'var(--color-background)',
      padding: '2rem',
      minHeight: '100vh',
    }}
  >
    <Story />
  </div>
)
