import type { Meta, StoryObj } from '@storybook/react'
import { Grid } from './Grid'

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    columns: {
      control: 'select',
      options: [1, 2, 3, 4, 'auto-fill', 'auto-fit'],
      description:
        'Number of columns or auto-fill/auto-fit for responsive grids',
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Gap between grid items',
    },
    minChildWidth: {
      control: 'text',
      description:
        'Minimum width for each child when using auto-fill or auto-fit',
    },
    shoji: {
      control: 'select',
      options: ['light', 'heavy', false],
      description:
        "Shoji frame style. 'heavy' for full-screen layouts, 'light' for inset grids",
    },
    gridTemplateRows: {
      control: 'text',
      description: 'Custom grid-template-rows CSS value',
    },
    gridTemplateColumns: {
      control: 'text',
      description:
        'Custom grid-template-columns CSS value (takes precedence over columns)',
    },
    gridTemplateAreas: {
      control: 'text',
      description: 'Grid template areas for named grid placement',
    },
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
type Story = StoryObj<typeof Grid>

/* ----------------------------------------
   PLAYGROUND
   ---------------------------------------- */

export const Playground: Story = {
  args: {
    columns: 3,
    gap: 'sm',
  },
  render: (args) => (
    <div style={{ padding: 'var(--space-4)' }}>
      <Grid {...args}>
        <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
          Item 1
        </div>
        <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
          Item 2
        </div>
        <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
          Item 3
        </div>
        <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
          Item 4
        </div>
        <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
          Item 5
        </div>
        <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
          Item 6
        </div>
      </Grid>
    </div>
  ),
}

/* ----------------------------------------
   HOLY GRAIL LAYOUT
   ---------------------------------------- */

export const HolyGrailLayout: Story = {
  name: 'Holy Grail Layout with Grid.Cell',
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <Grid
      gridTemplateAreas={`
        "header header header"
        "nav main aside"
        "footer footer footer"
      `}
      gridTemplateRows="60px 1fr 50px"
      gridTemplateColumns="200px 1fr 200px"
      gap="none"
      style={{ minHeight: '100vh' }}
    >
      <Grid.Cell
        area="header"
        padding="md"
        direction="row"
        align="center"
        justify="between"
      >
        <strong>Logo</strong>
        <nav style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <span>Home</span>
          <span>About</span>
          <span>Contact</span>
        </nav>
      </Grid.Cell>
      <Grid.Cell area="nav" padding="md" gap="sm">
        <strong style={{ marginBottom: 'var(--space-2)' }}>Navigation</strong>
        <div>Dashboard</div>
        <div>Projects</div>
        <div>Team</div>
        <div>Settings</div>
      </Grid.Cell>
      <Grid.Cell area="main" padding="lg">
        <h2 style={{ marginTop: 0 }}>Main Content</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          This is the main content area using Grid.Cell with area="main".
          Grid.Cell extends Flex, so it can use padding, align, justify, and
          other flex props.
        </p>
      </Grid.Cell>
      <Grid.Cell area="aside" padding="md" gap="sm">
        <strong style={{ marginBottom: 'var(--space-2)' }}>Sidebar</strong>
        <div
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Widget 1
        </div>
        <div
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Widget 2
        </div>
      </Grid.Cell>
      <Grid.Cell
        area="footer"
        padding="md"
        direction="row"
        align="center"
        justify="center"
      >
        Footer Content
      </Grid.Cell>
    </Grid>
  ),
}
