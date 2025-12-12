import type { Meta, StoryObj } from '@storybook/react'
import { Logo } from './Logo'
import { withSurface } from '../../../.storybook/decorators'

const meta: Meta<typeof Logo> = {
  title: 'Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  decorators: [withSurface],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    icon: {
      control: 'select',
      options: [
        'check',
        'check-circle',
        'gear',
        'user',
        'search',
        'info',
        'warning',
      ],
      description: 'Icon name to display',
    },
    text: {
      control: 'text',
      description: 'Logo text label',
    },
    iconSize: {
      control: { type: 'number', min: 16, max: 64, step: 2 },
      description: 'Size of the icon in pixels (supports responsive values)',
    },
    href: {
      control: 'text',
      description: 'Optional URL - if provided, renders as a link',
    },
  },
}

export default meta
type Story = StoryObj<typeof Logo>

/* ----------------------------------------
   PLAYGROUND
   ---------------------------------------- */

export const Playground: Story = {
  args: {
    icon: 'check',
    text: 'Zen Design',
    iconSize: 24,
  },
}

/* ----------------------------------------
   BASIC USAGE
   ---------------------------------------- */

export const BasicUsage: Story = {
  name: 'Basic Usage',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      <Logo icon="check" text="Zen Design" />
      <Logo icon="gear" text="Settings" />
      <Logo icon="user" text="Profile" />
    </div>
  ),
}

/* ----------------------------------------
   AS LINK
   ---------------------------------------- */

export const AsLink: Story = {
  name: 'As Link',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
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
          Logo as a clickable link:
        </p>
        <Logo icon="check" text="Zen Design" href="/" />
      </div>
      <div>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Hover and focus states are supported:
        </p>
        <Logo icon="gear" text="Settings" href="/settings" />
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
        gap: 'var(--space-6)',
      }}
    >
      <div>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
            fontFamily: 'var(--font-family-mono)',
          }}
        >
          iconSize={`{ base: 20, md: 32 }`}
        </p>
        <Logo icon="check" text="Zen Design" iconSize={{ base: 20, md: 32 }} />
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginTop: 'var(--space-2)',
          }}
        >
          Resize your browser to see the icon size change
        </p>
      </div>
      <div>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
            fontFamily: 'var(--font-family-mono)',
          }}
        >
          iconSize={`{ base: 24, lg: 40 }`}
        </p>
        <Logo
          icon="check-circle"
          text="Zen Design"
          iconSize={{ base: 24, lg: 40 }}
        />
      </div>
    </div>
  ),
}

/* ----------------------------------------
   WITH DIFFERENT ICONS
   ---------------------------------------- */

export const WithDifferentIcons: Story = {
  name: 'With Different Icons',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      <Logo icon="check" text="Success Brand" />
      <Logo icon="check-circle" text="Verified Company" />
      <Logo icon="gear" text="Settings App" />
      <Logo icon="user" text="User Profile" />
      <Logo icon="search" text="Search Engine" />
      <Logo icon="info" text="Information Hub" />
      <Logo icon="warning" text="Alert System" />
    </div>
  ),
}

/* ----------------------------------------
   ICON SIZES
   ---------------------------------------- */

export const IconSizes: Story = {
  name: 'Icon Sizes',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        alignItems: 'flex-start',
      }}
    >
      {[16, 20, 24, 32, 40].map((size) => (
        <div
          key={size}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}
        >
          <Logo icon="check" text="Zen Design" iconSize={size} />
          <span
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-family-mono)',
            }}
          >
            {size}px
          </span>
        </div>
      ))}
    </div>
  ),
}

/* ----------------------------------------
   WITH AS PROP
   ---------------------------------------- */

export const WithAsProp: Story = {
  name: 'With `as` Prop',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
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
          Logo with `as` prop (rendered as anchor tag):
        </p>
        <Logo as="a" href="#home" icon="check" text="Zen Design" />
      </div>
      <div>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          The Logo component supports polymorphic rendering via the `as` prop.
          You can use it with any component, including routing libraries.
        </p>
        <Logo as="a" href="#about" icon="gear" text="Settings" />
      </div>
    </div>
  ),
}
