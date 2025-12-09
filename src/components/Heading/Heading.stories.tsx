import type { Meta, StoryObj } from '@storybook/react'
import { Heading } from './Heading'

const meta: Meta<typeof Heading> = {
  title: 'Components/Heading',
  component: Heading,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'],
      description: 'Font size that adapts to screen size',
    },
    level: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      description: 'Heading level (1-6)',
    },
    children: {
      control: 'text',
      description: 'Heading content',
    },
  },
}

export default meta
type Story = StoryObj<typeof Heading>

/* ----------------------------------------
   PLAYGROUND
   ---------------------------------------- */

export const Playground: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    size: '2xl',
    level: 1,
  },
}

/* ----------------------------------------
   ALL LEVELS
   ---------------------------------------- */

export const AllLevels: Story = {
  name: 'All Levels',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <div
          key={level}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 'var(--space-4)',
          }}
        >
          <span
            style={{
              width: '2rem',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
            }}
          >
            H{level}
          </span>
          <Heading level={level} size="2xl">
            Heading Level {level}
          </Heading>
        </div>
      ))}
    </div>
  ),
}

/* ----------------------------------------
   ALL SIZES
   ---------------------------------------- */

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      {(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'] as const).map(
        (size) => (
          <div
            key={size}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--space-4)',
            }}
          >
            <span
              style={{
                width: '4rem',
                fontFamily: 'var(--font-family-mono)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {size}
            </span>
            <Heading level={1} size={size}>
              The quick brown fox jumps over the lazy dog
            </Heading>
          </div>
        ),
      )}
    </div>
  ),
}

/* ----------------------------------------
   LEVEL AND SIZE COMBINATIONS
   ---------------------------------------- */

export const LevelAndSizeCombinations: Story = {
  name: 'Level and Size Combinations',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      <div>
        <Heading
          level={1}
          size="4xl"
          style={{
            marginBottom: 'var(--space-2)',
          }}
        >
          Level 1, Size 4XL
        </Heading>
        <Heading
          level={2}
          size="3xl"
          style={{
            marginBottom: 'var(--space-2)',
          }}
        >
          Level 2, Size 3XL
        </Heading>
        <Heading
          level={3}
          size="2xl"
          style={{
            marginBottom: 'var(--space-2)',
          }}
        >
          Level 3, Size 2XL
        </Heading>
        <Heading
          level={4}
          size="xl"
          style={{
            marginBottom: 'var(--space-2)',
          }}
        >
          Level 4, Size XL
        </Heading>
        <Heading
          level={5}
          size="lg"
          style={{
            marginBottom: 'var(--space-2)',
          }}
        >
          Level 5, Size LG
        </Heading>
        <Heading level={6} size="base">
          Level 6, Size Base
        </Heading>
      </div>
    </div>
  ),
}

/* ----------------------------------------
   RESPONSIVE SIZE
   ---------------------------------------- */

export const ResponsiveSize: Story = {
  name: 'Responsive Size',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <div>
        <Heading
          level={1}
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
            fontWeight: 'normal',
          }}
        >
          size={`{ base: "xl", md: "4xl" }`}
        </Heading>
        <Heading level={1} size={{ base: 'xl', md: '4xl' }}>
          This heading is smaller on mobile and larger on desktop. Resize your
          browser to see the change.
        </Heading>
      </div>
      <div>
        <Heading
          level={2}
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
            fontWeight: 'normal',
          }}
        >
          size={`{ base: "lg", lg: "3xl" }`}
        </Heading>
        <Heading level={2} size={{ base: 'lg', lg: '3xl' }}>
          This heading starts at lg size and grows to 3xl on large screens.
        </Heading>
      </div>
    </div>
  ),
}

/* ----------------------------------------
   DEFAULT USAGE
   ---------------------------------------- */

export const DefaultUsage: Story = {
  name: 'Default Usage',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <Heading level={1}>Main Heading (Level 1, Size 2XL)</Heading>
      <Heading level={2}>Section Heading (Level 2, Size 2XL)</Heading>
      <Heading level={3}>Subsection Heading (Level 3, Size 2XL)</Heading>
    </div>
  ),
}
