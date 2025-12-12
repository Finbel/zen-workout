import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox } from './Checkbox'
import { withSurface } from '../../../.storybook/decorators'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  decorators: [withSurface],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked (controlled)',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked by default (uncontrolled)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the checkbox',
    },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

/* ----------------------------------------
   PLAYGROUND
   ---------------------------------------- */

export const Playground: Story = {
  args: {
    checked: false,
    disabled: false,
    'aria-label': 'Checkbox',
  },
}

/* ----------------------------------------
   ALL STATES
   ---------------------------------------- */

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          cursor: 'pointer',
        }}
      >
        <Checkbox aria-label="Unchecked checkbox" />
        <span style={{ fontSize: 'var(--font-size-base)' }}>Unchecked</span>
      </label>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          cursor: 'pointer',
        }}
      >
        <Checkbox checked aria-label="Checked checkbox" />
        <span style={{ fontSize: 'var(--font-size-base)' }}>Checked</span>
      </label>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          cursor: 'pointer',
        }}
      >
        <Checkbox disabled aria-label="Disabled unchecked checkbox" />
        <span
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Disabled (unchecked)
        </span>
      </label>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          cursor: 'pointer',
        }}
      >
        <Checkbox checked disabled aria-label="Disabled checked checkbox" />
        <span
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Disabled (checked)
        </span>
      </label>
    </div>
  ),
}

/* ----------------------------------------
   WITH LABELS
   ---------------------------------------- */

export const WithLabels: Story = {
  name: 'With Labels',
  render: () => {
    const [checked1, setChecked1] = useState(false)
    const [checked2, setChecked2] = useState(true)
    const [checked3, setChecked3] = useState(false)

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            cursor: 'pointer',
          }}
        >
          <Checkbox
            checked={checked1}
            onChange={(e) => setChecked1(e.target.checked)}
            id="checkbox-1"
          />
          <span style={{ fontSize: 'var(--font-size-base)' }}>
            Accept terms and conditions
          </span>
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            cursor: 'pointer',
          }}
        >
          <Checkbox
            checked={checked2}
            onChange={(e) => setChecked2(e.target.checked)}
            id="checkbox-2"
          />
          <span style={{ fontSize: 'var(--font-size-base)' }}>
            Subscribe to newsletter
          </span>
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            cursor: 'pointer',
          }}
        >
          <Checkbox
            checked={checked3}
            onChange={(e) => setChecked3(e.target.checked)}
            id="checkbox-3"
          />
          <span style={{ fontSize: 'var(--font-size-base)' }}>
            Enable notifications
          </span>
        </label>
      </div>
    )
  },
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
        gap: 'var(--space-4)',
      }}
    >
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          cursor: 'not-allowed',
        }}
      >
        <Checkbox disabled aria-label="Disabled unchecked checkbox" />
        <span
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Disabled unchecked
        </span>
      </label>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          cursor: 'not-allowed',
        }}
      >
        <Checkbox checked disabled aria-label="Disabled checked checkbox" />
        <span
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Disabled checked
        </span>
      </label>
    </div>
  ),
}

/* ----------------------------------------
   ACCESSIBILITY
   ---------------------------------------- */

export const Accessibility: Story = {
  name: 'Accessibility',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      <div>
        <h3
          style={{
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--space-3)',
          }}
        >
          With aria-label
        </h3>
        <Checkbox aria-label="Accept terms and conditions" />
      </div>
      <div>
        <h3
          style={{
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--space-3)',
          }}
        >
          With label element (recommended)
        </h3>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            cursor: 'pointer',
          }}
        >
          <Checkbox id="accessibility-checkbox" />
          <span style={{ fontSize: 'var(--font-size-base)' }}>
            I agree to the terms
          </span>
        </label>
      </div>
      <div>
        <h3
          style={{
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--space-3)',
          }}
        >
          Keyboard navigation
        </h3>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Use Tab to focus, Space to toggle
        </p>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            cursor: 'pointer',
          }}
        >
          <Checkbox id="keyboard-checkbox" />
          <span style={{ fontSize: 'var(--font-size-base)' }}>
            Focus me with Tab, then press Space
          </span>
        </label>
      </div>
    </div>
  ),
}

/* ----------------------------------------
   INTERACTIVE EXAMPLE
   ---------------------------------------- */

export const InteractiveExample: Story = {
  name: 'Interactive Example',
  render: () => {
    const [items, setItems] = useState([
      { id: 1, label: 'Item 1', checked: false },
      { id: 2, label: 'Item 2', checked: true },
      { id: 3, label: 'Item 3', checked: false },
    ])

    const handleToggle = (id: number) => {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item,
        ),
      )
    }

    const allChecked = items.every((item) => item.checked)
    const someChecked = items.some((item) => item.checked)

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            cursor: 'pointer',
            padding: 'var(--space-2)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: someChecked
              ? 'var(--color-primary-subtle)'
              : 'transparent',
            transition: 'background-color var(--transition-fast)',
          }}
        >
          <Checkbox
            checked={allChecked}
            onChange={(e) => {
              const newChecked = e.target.checked
              setItems(items.map((item) => ({ ...item, checked: newChecked })))
            }}
            id="select-all"
          />
          <span
            style={{
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            Select All
          </span>
        </label>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            paddingLeft: 'var(--space-6)',
          }}
        >
          {items.map((item) => (
            <label
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                cursor: 'pointer',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: item.checked
                  ? 'var(--color-primary-subtle)'
                  : 'transparent',
                transition: 'background-color var(--transition-fast)',
              }}
            >
              <Checkbox
                checked={item.checked}
                onChange={() => handleToggle(item.id)}
                id={`item-${item.id}`}
              />
              <span style={{ fontSize: 'var(--font-size-base)' }}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    )
  },
}

