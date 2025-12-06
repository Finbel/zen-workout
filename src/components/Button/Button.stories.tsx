import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { withSurface } from '../../../.storybook/decorators'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  decorators: [withSurface],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

/* ----------------------------------------
   PLAYGROUND
   ---------------------------------------- */

export const Playground: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
}

/* ----------------------------------------
   ALL VARIANTS
   ---------------------------------------- */

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div
      style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}
    >
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
}

/* ----------------------------------------
   SIZES
   ---------------------------------------- */

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div
      style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}
    >
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

/* ----------------------------------------
   STATES
   ---------------------------------------- */

export const Disabled: Story = {
  render: () => (
    <div
      style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}
    >
      <Button variant="primary" disabled>
        Primary
      </Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
    </div>
  ),
}
