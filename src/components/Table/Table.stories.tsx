import type { Meta, StoryObj } from '@storybook/react'
import { Table } from './Table'
import { withSurface } from '../../../.storybook/decorators'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  decorators: [withSurface],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Table>

/* ----------------------------------------
   PLAYGROUND
   ---------------------------------------- */

export const Playground: Story = {
  render: () => (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>Name</Table.Header>
          <Table.Header>Email</Table.Header>
          <Table.Header>Role</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>John Doe</Table.Cell>
          <Table.Cell>john@example.com</Table.Cell>
          <Table.Cell>Admin</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Jane Smith</Table.Cell>
          <Table.Cell>jane@example.com</Table.Cell>
          <Table.Cell>User</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
}

/* ----------------------------------------
   BASIC USAGE
   ---------------------------------------- */

export const BasicUsage: Story = {
  name: 'Basic Usage',
  render: () => (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>Product</Table.Header>
          <Table.Header>Price</Table.Header>
          <Table.Header>Stock</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Widget A</Table.Cell>
          <Table.Cell>$29.99</Table.Cell>
          <Table.Cell>45</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Widget B</Table.Cell>
          <Table.Cell>$39.99</Table.Cell>
          <Table.Cell>12</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Widget C</Table.Cell>
          <Table.Cell>$49.99</Table.Cell>
          <Table.Cell>8</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
}

/* ----------------------------------------
   MULTIPLE ROWS
   ---------------------------------------- */

export const MultipleRows: Story = {
  name: 'Multiple Rows',
  render: () => (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>Name</Table.Header>
          <Table.Header>Department</Table.Header>
          <Table.Header>Status</Table.Header>
          <Table.Header>Last Active</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Alice Johnson</Table.Cell>
          <Table.Cell>Engineering</Table.Cell>
          <Table.Cell>Active</Table.Cell>
          <Table.Cell>2 hours ago</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Bob Williams</Table.Cell>
          <Table.Cell>Design</Table.Cell>
          <Table.Cell>Active</Table.Cell>
          <Table.Cell>5 hours ago</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Charlie Brown</Table.Cell>
          <Table.Cell>Marketing</Table.Cell>
          <Table.Cell>Inactive</Table.Cell>
          <Table.Cell>2 days ago</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Diana Prince</Table.Cell>
          <Table.Cell>Sales</Table.Cell>
          <Table.Cell>Active</Table.Cell>
          <Table.Cell>1 hour ago</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Eve Davis</Table.Cell>
          <Table.Cell>Support</Table.Cell>
          <Table.Cell>Active</Table.Cell>
          <Table.Cell>30 minutes ago</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
}

/* ----------------------------------------
   WITH LONG CONTENT
   ---------------------------------------- */

export const WithLongContent: Story = {
  name: 'With Long Content',
  render: () => (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>Title</Table.Header>
          <Table.Header>Description</Table.Header>
          <Table.Header>Category</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Building Accessible Web Applications</Table.Cell>
          <Table.Cell>
            A comprehensive guide to creating web applications that are usable
            by everyone, including people with disabilities. This book covers
            WCAG guidelines, ARIA attributes, and practical implementation
            strategies.
          </Table.Cell>
          <Table.Cell>Web Development</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Design Systems in Practice</Table.Cell>
          <Table.Cell>
            Learn how to build and maintain design systems that scale across
            teams and products. Includes case studies from leading tech
            companies and practical frameworks for implementation.
          </Table.Cell>
          <Table.Cell>Design</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
}

