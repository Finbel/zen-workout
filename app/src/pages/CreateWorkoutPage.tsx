import { useState } from 'react'
import { Heading, Text, Button, Flex, Box, TextInput } from '@zen-design/ui'
import { useCreateWorkoutViewModel } from '../viewmodels/useCreateWorkoutViewModel'
import { useNavigate } from 'react-router-dom'
import { ExerciseSearchInput } from '../components/ExerciseSearchInput'
import { SetCounter } from '../components/SetCounter'
import type { Exercise } from '@zen-design/domain'

export function CreateWorkoutPage() {
  const {
    exercises,
    selectedExercises,
    isLoading,
    error,
    addExercise,
    removeExercise,
    updateSets,
    createWorkout,
  } = useCreateWorkoutViewModel()
  const navigate = useNavigate()

  const [workoutName, setWorkoutName] = useState('')

  const handleExerciseSelect = (exercise: Exercise) => {
    // Check if already added
    const exists = selectedExercises.some((ex) => ex.exerciseId === exercise.id)
    if (!exists) {
      addExercise(exercise.id as any, 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createWorkout(workoutName)
  }

  return (
    <Box padding="lg">
      <Flex direction="column" gap="lg">
        <Heading size="2xl">Create Workout</Heading>

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

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="md">
            <Flex direction="column" gap="sm">
              <Text>Workout Name</Text>
              <TextInput
                value={workoutName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWorkoutName(e.target.value)
                }
                placeholder="Workout name"
                required
              />
            </Flex>

            <Flex direction="column" gap="sm">
              <Text>Add Exercises</Text>
              <ExerciseSearchInput
                exercises={exercises}
                onSelect={handleExerciseSelect}
              />
            </Flex>

            {selectedExercises.length > 0 && (
              <Flex direction="column" gap="sm">
                <Text>Selected Exercises</Text>
                {selectedExercises.map((workoutExercise) => {
                  const exercise = workoutExercise.exercise
                  return (
                    <Flex
                      key={workoutExercise.exerciseId as string}
                      justify="between"
                      align="center"
                      padding="md"
                      style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <Text>{exercise?.name || 'Unknown Exercise'}</Text>
                      <Flex align="center" gap="md">
                        <Text>Sets:</Text>
                        <SetCounter
                          sets={workoutExercise.sets}
                          onIncrement={() =>
                            updateSets(
                              workoutExercise.exerciseId as any,
                              workoutExercise.sets + 1,
                            )
                          }
                          onDecrement={() =>
                            updateSets(
                              workoutExercise.exerciseId as any,
                              workoutExercise.sets - 1,
                            )
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            removeExercise(workoutExercise.exerciseId as any)
                          }
                        >
                          Remove
                        </Button>
                      </Flex>
                    </Flex>
                  )
                })}
              </Flex>
            )}

            <Flex gap="md">
              <Button type="submit" variant="primary" disabled={isLoading}>
                Save Workout
              </Button>
              <Button variant="outline" onClick={() => navigate('/workouts')}>
                Cancel
              </Button>
            </Flex>
          </Flex>
        </form>
      </Flex>
    </Box>
  )
}
