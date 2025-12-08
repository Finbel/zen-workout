import type { Meta, StoryObj } from '@storybook/react'
import { TextInput } from './TextInput'
import { withSurface } from '../../../.storybook/decorators'

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  decorators: [withSurface],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'search', 'url', 'tel', 'number'],
      description: 'The type of input',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the input',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input is in an error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
}

export default meta
type Story = StoryObj<typeof TextInput>

/* ----------------------------------------
   PLAYGROUND
   ---------------------------------------- */

export const Playground: Story = {
  args: {
    type: 'text',
    size: 'md',
    placeholder: 'Enter text...',
    error: false,
    disabled: false,
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
        gap: 'var(--space-6)',
        maxWidth: '320px',
      }}
    >
      <TextInput size="sm" placeholder="Small" />
      <TextInput size="md" placeholder="Medium" />
      <TextInput size="lg" placeholder="Large" />
    </div>
  ),
}

/* ----------------------------------------
   ALL TYPES
   ---------------------------------------- */

export const AllTypes: Story = {
  name: 'All Types',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        maxWidth: '320px',
      }}
    >
      <TextInput type="text" placeholder="Text" />
      <TextInput type="password" placeholder="Password" />
      <TextInput type="email" placeholder="Email" />
      <TextInput type="search" placeholder="Search" />
      <TextInput type="url" placeholder="URL" />
      <TextInput type="tel" placeholder="Telephone" />
      <TextInput type="number" placeholder="Number" />
    </div>
  ),
}

/* ----------------------------------------
   ERROR STATE
   ---------------------------------------- */

export const ErrorState: Story = {
  name: 'Error State',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        maxWidth: '320px',
      }}
    >
      <TextInput size="sm" error placeholder="Small with error" />
      <TextInput size="md" error placeholder="Medium with error" />
      <TextInput size="lg" error placeholder="Large with error" />
    </div>
  ),
}

/* ----------------------------------------
   DISABLED
   ---------------------------------------- */

export const Disabled: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        maxWidth: '320px',
      }}
    >
      <TextInput size="sm" disabled placeholder="Small disabled" />
      <TextInput size="md" disabled placeholder="Medium disabled" />
      <TextInput size="lg" disabled placeholder="Large disabled" />
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
        gap: 'var(--space-6)',
        maxWidth: '320px',
      }}
    >
      <div>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Resize the viewport to see the size change:
        </p>
        <TextInput
          size={{ base: 'sm', md: 'lg' }}
          placeholder="Small on mobile, large on desktop"
        />
      </div>
      <div>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Different breakpoint values:
        </p>
        <TextInput
          size={{ base: 'sm', sm: 'md', lg: 'lg' }}
          placeholder="Responsive across breakpoints"
        />
      </div>
    </div>
  ),
}
