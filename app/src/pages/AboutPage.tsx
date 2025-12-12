import { Heading, Text, ShojiGrid, Flex } from '@zen-design/ui'

export function AboutPage() {
  return (
    <ShojiGrid
      columns={{ base: 1, md: 2 }}
      padding={{ base: 'md', md: 'lg' }}
      gap={{ base: 'sm', md: 'md' }}
      style={{ height: '100%' }}
    >
      {/* First Column - About Section */}
      <ShojiGrid.Cell
        padding={{ base: 'md', md: 'lg' }}
        shadowTop={false}
        shadowRight={{ base: false, md: true }}
      >
        <Flex direction="column" gap="lg" align="start">
          <Heading size="3xl" level={1}>
            About Zen Design
          </Heading>
          <Text size="base">
            Zen Design is a comprehensive design system built with modern web
            technologies. Our mission is to provide developers with a robust,
            accessible, and beautiful set of components that can be used to
            build exceptional user interfaces.
          </Text>
          <Text size="base">
            We believe in the power of simplicity and consistency. Every
            component in our design system has been carefully crafted to work
            seamlessly together, ensuring a cohesive user experience across all
            applications built with Zen Design.
          </Text>
        </Flex>
      </ShojiGrid.Cell>

      {/* Second Column - Features Section */}
      <ShojiGrid.Cell
        padding={{ base: 'md', md: 'lg' }}
        shadowTop={false}
        shadowRight={false}
      >
        <Flex direction="column" gap="lg" align="start">
          <Heading size="2xl" level={2}>
            Key Features
          </Heading>
          <Flex direction="column" gap="md" align="start">
            <Text size="base">
              <strong>Responsive Design:</strong> All components are built with
              mobile-first principles and adapt beautifully to any screen size.
            </Text>
            <Text size="base">
              <strong>Type Safety:</strong> Built with TypeScript for a better
              developer experience and fewer runtime errors.
            </Text>
            <Text size="base">
              <strong>Accessibility:</strong> Components follow WCAG guidelines
              to ensure your applications are usable by everyone.
            </Text>
            <Text size="base">
              <strong>Customizable:</strong> Easy to theme and customize to
              match your brand identity.
            </Text>
          </Flex>
        </Flex>
      </ShojiGrid.Cell>
    </ShojiGrid>
  )
}

