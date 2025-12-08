import type { Meta, StoryObj } from '@storybook/react'
import { Icon, ICON_NAMES } from './Icon'
import { withSurface } from '../../../.storybook/decorators'

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  decorators: [withSurface],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    name: {
      control: 'select',
      options: ICON_NAMES,
      description: 'The icon to display',
    },
    size: {
      control: { type: 'number', min: 12, max: 64, step: 4 },
      description: 'Size of the icon in pixels (supports responsive values)',
    },
    color: {
      control: 'color',
      description: 'The color of the icon (supports responsive values)',
    },
    alt: {
      control: 'text',
      description: 'Accessible label for screen readers',
    },
  },
}

export default meta
type Story = StoryObj<typeof Icon>

/* ----------------------------------------
   PLAYGROUND
   ---------------------------------------- */

export const Playground: Story = {
  args: {
    name: 'check',
    size: 24,
    color: 'currentColor',
  },
}

/* ----------------------------------------
   ALL ICONS GALLERY
   ---------------------------------------- */

export const AllIcons: Story = {
  name: 'All Icons',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 'var(--space-4)',
      }}
    >
      {ICON_NAMES.map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <Icon name={name} size={24} />
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-family-mono)',
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
}

/* ----------------------------------------
   SIZES
   ---------------------------------------- */

export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-6)',
        alignItems: 'center',
      }}
    >
      {[16, 20, 24, 32, 48].map((size) => (
        <div
          key={size}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <Icon name="check-circle" size={size} />
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-secondary)',
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
   COLORS
   ---------------------------------------- */

export const Colors: Story = {
  name: 'Colors',
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-4)',
        alignItems: 'center',
      }}
    >
      <Icon name="info" size={24} color="var(--color-info)" />
      <Icon name="check-circle" size={24} color="var(--color-success)" />
      <Icon name="warning" size={24} color="var(--color-warning)" />
      <Icon name="x-circle" size={24} color="var(--color-error)" />
      <Icon name="user" size={24} color="var(--color-primary)" />
    </div>
  ),
}

/* ----------------------------------------
   USE CASES
   ---------------------------------------- */

export const UseCases: Story = {
  name: 'Common Use Cases',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      {/* Navigation */}
      <div>
        <h4
          style={{
            margin: '0 0 var(--space-3) 0',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-wide)',
          }}
        >
          Navigation
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <Icon name="arrow-left" size={24} />
          <Icon name="arrow-right" size={24} />
          <Icon name="caret-down" size={24} />
          <Icon name="caret-up" size={24} />
          <Icon name="list" size={24} />
        </div>
      </div>

      {/* Actions */}
      <div>
        <h4
          style={{
            margin: '0 0 var(--space-3) 0',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-wide)',
          }}
        >
          Actions
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <Icon name="plus" size={24} />
          <Icon name="minus" size={24} />
          <Icon name="check" size={24} />
          <Icon name="x" size={24} />
          <Icon name="pencil" size={24} />
          <Icon name="trash" size={24} />
        </div>
      </div>

      {/* Status */}
      <div>
        <h4
          style={{
            margin: '0 0 var(--space-3) 0',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-wide)',
          }}
        >
          Status
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <Icon name="info" size={24} color="var(--color-info)" />
          <Icon name="check-circle" size={24} color="var(--color-success)" />
          <Icon name="warning" size={24} color="var(--color-warning)" />
          <Icon name="x-circle" size={24} color="var(--color-error)" />
        </div>
      </div>

      {/* Utility */}
      <div>
        <h4
          style={{
            margin: '0 0 var(--space-3) 0',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-wide)',
          }}
        >
          Utility
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <Icon name="search" size={24} />
          <Icon name="user" size={24} />
          <Icon name="gear" size={24} />
          <Icon name="envelope" size={24} />
          <Icon name="bell" size={24} />
        </div>
      </div>
    </div>
  ),
}

/* ----------------------------------------
   RESPONSIVE PROPS
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
        <h4
          style={{
            margin: '0 0 var(--space-3) 0',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-wide)',
          }}
        >
          Responsive Size (Resize viewport to see changes)
        </h4>
        <p
          style={{
            margin: '0 0 var(--space-4) 0',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Base: 20px, MD: 32px, LG: 48px
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            alignItems: 'center',
          }}
        >
          <Icon name="check-circle" size={{ base: 20, md: 32, lg: 48 }} />
          <Icon name="info" size={{ base: 20, md: 32, lg: 48 }} />
          <Icon name="warning" size={{ base: 20, md: 32, lg: 48 }} />
        </div>
      </div>

      <div>
        <h4
          style={{
            margin: '0 0 var(--space-3) 0',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-wide)',
          }}
        >
          Responsive Size with String Values
        </h4>
        <p
          style={{
            margin: '0 0 var(--space-4) 0',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Base: 1rem, MD: 1.5rem, LG: 2rem
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            alignItems: 'center',
          }}
        >
          <Icon
            name="check-circle"
            size={{ base: '1rem', md: '1.5rem', lg: '2rem' }}
          />
          <Icon name="info" size={{ base: '1rem', md: '1.5rem', lg: '2rem' }} />
        </div>
      </div>
    </div>
  ),
}

export const ResponsiveColor: Story = {
  name: 'Responsive Color',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      <div>
        <h4
          style={{
            margin: '0 0 var(--space-3) 0',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-wide)',
          }}
        >
          Responsive Color (Resize viewport to see changes)
        </h4>
        <p
          style={{
            margin: '0 0 var(--space-4) 0',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Base: currentColor, MD: var(--color-primary), LG:
          var(--color-secondary)
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            alignItems: 'center',
          }}
        >
          <Icon
            name="check-circle"
            size={32}
            color={{
              base: 'currentColor',
              md: 'var(--color-primary)',
              lg: 'var(--color-secondary)',
            }}
          />
          <Icon
            name="info"
            size={32}
            color={{
              base: 'currentColor',
              md: 'var(--color-info)',
              lg: 'var(--color-success)',
            }}
          />
        </div>
      </div>

      <div>
        <h4
          style={{
            margin: '0 0 var(--space-3) 0',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-wide)',
          }}
        >
          Responsive Size and Color Combined
        </h4>
        <p
          style={{
            margin: '0 0 var(--space-4) 0',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Size: base 20px → md 32px, Color: base currentColor → md
          var(--color-primary)
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            alignItems: 'center',
          }}
        >
          <Icon
            name="check-circle"
            size={{ base: 20, md: 32 }}
            color={{
              base: 'currentColor',
              md: 'var(--color-primary)',
            }}
          />
          <Icon
            name="warning"
            size={{ base: 20, md: 32 }}
            color={{
              base: 'currentColor',
              md: 'var(--color-warning)',
            }}
          />
        </div>
      </div>
    </div>
  ),
}
