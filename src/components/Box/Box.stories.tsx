import type { Meta, StoryObj } from '@storybook/react'
import { Box } from './Box'

const meta: Meta<typeof Box> = {
  title: 'Components/Box',
  component: Box,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Padding on all sides',
    },
    paddingHorizontal: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Horizontal padding (left and right)',
    },
    paddingVertical: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Vertical padding (top and bottom)',
    },
  },
}

export default meta
type Story = StoryObj<typeof Box>

const ContentBlock = () => (
  <div
    style={{
      backgroundColor: 'var(--color-primary-100)',
      padding: 'var(--space-4)',
      borderRadius: 'var(--radius-md)',
      textAlign: 'center',
      fontFamily: 'var(--font-family-sans)',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--color-text-primary)',
    }}
  >
    Content
  </div>
)

export const Playground: Story = {
  args: {
    padding: 'md',
    children: <ContentBlock />,
  },
  render: (args) => (
    <Box
      {...args}
      style={{
        backgroundColor: 'var(--color-secondary-100)',
        borderRadius: 'var(--radius-md)',
      }}
    />
  ),
}

export const AllPaddingSizes: Story = {
  name: 'All Padding Sizes',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div
          key={size}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}
        >
          <span
            style={{
              width: '3rem',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {size}
          </span>
          <Box
            padding={size}
            style={{
              backgroundColor: 'var(--color-secondary-100)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <ContentBlock />
          </Box>
        </div>
      ))}
    </div>
  ),
}

export const HorizontalPadding: Story = {
  name: 'Horizontal Padding',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div
          key={size}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}
        >
          <span
            style={{
              width: '3rem',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {size}
          </span>
          <Box
            paddingHorizontal={size}
            style={{
              backgroundColor: 'var(--color-secondary-100)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <ContentBlock />
          </Box>
        </div>
      ))}
    </div>
  ),
}

export const VerticalPadding: Story = {
  name: 'Vertical Padding',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div
          key={size}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}
        >
          <span
            style={{
              width: '3rem',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {size}
          </span>
          <Box
            paddingVertical={size}
            style={{
              backgroundColor: 'var(--color-secondary-100)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <ContentBlock />
          </Box>
        </div>
      ))}
    </div>
  ),
}

export const CombinedPadding: Story = {
  name: 'Combined Padding',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <Box
        paddingHorizontal="xl"
        paddingVertical="sm"
        style={{
          backgroundColor: 'var(--color-secondary-100)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <ContentBlock />
      </Box>
      <p
        style={{
          fontFamily: 'var(--font-family-sans)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)',
          margin: 0,
        }}
      >
        paddingHorizontal="xl" + paddingVertical="sm"
      </p>
    </div>
  ),
}
