import type { Meta, StoryObj } from '@storybook/react'
import { Text } from './Text'

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
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
    children: {
      control: 'text',
      description: 'Text content',
    },
  },
}

export default meta
type Story = StoryObj<typeof Text>

/* ----------------------------------------
   PLAYGROUND
   ---------------------------------------- */

export const Playground: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    size: 'base',
  },
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
            <Text size={size}>The quick brown fox jumps over the lazy dog</Text>
          </div>
        ),
      )}
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
        <Text
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          size={`{ base: "sm", md: "lg" }`}
        </Text>
        <Text size={{ base: 'sm', md: 'lg' }}>
          This text is smaller on mobile and larger on desktop. Resize your
          browser to see the change.
        </Text>
      </div>
      <div>
        <Text
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          size={`{ base: "base", lg: "2xl" }`}
        </Text>
        <Text size={{ base: 'base', lg: '2xl' }}>
          This text starts at base size and grows to 2xl on large screens.
        </Text>
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
      <Text>
        This is default text with base size. It uses the body font (Lato) and
        has a generous line height for comfortable reading.
      </Text>
      <Text>
        Multiple paragraphs maintain consistent spacing and styling throughout
        your content.
      </Text>
    </div>
  ),
}
