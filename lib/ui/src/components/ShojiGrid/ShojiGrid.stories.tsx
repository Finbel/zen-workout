import type { Meta, StoryObj } from '@storybook/react'
import { ShojiGrid } from './ShojiGrid'
import { Flex } from '../Flex'

const meta: Meta<typeof ShojiGrid> = {
  title: 'Layout/ShojiGrid',
  component: ShojiGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Design Philosophy: Creating a Shoji Wall Effect

The ShojiGrid component creates the visual effect of a traditional Japanese Shoji wall by combining two key design elements:

### 1. Grid Gaps as Frame

The **gaps** between grid cells serve as the frame structure of the Shoji wall. These gaps display the frame color (\`--shoji-frame\`), creating the visual separation between panels. The gap size can be controlled using the \`gap\` prop (\`'none'\`, \`'sm'\`, or \`'md'\`).

### 2. Strategic Shadow Placement

The **shadowTop** and **shadowRight** props on \`ShojiGrid.Cell\` components create depth by casting inset shadows that overlap the gaps. This gives the illusion that panels are recessed into the frame:

- **shadowTop**: Applies a shadow along the top edge, casting downward to create depth
- **shadowRight**: Applies a shadow along the right edge, casting leftward to create depth

### How It Works Together

When you apply shadows to the correct cells (typically cells that have adjacent cells below or to the right), the shadows overlap the grid gaps using pseudo-elements. This creates the three-dimensional effect where panels appear to sit inside a frame, just like traditional Shoji screens.

**Key principle**: Only apply shadows where there are adjacent cells. For example:
- Cells in the top row should not have \`shadowTop\` (no cell above)
- Cells in the rightmost column should not have \`shadowRight\` (no cell to the right)
- Interior cells typically have both shadows
- Edge cells have only the appropriate shadow(s)

This careful placement of shadows combined with the visible gaps creates the authentic Shoji wall aesthetic.
        `,
      },
    },
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
   HOLY GRAIL LAYOUT (Playground & Documentation)
   ---------------------------------------- */

export const Default: Story = {
  args: {
    gap: 'md',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => (
    <ShojiGrid
      {...args}
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
