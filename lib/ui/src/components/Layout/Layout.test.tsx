import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Layout } from './Layout'

describe('Layout', () => {
  it('should render Layout component', () => {
    const { container } = render(
      <Layout>
        <Layout.Navbar icon="barbell" title="Test" />
        <Layout.Container>Content</Layout.Container>
      </Layout>,
    )
    expect(container.firstChild).toBeTruthy()
  })

  it('should render Navbar with icon and title', () => {
    render(
      <Layout>
        <Layout.Navbar icon="barbell" title="Zen Design" />
        <Layout.Container>Content</Layout.Container>
      </Layout>,
    )
    expect(screen.getByText('Zen Design')).toBeTruthy()
  })

  it('should render NavItem components', () => {
    render(
      <Layout>
        <Layout.Navbar icon="barbell" title="Test">
          <Layout.NavItem name="Home" />
          <Layout.NavItem name="About" />
        </Layout.Navbar>
        <Layout.Container>Content</Layout.Container>
      </Layout>,
    )
    expect(screen.getByText('Home')).toBeTruthy()
    expect(screen.getByText('About')).toBeTruthy()
  })

  it('should render Container with children', () => {
    render(
      <Layout>
        <Layout.Navbar icon="barbell" title="Test" />
        <Layout.Container>
          <div>Test Content</div>
        </Layout.Container>
      </Layout>,
    )
    expect(screen.getByText('Test Content')).toBeTruthy()
  })

  it('should handle mobile menu toggle', () => {
    const handleToggle = () => {}
    render(
      <Layout>
        <Layout.Navbar
          icon="barbell"
          title="Test"
          onMenuToggle={handleToggle}
          isMenuOpen={false}
        />
        <Layout.Container>Content</Layout.Container>
      </Layout>,
    )
    // Menu button should be present (visible on mobile)
    const menuButton = screen.getByLabelText('Toggle menu')
    expect(menuButton).toBeTruthy()
  })
})

