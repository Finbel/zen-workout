import { Heading, Text, Button, Flex, Box, Table } from '@zen-design/ui'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { createWorkoutTrackerUseCases } from '@zen-design/domain'
import { LocalStorageExerciseAdapter } from '../adapters/LocalStorageExerciseAdapter'
import { LocalStorageWorkoutAdapter } from '../adapters/LocalStorageWorkoutAdapter'
import { LocalStorageWorkoutLogAdapter } from '../adapters/LocalStorageWorkoutLogAdapter'
import { useMemo, useEffect, useState } from 'react'

export function WorkoutSummaryPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const logId = searchParams.get('logId')

  const [workoutLog, setWorkoutLog] = useState<any>(null)
  const [workout, setWorkout] = useState<any>(null)
  const [exerciseMap, setExerciseMap] = useState<Map<string, any>>(new Map())
  const [isLoading, setIsLoading] = useState(true)

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
    const loadData = async () => {
      if (!id || !logId) return

      try {
        setIsLoading(true)
        const [wo, log] = await Promise.all([
          useCases.getWorkoutById(id),
          useCases.getWorkoutLogById(logId),
        ])

        if (wo && log) {
          setWorkout(wo)
          setWorkoutLog(log)

          // Load all exercises
          const exercises = new Map()
          for (const workoutExercise of wo.exercises) {
            const exercise = await useCases.getExerciseById(
              workoutExercise.exerciseId as string,
            )
            if (exercise) {
              exercises.set(exercise.id as string, exercise)
            }
          }
          setExerciseMap(exercises)
        }
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id, logId, useCases])

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateTotalWorkoutTime = (): number => {
    if (!workoutLog) return 0

    const endTime = workoutLog.completedAt
      ? workoutLog.completedAt instanceof Date
        ? workoutLog.completedAt
        : new Date(workoutLog.completedAt)
      : new Date()

    const startedAt =
      workoutLog.startedAt instanceof Date
        ? workoutLog.startedAt
        : new Date(workoutLog.startedAt)

    return Math.floor((endTime.getTime() - startedAt.getTime()) / 1000)
  }

  const isLastSetOfLastExercise = (
    exerciseId: string,
    setNumber: number,
  ): boolean => {
    if (!workout || !workoutLog) return false

    // Find the exercise index
    const exerciseIndex = workout.exercises.findIndex(
      (ex: any) => ex.exerciseId === exerciseId,
    )
    if (exerciseIndex === -1) return false

    const workoutExercise = workout.exercises[exerciseIndex]
    const isLastSet = setNumber === workoutExercise.sets
    const isLastExercise = exerciseIndex === workout.exercises.length - 1

    return isLastSet && isLastExercise
  }

  if (isLoading) {
    return (
      <Box padding="lg">
        <Text>Loading...</Text>
      </Box>
    )
  }

  if (!workoutLog || !workout) {
    return (
      <Box padding="lg">
        <Text>Workout not found</Text>
      </Box>
    )
  }

  // Group sets by exercise
  const setsByExercise = new Map<string, any[]>()
  workoutLog.exerciseSets.forEach((set: any) => {
    const exerciseId = set.exerciseId as string
    if (!setsByExercise.has(exerciseId)) {
      setsByExercise.set(exerciseId, [])
    }
    setsByExercise.get(exerciseId)!.push(set)
  })

  const totalWorkoutTime = calculateTotalWorkoutTime()

  return (
    <Box padding="lg">
      <Flex direction="column" gap="lg">
        <Heading size="2xl">Workout Summary</Heading>
        <Heading size="lg">{workout.name}</Heading>

        <Flex direction="column" gap="sm">
          <Text>
            <strong>Total Workout Time:</strong>{' '}
            {formatDuration(totalWorkoutTime)}
          </Text>
        </Flex>

        {Array.from(setsByExercise.entries()).map(([exerciseId, sets]) => {
          const exercise = exerciseMap.get(exerciseId)
          return (
            <Flex key={exerciseId} direction="column" gap="md">
              <Heading size="lg">
                {exercise?.name || 'Unknown Exercise'}
              </Heading>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>Set</Table.Header>
                    {exercise?.usesWeight && (
                      <Table.Header>Weight</Table.Header>
                    )}
                    {exercise?.usesReps && <Table.Header>Reps</Table.Header>}
                    {exercise?.usesTime && <Table.Header>Time</Table.Header>}
                    <Table.Header>Exercise Time</Table.Header>
                    <Table.Header>Rest</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {sets.map((set, index) => {
                    const isLastSet = isLastSetOfLastExercise(
                      exerciseId,
                      set.setNumber,
                    )
                    return (
                      <Table.Row key={index}>
                        <Table.Cell>{set.setNumber}</Table.Cell>
                        {exercise?.usesWeight && (
                          <Table.Cell>{set.weight || '-'}</Table.Cell>
                        )}
                        {exercise?.usesReps && (
                          <Table.Cell>
                            {exercise?.isTwoSided && set.reps
                              ? `2x${set.reps}`
                              : set.reps || '-'}
                          </Table.Cell>
                        )}
                        {exercise?.usesTime && (
                          <Table.Cell>
                            {set.time ? formatDuration(set.time) : '-'}
                          </Table.Cell>
                        )}
                        <Table.Cell>
                          {formatDuration(set.exerciseDuration || 0)}
                        </Table.Cell>
                        <Table.Cell>
                          {isLastSet
                            ? '-'
                            : formatDuration(set.restDuration || 0)}
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table>
            </Flex>
          )
        })}

        <Button variant="primary" onClick={() => navigate('/')}>
          Return to Start
        </Button>
      </Flex>
    </Box>
  )
}
