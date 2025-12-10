import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Table } from './Table'

describe('Table', () => {
  describe('Component Rendering', () => {
    it('should render with children', () => {
      const { getByText } = render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Header</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Content</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      )
      expect(getByText('Header')).toBeInTheDocument()
      expect(getByText('Content')).toBeInTheDocument()
    })

    it('should render with default props', () => {
      const { container } = render(<Table />)
      const element = container.querySelector('.zen-table')
      expect(element).toBeInTheDocument()
    })

    it('should apply base class name', () => {
      const { container } = render(<Table />)
      const element = container.querySelector('.zen-table')
      expect(element).toHaveClass('zen-table')
    })

    it('should render as a table element', () => {
      const { container } = render(<Table />)
      const element = container.querySelector('table')
      expect(element).toBeInTheDocument()
      expect(element).toHaveClass('zen-table')
    })
  })

  describe('Compound Component Structure', () => {
    it('should have Head sub-component', () => {
      expect(Table.Head).toBeDefined()
    })

    it('should have Body sub-component', () => {
      expect(Table.Body).toBeDefined()
    })

    it('should have Row sub-component', () => {
      expect(Table.Row).toBeDefined()
    })

    it('should have Header sub-component', () => {
      expect(Table.Header).toBeDefined()
    })

    it('should have Cell sub-component', () => {
      expect(Table.Cell).toBeDefined()
    })

    it('should render Head with correct element', () => {
      const { container } = render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Test</Table.Header>
            </Table.Row>
          </Table.Head>
        </Table>,
      )
      const head = container.querySelector('thead')
      expect(head).toBeInTheDocument()
      expect(head).toHaveClass('zen-table-head')
    })

    it('should render Body with correct element', () => {
      const { container } = render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Test</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      )
      const body = container.querySelector('tbody')
      expect(body).toBeInTheDocument()
      expect(body).toHaveClass('zen-table-body')
    })

    it('should render Row with correct element', () => {
      const { container } = render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Test</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      )
      const row = container.querySelector('tr')
      expect(row).toBeInTheDocument()
      expect(row).toHaveClass('zen-table-row')
    })

    it('should render Header with correct element', () => {
      const { container } = render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Test</Table.Header>
            </Table.Row>
          </Table.Head>
        </Table>,
      )
      const header = container.querySelector('th')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('zen-table-header')
    })

    it('should render Cell with correct element', () => {
      const { container } = render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Test</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      )
      const cell = container.querySelector('td')
      expect(cell).toBeInTheDocument()
      expect(cell).toHaveClass('zen-table-cell')
    })
  })

  describe('Header Styling', () => {
    it('should apply bold font weight to headers', () => {
      const { container } = render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Header</Table.Header>
            </Table.Row>
          </Table.Head>
        </Table>,
      )
      const header = container.querySelector('.zen-table-header') as HTMLElement
      const styles = getComputedStyle(header)
      // Check that font-weight is semibold (600) or bold (700)
      const fontWeight = styles.fontWeight
      expect(['600', '700', 'bold']).toContain(fontWeight)
    })

    it('should have correct display name', () => {
      expect(Table.Header.displayName).toBe('Table.Header')
    })
  })

  describe('Row Highlighting', () => {
    it('should render multiple rows in body', () => {
      const { container } = render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Row 1</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Row 2</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Row 3</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      )
      const rows = container.querySelectorAll('.zen-table-row')
      expect(rows).toHaveLength(3)
    })

    it('should apply row classes correctly', () => {
      const { container } = render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Row 1</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Row 2</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      )
      const rows = container.querySelectorAll('.zen-table-row')
      rows.forEach((row) => {
        expect(row).toHaveClass('zen-table-row')
      })
    })
  })

  describe('Display Names', () => {
    it('should have correct display name for Table', () => {
      expect(Table.displayName).toBe('Table')
    })

    it('should have correct display name for Head', () => {
      expect(Table.Head.displayName).toBe('Table.Head')
    })

    it('should have correct display name for Body', () => {
      expect(Table.Body.displayName).toBe('Table.Body')
    })

    it('should have correct display name for Row', () => {
      expect(Table.Row.displayName).toBe('Table.Row')
    })

    it('should have correct display name for Header', () => {
      expect(Table.Header.displayName).toBe('Table.Header')
    })

    it('should have correct display name for Cell', () => {
      expect(Table.Cell.displayName).toBe('Table.Cell')
    })
  })

  describe('Edge Cases', () => {
    it('should merge custom className', () => {
      const { container } = render(<Table className="custom-class" />)
      const element = container.querySelector('.zen-table')
      expect(element).toHaveClass('zen-table')
      expect(element).toHaveClass('custom-class')
    })

    it('should merge custom style', () => {
      const { container } = render(<Table style={{ width: '500px' }} />)
      const element = container.querySelector('.zen-table') as HTMLElement
      const style = getComputedStyle(element)
      expect(style.width).toBe('500px')
    })

    it('should handle empty table', () => {
      const { container } = render(<Table />)
      const element = container.querySelector('.zen-table')
      expect(element).toBeInTheDocument()
    })

    it('should handle table with only head', () => {
      const { container } = render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Header</Table.Header>
            </Table.Row>
          </Table.Head>
        </Table>,
      )
      const head = container.querySelector('.zen-table-head')
      expect(head).toBeInTheDocument()
    })

    it('should handle table with only body', () => {
      const { container } = render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      )
      const body = container.querySelector('.zen-table-body')
      expect(body).toBeInTheDocument()
    })
  })
})

