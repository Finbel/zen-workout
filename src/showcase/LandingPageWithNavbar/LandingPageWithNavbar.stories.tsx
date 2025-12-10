import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { css } from '@emotion/react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { Flex } from '../../components/Flex'
import { ShojiGrid } from '../../components/ShojiGrid'
import { Heading } from '../../components/Heading'
import { Text } from '../../components/Text'
import { Table } from '../../components/Table'

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

    // Styles for responsive navbar behavior
    const navbarStyles = css`
      position: sticky;
      top: 0;
      z-index: 100;
      background-color: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
    `

    const desktopNavStyles = css`
      display: none;
      @media (min-width: 1024px) {
        display: flex;
      }
    `

    const mobileMenuButtonStyles = css`
      display: block;
      @media (min-width: 1024px) {
        display: none;
      }
    `

    const mobileMenuStyles = css`
      display: ${isMenuOpen ? 'flex' : 'none'};
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100vh;
      background-color: var(--color-surface);
      z-index: 200;
      padding: var(--space-4);
      @media (min-width: 1024px) {
        display: none;
      }
    `

    return (
      <ShojiGrid
        gridTemplateAreas={{
          base: `
            "navbar"
            "content"
          `,
          md: `
            "navbar"
            "content"
          `,
        }}
        gridTemplateRows={{
          base: 'auto 1fr',
          md: 'auto 1fr',
        }}
        style={{ minHeight: '100vh' }}
      >
        {/* Navbar */}
        <ShojiGrid.Cell
          area="navbar"
          css={navbarStyles}
          padding={{ base: 'sm', md: 'md' }}
        >
          <Flex justify="between" align="center">
            {/* Left side - Logo */}
            <Flex gap="sm" align="center">
              <Icon name="barbell" size={24} />
              <span
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Zen Design
              </span>
            </Flex>

            {/* Right side - Navigation links (desktop) */}
            <Flex css={desktopNavStyles} gap="md" align="center">
              <Button variant="ghost" size="md">
                Home
              </Button>
              <Button variant="ghost" size="md">
                About
              </Button>
            </Flex>

            {/* Mobile hamburger button */}
            <Button
              css={mobileMenuButtonStyles}
              variant="ghost"
              size="md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Icon name="list" size={20} />
            </Button>
          </Flex>
        </ShojiGrid.Cell>

        {/* Mobile menu - Full screen overlay */}
        {isMenuOpen && (
          <div css={mobileMenuStyles}>
            <Flex direction="column" gap="md" align="start">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  alignSelf: 'flex-end',
                  marginBottom: 'var(--space-4)',
                }}
                aria-label="Close menu"
              >
                <Icon name="x" size={20} />
              </Button>
              <Button
                variant="ghost"
                size="md"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                size="md"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Button>
            </Flex>
          </div>
        )}

        {/* Content Area */}
        <ShojiGrid.Cell area="content">
          <ShojiGrid
            columns={{ base: 1, md: 2 }}
            padding={{ base: 'md', md: 'lg' }}
          >
            {/* First Column - Heading and Text */}
            <ShojiGrid.Cell padding={{ base: 'md', md: 'lg' }}>
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
                  Zen Design is a minimal, responsive design system built with
                  React and TypeScript. It provides a comprehensive set of
                  components and utilities to help you build beautiful,
                  accessible user interfaces with ease.
                </Text>
                <Text size="base">
                  Our design system emphasizes simplicity, consistency, and
                  flexibility. Each component is carefully crafted to work
                  seamlessly across different screen sizes and devices, ensuring
                  a great user experience everywhere.
                </Text>
              </div>
            </ShojiGrid.Cell>

            {/* Second Column - Table */}
            <ShojiGrid.Cell padding={{ base: 'md', md: 'lg' }}>
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
                </Table.Body>
              </Table>
            </ShojiGrid.Cell>
          </ShojiGrid>
        </ShojiGrid.Cell>
      </ShojiGrid>
    )
  },
}
