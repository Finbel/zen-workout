import type { Meta, StoryObj } from '@storybook/react'
import { ShojiGrid } from './ShojiGrid'
import { Flex } from '../Flex'

const meta: Meta<typeof ShojiGrid> = {
  title: 'Layout/ShojiGrid',
  component: ShojiGrid,
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
      options: ['none', 'sm', 'md'],
      description: 'Gap between grid items',
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
type Story = StoryObj<typeof ShojiGrid>

/* ----------------------------------------
   PLAYGROUND
   ---------------------------------------- */

export const Playground: Story = {
  args: {
    columns: 3,
  },
  render: (args) => (
    <div style={{ padding: 'var(--space-4)' }}>
      <ShojiGrid {...args}>
        <ShojiGrid.Cell
          shadowRight
          shadowTop={false}
          style={{ padding: 'var(--space-4)', textAlign: 'center' }}
        >
          Item 1
        </ShojiGrid.Cell>
        <ShojiGrid.Cell
          shadowRight
          shadowTop={false}
          style={{ padding: 'var(--space-4)', textAlign: 'center' }}
        >
          Item 2
        </ShojiGrid.Cell>
        <ShojiGrid.Cell
          shadowTop={false}
          style={{ padding: 'var(--space-4)', textAlign: 'center' }}
        >
          Item 3
        </ShojiGrid.Cell>
        <ShojiGrid.Cell
          shadowRight
          shadowTop
          style={{ padding: 'var(--space-4)', textAlign: 'center' }}
        >
          Item 4
        </ShojiGrid.Cell>
        <ShojiGrid.Cell
          shadowRight
          shadowTop
          style={{ padding: 'var(--space-4)', textAlign: 'center' }}
        >
          Item 5
        </ShojiGrid.Cell>
        <ShojiGrid.Cell
          shadowTop
          style={{ padding: 'var(--space-4)', textAlign: 'center' }}
        >
          Item 6
        </ShojiGrid.Cell>
      </ShojiGrid>
    </div>
  ),
}

/* ----------------------------------------
   HOLY GRAIL LAYOUT
   ---------------------------------------- */

export const HolyGrailLayout: Story = {
  name: 'Holy Grail Layout with ShojiGrid.Cell',
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <ShojiGrid
      gridTemplateAreas={{
        base: `
          "header"
          "nav"
          "main"
          "aside"
          "footer"
        `,
        md: `
          "header header header"
          "nav main aside"
          "footer footer footer"
        `,
      }}
      gridTemplateRows={{
        base: '60px auto 1fr auto 50px',
        md: '60px 1fr 50px',
      }}
      gridTemplateColumns={{
        base: '1fr',
        md: '200px 1fr 200px',
      }}
      style={{ minHeight: '100vh' }}
    >
      <ShojiGrid.Cell
        area="header"
        padding={{ base: 'sm', md: 'md' }}
        shadowTop={false}
        shadowRight={false}
      >
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          align="center"
          justify={{ base: 'center', sm: 'between' }}
          gap="md"
        >
          <strong>Logo</strong>
          <nav style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <span>Home</span>
            <span>About</span>
            <span>Contact</span>
          </nav>
        </Flex>
      </ShojiGrid.Cell>
      <ShojiGrid.Cell
        area="nav"
        padding={{ base: 'sm', md: 'md' }}
        shadowTop
        shadowRight={{ base: false, md: true }}
      >
        <Flex direction="column" gap="sm">
          <strong style={{ marginBottom: 'var(--space-2)' }}>Navigation</strong>
          <div>Dashboard</div>
          <div>Projects</div>
          <div>Team</div>
          <div>Settings</div>
        </Flex>
      </ShojiGrid.Cell>
      <ShojiGrid.Cell
        area="main"
        padding={{ base: 'md', md: 'lg' }}
        shadowTop
        shadowRight={{ base: false, md: true }}
      >
        <h2 style={{ marginTop: 0 }}>Main Content</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          This is the main content area using ShojiGrid.Cell with area="main".
          The layout adapts responsively:
        </p>
        <ul style={{ color: 'var(--color-text-secondary)' }}>
          <li>
            <strong>Mobile (base):</strong> All sections stack vertically in a
            single column
          </li>
          <li>
            <strong>Tablet (md+):</strong> Classic holy grail layout with nav
            and aside on the sides
          </li>
        </ul>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          ShojiGrid.Cell extends Box, so it supports responsive padding. For
          flex layouts, wrap content in a Flex component.
        </p>
      </ShojiGrid.Cell>
      <ShojiGrid.Cell
        area="aside"
        padding={{ base: 'sm', md: 'md' }}
        shadowTop
        shadowRight={false}
      >
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
      </ShojiGrid.Cell>
      <ShojiGrid.Cell
        area="footer"
        padding={{ base: 'sm', md: 'md' }}
        shadowTop
        shadowRight={false}
      >
        <Flex direction="row" align="center" justify="center">
          Footer Content
        </Flex>
      </ShojiGrid.Cell>
    </ShojiGrid>
  ),
}
