import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { createWorkoutTrackerUseCases } from '@zen-design/domain'
import { LocalStorageExerciseAdapter } from '../adapters/LocalStorageExerciseAdapter'
import { LocalStorageWorkoutAdapter } from '../adapters/LocalStorageWorkoutAdapter'
import { LocalStorageWorkoutLogAdapter } from '../adapters/LocalStorageWorkoutLogAdapter'
import type { WorkoutLog, WorkoutExercise, Workout } from '@zen-design/domain'

interface ActiveWorkoutState {
  workoutLog: WorkoutLog | null
  workout: Workout | null
  currentExerciseIndex: number
  currentSet: number
  exerciseStartTime: Date
  workoutStartTime: Date
  restTime: number // seconds
}

/**
 * ViewModel for Active Workout page
 */
export function useActiveWorkoutViewModel() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const logId = searchParams.get('logId')

  const [state, setState] = useState<ActiveWorkoutState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalTime, setTotalTime] = useState(0)
  const [exerciseTime, setExerciseTime] = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  const loadWorkoutData = useCallback(async () => {
    if (!id || !logId) {
      setError(new Error('Workout ID and Log ID are required'))
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const [workout, workoutLog] = await Promise.all([
        useCases.getWorkoutById(id),
        useCases.getWorkoutLogById(logId),
      ])

      if (!workout || !workoutLog) {
        setError(new Error('Workout or workout log not found'))
        return
      }

      // Find current exercise and set based on logged sets
      const loggedExercises = new Map<string, number>()
      workoutLog.exerciseSets.forEach((set) => {
        const key = set.exerciseId as string
        loggedExercises.set(key, (loggedExercises.get(key) || 0) + 1)
      })

      let currentExerciseIndex = 0
      let currentSet = 1

      // Find first incomplete exercise
      for (let i = 0; i < workout.exercises.length; i++) {
        const workoutExercise = workout.exercises[i]
        const exerciseId = workoutExercise.exerciseId as string
        const loggedSets = loggedExercises.get(exerciseId) || 0

        if (loggedSets < workoutExercise.sets) {
          currentExerciseIndex = i
          currentSet = loggedSets + 1
          break
        }
      }

      const now = new Date()
      const workoutStartTime =
        workoutLog.startedAt instanceof Date
          ? workoutLog.startedAt
          : new Date(workoutLog.startedAt)

      setState({
        workoutLog,
        workout,
        currentExerciseIndex,
        currentSet,
        exerciseStartTime: now,
        workoutStartTime,
        restTime: 0,
      })

      setTotalTime(
        Math.floor((now.getTime() - workoutStartTime.getTime()) / 1000),
      )
      setExerciseTime(0)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Error loading workout data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [useCases, id, logId])

  useEffect(() => {
    loadWorkoutData()
  }, [loadWorkoutData])

  // Timer interval
  useEffect(() => {
    if (!state) return

    intervalRef.current = setInterval(() => {
      const now = new Date()
      const totalElapsed = Math.floor(
        (now.getTime() - state.workoutStartTime.getTime()) / 1000,
      )
      const exerciseElapsed = Math.floor(
        (now.getTime() - state.exerciseStartTime.getTime()) / 1000,
      )

      setTotalTime(totalElapsed)
      setExerciseTime(exerciseElapsed)
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state])

  const getCurrentExercise = (): WorkoutExercise | null => {
    if (!state || !state.workout) return null
    return state.workout.exercises[state.currentExerciseIndex] || null
  }

  const completeSet = useCallback(() => {
    if (!state || !logId) return

    // Calculate exercise duration (time from starting exercise to now)
    const now = new Date()
    const exerciseDuration = Math.floor(
      (now.getTime() - state.exerciseStartTime.getTime()) / 1000,
    )

    navigate(
      `/workouts/${id}/log-set?logId=${logId}&exerciseIndex=${state.currentExerciseIndex}&set=${state.currentSet}&exerciseDuration=${exerciseDuration}`,
    )
  }, [state, logId, id, navigate])

  return {
    workoutLog: state?.workoutLog ?? null,
    workout: state?.workout ?? null,
    currentExercise: getCurrentExercise(),
    currentSet: state?.currentSet ?? 1,
    totalTime,
    exerciseTime,
    restTime: state?.restTime ?? 0,
    isLoading,
    error,
    completeSet,
  }
}
