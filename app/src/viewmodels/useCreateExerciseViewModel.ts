import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { createWorkoutTrackerUseCases } from '@zen-design/domain'
import { LocalStorageExerciseAdapter } from '../adapters/LocalStorageExerciseAdapter'
import { LocalStorageWorkoutAdapter } from '../adapters/LocalStorageWorkoutAdapter'
import { LocalStorageWorkoutLogAdapter } from '../adapters/LocalStorageWorkoutLogAdapter'
import type { CreateExerciseInput } from '@zen-design/domain'

/**
 * ViewModel for Create Exercise page
 */
export function useCreateExerciseViewModel() {
  const navigate = useNavigate()
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

  const createExercise = useCallback(
    async (input: CreateExerciseInput) => {
      try {
        setIsLoading(true)
        setError(null)
        await useCases.createExercise(input)
        navigate('/exercises')
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        console.error('Error creating exercise:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [useCases, navigate],
  )

  return {
    isLoading,
    error,
    createExercise,
  }
}
