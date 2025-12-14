import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createWorkoutTrackerUseCases } from '@zen-design/domain'
import { LocalStorageExerciseAdapter } from '../adapters/LocalStorageExerciseAdapter'
import { LocalStorageWorkoutAdapter } from '../adapters/LocalStorageWorkoutAdapter'
import { LocalStorageWorkoutLogAdapter } from '../adapters/LocalStorageWorkoutLogAdapter'
import type { Workout } from '@zen-design/domain'

/**
 * ViewModel for Start Workout page
 */
export function useStartWorkoutViewModel() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [workout, setWorkout] = useState<Workout | null>(null)
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

  const loadWorkout = useCallback(async () => {
    if (!id) {
      setError(new Error('Workout ID is required'))
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const result = await useCases.getWorkoutById(id)
      if (!result) {
        setError(new Error('Workout not found'))
      } else {
        setWorkout(result)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Error loading workout:', error)
    } finally {
      setIsLoading(false)
    }
  }, [useCases, id])

  useEffect(() => {
    loadWorkout()
  }, [loadWorkout])

  const startWorkout = useCallback(async () => {
    if (!id) {
      setError(new Error('Workout ID is required'))
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const workoutLog = await useCases.startWorkout({ workoutId: id })
      navigate(`/workouts/${id}/active?logId=${workoutLog.id}`)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Error starting workout:', error)
    } finally {
      setIsLoading(false)
    }
  }, [useCases, navigate, id])

  return {
    workout,
    isLoading,
    error,
    startWorkout,
  }
}
