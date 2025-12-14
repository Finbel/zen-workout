import { Heading, Text, Button, Flex, Box } from '@zen-design/ui'
import { useStartWorkoutViewModel } from '../viewmodels/useStartWorkoutViewModel'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { createWorkoutTrackerUseCases } from '@zen-design/domain'
import { LocalStorageExerciseAdapter } from '../adapters/LocalStorageExerciseAdapter'
import { LocalStorageWorkoutAdapter } from '../adapters/LocalStorageWorkoutAdapter'
import { LocalStorageWorkoutLogAdapter } from '../adapters/LocalStorageWorkoutLogAdapter'
import type { Exercise } from '@zen-design/domain'

export function StartWorkoutPage() {
  const { workout, isLoading, error, startWorkout } = useStartWorkoutViewModel()
  const navigate = useNavigate()
  const [exerciseMap, setExerciseMap] = useState<Map<string, Exercise>>(
    new Map(),
  )

  const useCases = useMemo(() => {
    const exerciseAdapter = new LocalStorageExerciseAdapter()
    const workoutAdapter = new LocalStorageWorkoutAdapter()
    const workoutLogAdapter = new LocalStorageWorkoutLogAdapter()
    return createWorkoutTrackerUseCases({
      exerciseRepositoryPort: exerciseAdapter,
      workoutRepositoryPort: workoutAdapter,
      workoutLogRepositoryPort: workoutLogAdapter,
    })
  }, [])

  useEffect(() => {
    const loadExercises = async () => {
      if (!workout) return

      const exercises = new Map<string, Exercise>()
      for (const workoutExercise of workout.exercises) {
        const exercise = await useCases.getExerciseById(
          workoutExercise.exerciseId as string,
        )
        if (exercise) {
          exercises.set(workoutExercise.exerciseId as string, exercise)
        }
      }
      setExerciseMap(exercises)
    }

    loadExercises()
  }, [workout, useCases])

  if (isLoading) {
    return (
      <Box padding="lg">
        <Text>Loading...</Text>
      </Box>
    )
  }

  if (error || !workout) {
    return (
      <Box padding="lg">
        <Text>{error?.message || 'Workout not found'}</Text>
        <Button onClick={() => navigate('/workouts')}>Back to Workouts</Button>
      </Box>
    )
  }

  return (
    <Box padding="lg">
      <Flex direction="column" gap="lg">
        <Heading size="2xl">Start Workout: {workout.name}</Heading>

        <Flex direction="column" gap="md">
          <Text>Exercises in this workout:</Text>
          {workout.exercises.map((workoutExercise, index) => {
            const exercise = exerciseMap.get(
              workoutExercise.exerciseId as string,
            )
            return (
              <Box
                key={index}
                padding="md"
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <Flex justify="between">
                  <Text>{exercise?.name || 'Unknown Exercise'}</Text>
                  <Text>{workoutExercise.sets} sets</Text>
                </Flex>
              </Box>
            )
          })}
        </Flex>

        <Flex gap="md">
          <Button variant="primary" onClick={startWorkout} disabled={isLoading}>
            Start Workout
          </Button>
          <Button variant="outline" onClick={() => navigate('/workouts')}>
            Cancel
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}
