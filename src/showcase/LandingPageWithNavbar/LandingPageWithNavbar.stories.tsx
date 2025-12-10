import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Flex } from '../../components/Flex'
import { ShojiGrid } from '../../components/ShojiGrid'
import { Heading } from '../../components/Heading'
import { Text } from '../../components/Text'
import { Table } from '../../components/Table'
import { Layout } from '../../components/Layout'

const meta: Meta = {
  title: 'Showcase/LandingPageWithNavbar',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj

/* ----------------------------------------
   LANDING PAGE WITH NAVBAR
   ---------------------------------------- */

export const Default: Story = {
  name: 'Landing Page with Navbar',
  render: () => {
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
            <ShojiGrid
              columns={{ base: 1, md: 2 }}
              padding={{ base: 'md', md: 'lg' }}
              gap={{ base: 'sm', md: 'md' }}
              style={{ height: '100%' }}
            >
              {/* First Column - Heading and Text */}
              <ShojiGrid.Cell
                padding={{ base: 'md', md: 'lg' }}
                shadowTop={false}
                shadowRight={{ base: false, md: true }}
              >
                <Flex direction="column" gap="md" align="center">
                  <Heading size="3xl" level={1} textAlign="center">
                    Welcome to Zen Design
                  </Heading>
                  <Text size="base" textAlign="center">
                    Zen Design is a minimal, responsive design system built with
                    React and TypeScript. It provides a comprehensive set of
                    components and utilities to help you build beautiful,
                    accessible user interfaces with ease.
                  </Text>
                  <Text size="base" textAlign="center">
                    Our design system emphasizes simplicity, consistency, and
                    flexibility. Each component is carefully crafted to work
                    seamlessly across different screen sizes and devices,
                    ensuring a great user experience everywhere.
                  </Text>
                </Flex>
              </ShojiGrid.Cell>

              {/* Second Column - Table */}
              <ShojiGrid.Cell
                padding={{ base: 'md', md: 'lg' }}
                shadowTop={false}
                shadowRight={false}
              >
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Header>Component</Table.Header>
                      <Table.Header>Status</Table.Header>
                      <Table.Header>Version</Table.Header>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Button</Table.Cell>
                      <Table.Cell>Stable</Table.Cell>
                      <Table.Cell>1.0.0</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Icon</Table.Cell>
                      <Table.Cell>Stable</Table.Cell>
                      <Table.Cell>1.0.0</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Flex</Table.Cell>
                      <Table.Cell>Stable</Table.Cell>
                      <Table.Cell>1.0.0</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>ShojiGrid</Table.Cell>
                      <Table.Cell>Stable</Table.Cell>
                      <Table.Cell>1.0.0</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Table</Table.Cell>
                      <Table.Cell>Stable</Table.Cell>
                      <Table.Cell>1.0.0</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Heading</Table.Cell>
                      <Table.Cell>Stable</Table.Cell>
                      <Table.Cell>1.0.0</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Text</Table.Cell>
                      <Table.Cell>Stable</Table.Cell>
                      <Table.Cell>1.0.0</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Layout</Table.Cell>
                      <Table.Cell>Stable</Table.Cell>
                      <Table.Cell>1.0.0</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </ShojiGrid.Cell>
            </ShojiGrid>
          )}
        </Layout.Container>
      </Layout>
    )
  },
}
