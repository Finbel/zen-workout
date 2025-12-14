import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { createWorkoutTrackerUseCases } from '@zen-design/domain'
import { LocalStorageExerciseAdapter } from '../adapters/LocalStorageExerciseAdapter'
import { LocalStorageWorkoutAdapter } from '../adapters/LocalStorageWorkoutAdapter'
import { LocalStorageWorkoutLogAdapter } from '../adapters/LocalStorageWorkoutLogAdapter'
import type { Exercise, ExerciseId, WorkoutExercise } from '@zen-design/domain'
import { parseWorkoutExercise } from '@zen-design/domain'

/**
 * ViewModel for Create Workout page
 */
export function useCreateWorkoutViewModel() {
  const navigate = useNavigate()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>(
    [],
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

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

  const loadExercises = useCallback(async () => {
    try {
      const result = await useCases.getAllExercises()
      setExercises(result)
    } catch (err) {
      console.error('Error loading exercises:', err)
    }
  }, [useCases])

  useEffect(() => {
    loadExercises()
  }, [loadExercises])

  const searchExercises = useCallback(
    (query: string): Exercise[] => {
      if (!query.trim()) {
        return []
      }
      const lowerQuery = query.toLowerCase()
      return exercises.filter((ex) =>
        ex.name.toLowerCase().includes(lowerQuery),
      )
    },
    [exercises],
  )

  const addExercise = useCallback(
    (exerciseId: ExerciseId, sets: number = 1) => {
      const exercise = exercises.find((ex) => ex.id === exerciseId)
      if (!exercise) {
        return
      }
      const workoutExercise = parseWorkoutExercise({
        exerciseId: exerciseId as string,
        sets,
        exercise,
      })
      setSelectedExercises((prev) => [...prev, workoutExercise])
    },
    [exercises],
  )

  const removeExercise = useCallback((exerciseId: ExerciseId) => {
    setSelectedExercises((prev) =>
      prev.filter((ex) => ex.exerciseId !== exerciseId),
    )
  }, [])

  const updateSets = useCallback((exerciseId: ExerciseId, sets: number) => {
    if (sets < 1) {
      sets = 1
    }
    setSelectedExercises((prev) =>
      prev.map((ex) =>
        ex.exerciseId === exerciseId
          ? parseWorkoutExercise({
              exerciseId: exerciseId as string,
              sets,
              exercise: ex.exercise,
            })
          : ex,
      ),
    )
  }, [])

  const createWorkout = useCallback(
    async (name: string) => {
      if (!name.trim()) {
        setError(new Error('Workout name is required'))
        return
      }
      if (selectedExercises.length === 0) {
        setError(new Error('Workout must have at least one exercise'))
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        await useCases.createWorkout({
          name,
          exercises: selectedExercises.map((ex) => ({
            exerciseId: ex.exerciseId as string,
            sets: ex.sets,
          })),
        })
        navigate('/workouts')
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        console.error('Error creating workout:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [useCases, navigate, selectedExercises],
  )

  return {
    exercises,
    selectedExercises,
    isLoading,
    error,
    searchExercises,
    addExercise,
    removeExercise,
    updateSets,
    createWorkout,
  }
}
