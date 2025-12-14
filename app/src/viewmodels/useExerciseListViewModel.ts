import { useState, useEffect, useMemo, useCallback } from 'react'
import { createWorkoutTrackerUseCases } from '@zen-design/domain'
import { LocalStorageExerciseAdapter } from '../adapters/LocalStorageExerciseAdapter'
import { LocalStorageWorkoutAdapter } from '../adapters/LocalStorageWorkoutAdapter'
import { LocalStorageWorkoutLogAdapter } from '../adapters/LocalStorageWorkoutLogAdapter'
import type { Exercise, ExerciseId } from '@zen-design/domain'

/**
 * ViewModel for Exercises list page
 */
export function useExerciseListViewModel() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
      setIsLoading(true)
      setError(null)
      const result = await useCases.getAllExercises()
      setExercises(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Error loading exercises:', error)
    } finally {
      setIsLoading(false)
    }
  }, [useCases])

  const deleteExercise = useCallback(
    async (id: ExerciseId) => {
      try {
        setError(null)
        await useCases.deleteExercise(id)
        await loadExercises()
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        console.error('Error deleting exercise:', error)
      }
    },
    [useCases, loadExercises],
  )

  useEffect(() => {
    loadExercises()
  }, [loadExercises])

  return {
    exercises,
    isLoading,
    error,
    deleteExercise,
    reload: loadExercises,
  }
}
