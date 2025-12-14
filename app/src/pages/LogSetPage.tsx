import { useEffect } from 'react'
import { Heading, Text, Button, Flex, Box, TextInput } from '@zen-design/ui'
import { Timer } from '../components/Timer'
import { useLogSetViewModel } from '../viewmodels/useLogSetViewModel'

export function LogSetPage() {
  const {
    workout,
    exercise,
    weight,
    reps,
    time,
    totalTime,
    restTime,
    exerciseDuration,
    isLoading,
    error,
    setWeight,
    setReps,
    setTime,
    saveSet,
  } = useLogSetViewModel()

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'LogSetPage.tsx:render',
        message: 'LogSetPage rendering with restTime',
        data: { restTime, hasExercise: !!exercise, hasWorkout: !!workout },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'D',
      }),
    }).catch(() => {})
  }, [restTime, exercise, workout])
  // #endregion

  if (!exercise || !workout) {
    return (
      <Box padding="lg">
        <Text>Loading...</Text>
      </Box>
    )
  }

  return (
    <Box padding="lg">
      <Flex direction="column" gap="lg" align="center">
        <Heading size="2xl">{exercise.name}</Heading>

        <Flex direction="column" gap="md" align="center">
          <Text>Total Workout Time</Text>
          <Timer seconds={totalTime} size="lg" />
          <Text>Exercise Duration</Text>
          <Timer seconds={exerciseDuration} size="md" />
          {/* Always show rest timer when on LogSetPage - it starts at 0 */}
          <Text>Rest Time</Text>
          <Timer seconds={restTime} size="md" />
        </Flex>

        <Flex
          direction="column"
          gap="md"
          style={{ width: '100%', maxWidth: '400px' }}
        >
          {exercise.usesWeight && (
            <Flex direction="column" gap="sm">
              <Text>Weight (lbs)</Text>
              <TextInput
                type="number"
                value={weight}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWeight(e.target.value)
                }
                placeholder="Weight"
              />
            </Flex>
          )}

          {exercise.usesReps && (
            <Flex direction="column" gap="sm">
              <Text>Reps</Text>
              <TextInput
                type="number"
                value={reps}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setReps(e.target.value)
                }
                placeholder="Reps"
              />
            </Flex>
          )}

          {exercise.usesTime && (
            <Flex direction="column" gap="sm">
              <Text>Time (seconds)</Text>
              <TextInput
                type="number"
                value={time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTime(e.target.value)
                }
                placeholder="Time"
              />
            </Flex>
          )}
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
          onClick={saveSet}
          disabled={isLoading}
        >
          Save
        </Button>
      </Flex>
    </Box>
  )
}
