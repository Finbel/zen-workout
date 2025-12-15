import { Heading, Text, Button, Flex, Box } from '@zen-design/ui'
import { useActiveWorkoutViewModel } from '../viewmodels/useActiveWorkoutViewModel'
import { Timer } from '../components/Timer'

export function ActiveWorkoutPage() {
  const {
    workout,
    currentExercise,
    currentSet,
    totalTime,
    exerciseTime,
    isLoading,
    error,
    completeSet,
  } = useActiveWorkoutViewModel()

  if (isLoading) {
    return (
      <Box padding="lg">
        <Text>Loading...</Text>
      </Box>
    )
  }

  if (error || !workout || !currentExercise) {
    return (
      <Box padding="lg">
        <Text>{error?.message || 'Workout not found'}</Text>
      </Box>
    )
  }

  return (
    <Box padding="lg">
      <Flex direction="column" gap="md" align="center">
        <Heading size="2xl">
          {currentExercise.exercise?.name || 'Exercise'}
        </Heading>

        <Flex direction="column" gap="md" align="center">
          <Text>
            Set {currentSet} of {currentExercise.sets}
          </Text>
          <Text>Total Workout Time</Text>
          <Timer seconds={totalTime} size="lg" />
          <Text>Exercise Time</Text>
          <Timer seconds={exerciseTime} size="md" />
        </Flex>

        <Button variant="primary" size="lg" onClick={completeSet}>
          Done
        </Button>
      </Flex>
    </Box>
  )
}
