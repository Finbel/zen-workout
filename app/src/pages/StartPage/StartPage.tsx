import { Heading, Text, Button, ShojiGrid, Flex } from '@zen-design/ui'
import { useCounterViewModel } from './useCounterViewModel'

export function StartPage() {
  const { counterValue, isLoading, incrementCounter } = useCounterViewModel()

  return (
    <ShojiGrid
      columns={{ base: 1, md: 2 }}
      padding={{ base: 'md', md: 'lg' }}
      gap={{ base: 'sm', md: 'md' }}
      style={{ height: '100%' }}
    >
      {/* First Column - Hero Section */}
      <ShojiGrid.Cell
        padding={{ base: 'md', md: 'lg' }}
        shadowTop={false}
        shadowRight={{ base: false, md: true }}
      >
        <Flex direction="column" gap="lg" align="start">
          <Heading size="3xl" level={1}>
            Welcome to Zen Design
          </Heading>
          <Text size="base">
            Zen Design is a minimal, responsive design system built with React
            and TypeScript. It provides a comprehensive set of components and
            utilities to help you build beautiful, accessible user interfaces
            with ease.
          </Text>
          <Text size="base">
            Our design system emphasizes simplicity, consistency, and
            flexibility. Each component is carefully crafted to work seamlessly
            across different screen sizes and devices, ensuring a great user
            experience everywhere.
          </Text>
        </Flex>
      </ShojiGrid.Cell>

      {/* Second Column - Counter Demo */}
      <ShojiGrid.Cell
        padding={{ base: 'md', md: 'lg' }}
        shadowTop={false}
        shadowRight={false}
      >
        <Flex direction="column" gap="lg" align="start">
          <Heading size="2xl" level={2}>
            Domain Integration
          </Heading>
          <Text size="base">
            This page demonstrates the integration between the UI components and
            domain use cases. The counter below uses the StoragePort pattern to
            persist values in localStorage.
          </Text>
          <Flex
            direction="column"
            gap="md"
            align="start"
            style={{
              padding: 'var(--space-lg)',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              width: '100%',
            }}
          >
            <Text
              size="lg"
              style={{ fontWeight: 'var(--font-weight-semibold)' }}
            >
              Counter Value
            </Text>
            {isLoading ? (
              <Text
                size="base"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Loading...
              </Text>
            ) : (
              <Heading size="4xl" level={2} style={{ margin: 0 }}>
                {counterValue}
              </Heading>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={incrementCounter}
              disabled={isLoading}
            >
              Increment Counter
            </Button>
          </Flex>
        </Flex>
      </ShojiGrid.Cell>
    </ShojiGrid>
  )
}
