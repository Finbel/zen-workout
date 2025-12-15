import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Layout } from './Layout'
import { Heading } from '../Heading'
import { Text } from '../Text'
import { Table } from '../Table'
import { ShojiGrid } from '../ShojiGrid'
import { Flex } from '../Flex'

const meta: Meta = {
  title: 'Components/Layout',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj

const PlaygroundComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <Layout>
      <Layout.Navbar
        icon="barbell"
        title="Zen Design"
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      >
        <Layout.NavItem name="Home" />
        <Layout.NavItem name="About" />
      </Layout.Navbar>
      <Layout.Container>
        {isMenuOpen ? (
          <Flex
            direction="column"
            gap="md"
            align="start"
            padding={{ base: 'md', md: 'lg' }}
          >
            <Layout.NavItem
              name="Home"
              onClick={() => setIsMenuOpen(false)}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            />
            <Layout.NavItem
              name="About"
              onClick={() => setIsMenuOpen(false)}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            />
          </Flex>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Heading size="3xl" level={1}>
              Welcome to Zen Design
            </Heading>
            <Text size="base">
              Zen Design is a minimal, responsive design system built with React
              and TypeScript.
            </Text>
          </div>
        )}
      </Layout.Container>
    </Layout>
  )
}

export const Playground: Story = {
  render: () => <PlaygroundComponent />,
}

const ComplexContentComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <Layout>
      <Layout.Navbar
        icon="barbell"
        title="Zen Design"
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      >
        <Layout.NavItem name="Home" />
        <Layout.NavItem name="About" />
        <Layout.NavItem name="Contact" />
      </Layout.Navbar>
      <Layout.Container>
        {isMenuOpen ? (
          <Flex
            direction="column"
            gap="md"
            align="start"
            padding={{ base: 'md', md: 'lg' }}
          >
            <Layout.NavItem
              name="Home"
              onClick={() => setIsMenuOpen(false)}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            />
            <Layout.NavItem
              name="About"
              onClick={() => setIsMenuOpen(false)}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            />
            <Layout.NavItem
              name="Contact"
              onClick={() => setIsMenuOpen(false)}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            />
          </Flex>
        ) : (
          <ShojiGrid
            columns={{ base: 1, md: 2 }}
            gap={{ base: 'sm', md: 'md' }}
            style={{ height: '100%' }}
          >
            <ShojiGrid.Cell padding={{ base: 'md', md: 'lg' }}>
              <Heading size="3xl" level={1}>
                Welcome to Zen Design
              </Heading>
              <Text size="base">
                Zen Design is a minimal, responsive design system built with
                React and TypeScript.
              </Text>
            </ShojiGrid.Cell>
            <ShojiGrid.Cell padding={{ base: 'md', md: 'lg' }}>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>Component</Table.Header>
                    <Table.Header>Status</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Layout</Table.Cell>
                    <Table.Cell>Stable</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Button</Table.Cell>
                    <Table.Cell>Stable</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </ShojiGrid.Cell>
          </ShojiGrid>
        )}
      </Layout.Container>
    </Layout>
  )
}

export const ComplexContent: Story = {
  name: 'Complex Content',
  render: () => <ComplexContentComponent />,
}

const WithAsPropComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <Layout>
      <Layout.Navbar
        icon="barbell"
        title="Zen Design"
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      >
        <Layout.NavItem href="#home" name="Home" />
        <Layout.NavItem href="#about" name="About" />
      </Layout.Navbar>
      <Layout.Container>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Heading size="3xl" level={1}>
            Using the `as` prop
          </Heading>
          <Text size="base">
            The Layout.NavItem component supports polymorphic rendering via the
            `as` prop. You can use it with any component, including routing
            libraries.
          </Text>
          <Text size="base">
            In this example, nav items are rendered as anchor tags using
            `as="a"`.
          </Text>
        </div>
      </Layout.Container>
    </Layout>
  )
}

export const WithAsProp: Story = {
  name: 'With `as` Prop',
  render: () => <WithAsPropComponent />,
}
