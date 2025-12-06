import type { Meta, StoryObj } from '@storybook/react'
import { Flex } from './Flex'
import { withSurface } from '../../../.storybook/decorators'

const meta: Meta<typeof Flex> = {
  title: 'Layout/Flex',
  component: Flex,
  tags: ['autodocs'],
  decorators: [withSurface],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Gap between flex items',
    },
    wrap: {
      control: 'boolean',
      description: 'Whether items should wrap to new lines',
    },
    direction: {
      control: 'select',
      options: ['row', 'column'],
      description: 'Flex direction',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Align items on the cross axis',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around'],
      description: 'Justify content on the main axis',
    },
  },
}

export default meta
type Story = StoryObj<typeof Flex>

const Box = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: 'var(--space-4)',
      backgroundColor: 'var(--color-primary-100)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--color-text-primary)',
    }}
  >
    {children}
  </div>
)

/* ----------------------------------------
   PLAYGROUND
   ---------------------------------------- */

export const Playground: Story = {
  args: {
    gap: 'md',
    wrap: true,
    direction: 'row',
  },
  render: (args) => (
    <Flex {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
      <Box>Item 4</Box>
      <Box>Item 5</Box>
    </Flex>
  ),
}

/* ----------------------------------------
   GAP VARIANTS
   ---------------------------------------- */

export const GapVariants: Story = {
  name: 'Gap Variants',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-8)',
      }}
    >
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          gap="xs"
        </p>
        <Flex gap="xs">
          <Box>Item</Box>
          <Box>Item</Box>
          <Box>Item</Box>
        </Flex>
      </div>
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          gap="sm"
        </p>
        <Flex gap="sm">
          <Box>Item</Box>
          <Box>Item</Box>
          <Box>Item</Box>
        </Flex>
      </div>
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          gap="md" (default)
        </p>
        <Flex gap="md">
          <Box>Item</Box>
          <Box>Item</Box>
          <Box>Item</Box>
        </Flex>
      </div>
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          gap="lg"
        </p>
        <Flex gap="lg">
          <Box>Item</Box>
          <Box>Item</Box>
          <Box>Item</Box>
        </Flex>
      </div>
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          gap="xl"
        </p>
        <Flex gap="xl">
          <Box>Item</Box>
          <Box>Item</Box>
          <Box>Item</Box>
        </Flex>
      </div>
    </div>
  ),
}

/* ----------------------------------------
   DIRECTION
   ---------------------------------------- */

export const Direction: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          direction="row"
        </p>
        <Flex direction="row">
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Flex>
      </div>
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          direction="column"
        </p>
        <Flex direction="column">
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Flex>
      </div>
    </div>
  ),
}

/* ----------------------------------------
   ALIGNMENT
   ---------------------------------------- */

export const Alignment: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-8)',
      }}
    >
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          align="start"
        </p>
        <Flex
          align="start"
          style={{ height: '100px', backgroundColor: 'var(--color-surface)' }}
        >
          <Box>Short</Box>
          <Box>
            Taller
            <br />
            Item
          </Box>
          <Box>Short</Box>
        </Flex>
      </div>
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          align="center"
        </p>
        <Flex
          align="center"
          style={{ height: '100px', backgroundColor: 'var(--color-surface)' }}
        >
          <Box>Short</Box>
          <Box>
            Taller
            <br />
            Item
          </Box>
          <Box>Short</Box>
        </Flex>
      </div>
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          align="end"
        </p>
        <Flex
          align="end"
          style={{ height: '100px', backgroundColor: 'var(--color-surface)' }}
        >
          <Box>Short</Box>
          <Box>
            Taller
            <br />
            Item
          </Box>
          <Box>Short</Box>
        </Flex>
      </div>
    </div>
  ),
}

/* ----------------------------------------
   JUSTIFY
   ---------------------------------------- */

export const Justify: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-8)',
      }}
    >
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          justify="start"
        </p>
        <Flex
          justify="start"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <Box>Item</Box>
          <Box>Item</Box>
        </Flex>
      </div>
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          justify="center"
        </p>
        <Flex
          justify="center"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <Box>Item</Box>
          <Box>Item</Box>
        </Flex>
      </div>
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          justify="end"
        </p>
        <Flex justify="end" style={{ backgroundColor: 'var(--color-surface)' }}>
          <Box>Item</Box>
          <Box>Item</Box>
        </Flex>
      </div>
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          justify="between"
        </p>
        <Flex
          justify="between"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <Box>Item</Box>
          <Box>Item</Box>
        </Flex>
      </div>
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          justify="around"
        </p>
        <Flex
          justify="around"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <Box>Item</Box>
          <Box>Item</Box>
        </Flex>
      </div>
    </div>
  ),
}

/* ----------------------------------------
   WRAP BEHAVIOR
   ---------------------------------------- */

export const WrapBehavior: Story = {
  name: 'Wrap Behavior',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-8)',
      }}
    >
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          wrap={'{true}'} (default) - Items wrap to new lines
        </p>
        <Flex
          wrap={true}
          style={{
            maxWidth: '300px',
            backgroundColor: 'var(--color-surface)',
            padding: 'var(--space-2)',
          }}
        >
          <Box>Item 1</Box>
          <Box>Item 2</Box>
          <Box>Item 3</Box>
          <Box>Item 4</Box>
          <Box>Item 5</Box>
        </Flex>
      </div>
      <div>
        <p
          style={{
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-secondary)',
          }}
        >
          wrap={'{false}'} - Items stay on one line
        </p>
        <Flex
          wrap={false}
          style={{
            maxWidth: '300px',
            backgroundColor: 'var(--color-surface)',
            padding: 'var(--space-2)',
            overflow: 'auto',
          }}
        >
          <Box>Item 1</Box>
          <Box>Item 2</Box>
          <Box>Item 3</Box>
          <Box>Item 4</Box>
          <Box>Item 5</Box>
        </Flex>
      </div>
    </div>
  ),
}
