import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { createWorkoutTrackerUseCases } from '@zen-design/domain'
import { LocalStorageExerciseAdapter } from '../adapters/LocalStorageExerciseAdapter'
import { LocalStorageWorkoutAdapter } from '../adapters/LocalStorageWorkoutAdapter'
import { LocalStorageWorkoutLogAdapter } from '../adapters/LocalStorageWorkoutLogAdapter'
import type { WorkoutLog } from '@zen-design/domain'

/**
 * ViewModel for Rest Page
 *
 * Encapsulates state management and use case orchestration for rest periods between sets,
 * providing a clean interface for the component to interact with.
 */
export function useRestViewModel() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const logId = searchParams.get('logId')
  const exerciseIndex = parseInt(searchParams.get('exerciseIndex') || '0')
  const nextSet = parseInt(searchParams.get('nextSet') || '1')
  const restStartTime = parseInt(searchParams.get('restStartTime') || '0')
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'useRestViewModel.ts:22',
      message: 'RestPage loaded with restStartTime from URL',
      data: { restStartTime, urlParam: searchParams.get('restStartTime') },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'C',
    }),
  }).catch(() => {})
  // #endregion

  // Data state
  const [nextExerciseName, setNextExerciseName] = useState('')
  const [workoutLog, setWorkoutLog] = useState<WorkoutLog | null>(null)

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Timer state
  const [totalTime, setTotalTime] = useState(0)
  const [restTime, setRestTime] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Initialize use cases
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

  // Load data
  const loadData = useCallback(async () => {
    if (!id || !logId) return

    try {
      setIsLoading(true)
      setError(null)

      const [workout, log] = await Promise.all([
        useCases.getWorkoutById(id),
        useCases.getWorkoutLogById(logId),
      ])

      if (workout && workout.exercises[exerciseIndex]) {
        const exerciseId = workout.exercises[exerciseIndex].exerciseId as string
        const exercise = await useCases.getExerciseById(exerciseId)
        if (exercise) {
          setNextExerciseName(exercise.name)
        }
      }

      if (log) {
        setWorkoutLog(log)
        // Calculate initial times
        const now = new Date()
        const startedAt =
          log.startedAt instanceof Date
            ? log.startedAt
            : new Date(log.startedAt)
        const totalElapsed = Math.floor(
          (now.getTime() - startedAt.getTime()) / 1000,
        )
        setTotalTime(totalElapsed)

        if (restStartTime > 0) {
          const restElapsed = Math.floor((now.getTime() - restStartTime) / 1000)
          // #region agent log
          fetch(
            'http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: 'useRestViewModel.ts:98',
                message: 'Setting initial restTime in loadData',
                data: {
                  restElapsed,
                  restStartTime,
                  now: now.getTime(),
                  beforeSetRestTime: restTime,
                },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'G',
              }),
            },
          ).catch(() => {})
          // #endregion
          setRestTime(restElapsed)
          // #region agent log
          fetch(
            'http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: 'useRestViewModel.ts:85',
                message: 'RestPage initial rest time calculated',
                data: {
                  restTime: restElapsed,
                  restStartTime,
                  now: now.getTime(),
                },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'C',
              }),
            },
          ).catch(() => {})
          // #endregion
        } else {
          // #region agent log
          fetch(
            'http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: 'useRestViewModel.ts:90',
                message: 'RestPage restStartTime is 0 - timer not started',
                data: { restStartTime },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'C',
              }),
            },
          ).catch(() => {})
          // #endregion
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [useCases, id, logId, exerciseIndex, restStartTime])

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [loadData])

  // Timer interval
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'useRestViewModel.ts:103',
        message: 'Timer interval effect triggered',
        data: { hasWorkoutLog: !!workoutLog, restStartTime, restTime },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'E',
      }),
    }).catch(() => {})
    // #endregion
    if (!workoutLog || restStartTime <= 0) {
      // #region agent log
      fetch(
        'http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'useRestViewModel.ts:110',
            message: 'Timer interval NOT starting - conditions not met',
            data: { hasWorkoutLog: !!workoutLog, restStartTime },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'E',
          }),
        },
      ).catch(() => {})
      // #endregion
      return
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'useRestViewModel.ts:125',
        message: 'Timer interval starting',
        data: { restStartTime, currentRestTime: restTime },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'E',
      }),
    }).catch(() => {})
    // #endregion

    intervalRef.current = setInterval(() => {
      const now = new Date()
      const startedAt =
        workoutLog.startedAt instanceof Date
          ? workoutLog.startedAt
          : new Date(workoutLog.startedAt)
      const totalElapsed = Math.floor(
        (now.getTime() - startedAt.getTime()) / 1000,
      )
      setTotalTime(totalElapsed)

      const restElapsed = Math.floor((now.getTime() - restStartTime) / 1000)
      setRestTime(restElapsed)
      // #region agent log
      fetch(
        'http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'useRestViewModel.ts:145',
            message: 'Timer interval tick - rest time updated',
            data: { restTime: restElapsed, restStartTime },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'E',
          }),
        },
      ).catch(() => {})
      // #endregion
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [workoutLog, restStartTime])

  // Start next set operation
  const startNextSet = useCallback(async () => {
    if (!id || !logId) return

    try {
      setIsLoading(true)
      setError(null)

      // Calculate rest duration and update previous set
      if (
        restStartTime > 0 &&
        workoutLog &&
        workoutLog.exerciseSets.length > 0
      ) {
        const now = Date.now()
        const restDuration = Math.floor((now - restStartTime) / 1000)
        const previousSet =
          workoutLog.exerciseSets[workoutLog.exerciseSets.length - 1]

        // Update the previous set's rest duration
        await useCases.updateSetRestDuration({
          workoutLogId: logId,
          exerciseId: previousSet.exerciseId as string,
          setNumber: previousSet.setNumber,
          restDuration,
        })
      }

      navigate(`/workouts/${id}/active?logId=${logId}`)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Error starting next set:', error)
    } finally {
      setIsLoading(false)
    }
  }, [restStartTime, workoutLog, logId, id, useCases, navigate])

  return {
    // State
    nextExerciseName,
    workoutLog,
    totalTime,
    restTime,
    nextSet,
    isLoading,
    error,

    // Operations
    startNextSet,
    loadData,
  }
}
