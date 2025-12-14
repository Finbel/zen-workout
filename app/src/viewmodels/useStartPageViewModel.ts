import { useState, useEffect, useMemo, useCallback } from 'react'
import { createWorkoutTrackerUseCases } from '@zen-design/domain'
import { LocalStorageExerciseAdapter } from '../adapters/LocalStorageExerciseAdapter'
import { LocalStorageWorkoutAdapter } from '../adapters/LocalStorageWorkoutAdapter'
import { LocalStorageWorkoutLogAdapter } from '../adapters/LocalStorageWorkoutLogAdapter'
import type { WorkoutLog, Workout } from '@zen-design/domain'

export interface WorkoutLogWithWorkout extends WorkoutLog {
  workout?: Workout | null
}

/**
 * ViewModel for Start page
 */
export function useStartPageViewModel() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogWithWorkout[]>([])
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

  const loadWorkoutLogs = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const logs = await useCases.getWorkoutLogs()

      // Load workout names
      const logsWithWorkouts = await Promise.all(
        logs.map(async (log) => {
          const workout = await useCases.getWorkoutById(log.workoutId as string)
          return { ...log, workout }
        }),
      )

      // Sort by most recent first
      const sorted = logsWithWorkouts.sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
      )
      setWorkoutLogs(sorted)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Error loading workout logs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [useCases])

  useEffect(() => {
    loadWorkoutLogs()
  }, [loadWorkoutLogs])

  /**
   * Formats duration between two dates as mm:ss or hh:mm:ss if over 60 minutes
   */
  const formatDuration = useCallback(
    (startedAt: Date, completedAt: Date | null): string => {
      const end = completedAt || new Date()
      const durationMs = end.getTime() - new Date(startedAt).getTime()
      const totalSeconds = Math.floor(durationMs / 1000)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`
      }
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },
    [],
  )

  /**
   * Formats a date as a localized date string
   */
  const formatDate = useCallback((date: Date): string => {
    return new Date(date).toLocaleDateString()
  }, [])

  return {
    workoutLogs,
    isLoading,
    error,
    reload: loadWorkoutLogs,
    formatDuration,
    formatDate,
  }
}
