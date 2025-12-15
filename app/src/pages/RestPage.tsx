import { Heading, Text, Button, Flex, Box } from '@zen-design/ui'
import { Timer } from '../components/Timer'
import { useRestViewModel } from '../viewmodels/useRestViewModel'

export function RestPage() {
  const {
    nextExerciseName,
    totalTime,
    restTime,
    nextSet,
    isLoading,
    error,
    startNextSet,
  } = useRestViewModel()

  return (
    <Box padding="lg">
      <Flex direction="column" gap={{ base: 'sm', md: 'md' }} align="center">
        <Heading size="2xl">Rest</Heading>
        <Text>Next: {nextExerciseName || 'Exercise'}</Text>
        <Text>Set {nextSet}</Text>

        <Flex direction="column" gap="md" align="center">
          <Text>Total Workout Time</Text>
          <Timer seconds={totalTime} size="lg" />
          <Text>Rest Time</Text>
          <Timer seconds={restTime} size="md" />
        </Flex>

        {error && (
          <Box
            padding="md"
            style={{
              backgroundColor: 'var(--color-error)',
              color: 'var(--color-text-inverse)',
            }}
          >
            <Text>{error.message}</Text>
          </Box>
        )}

        <Button
          variant="primary"
          size="lg"
          onClick={startNextSet}
          disabled={isLoading}
        >
          Start Next Set
        </Button>
      </Flex>
    </Box>
  )
}
