import { useState, useEffect, useMemo, useCallback } from 'react'
import { createWorkoutTrackerUseCases } from '@zen-design/domain'
import { LocalStorageExerciseAdapter } from '../adapters/LocalStorageExerciseAdapter'
import { LocalStorageWorkoutAdapter } from '../adapters/LocalStorageWorkoutAdapter'
import { LocalStorageWorkoutLogAdapter } from '../adapters/LocalStorageWorkoutLogAdapter'
import type { Workout, WorkoutId } from '@zen-design/domain'

/**
 * ViewModel for Workouts list page
 */
export function useWorkoutListViewModel() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
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

  const loadWorkouts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await useCases.getAllWorkouts()
      setWorkouts(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Error loading workouts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [useCases])

  const deleteWorkout = useCallback(
    async (id: WorkoutId) => {
      try {
        setError(null)
        await useCases.deleteWorkout(id)
        await loadWorkouts()
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        console.error('Error deleting workout:', error)
      }
    },
    [useCases, loadWorkouts],
  )

  useEffect(() => {
    loadWorkouts()
  }, [loadWorkouts])

  return {
    workouts,
    isLoading,
    error,
    deleteWorkout,
    reload: loadWorkouts,
  }
}
