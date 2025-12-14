import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { createWorkoutTrackerUseCases } from '@zen-design/domain'
import { LocalStorageExerciseAdapter } from '../adapters/LocalStorageExerciseAdapter'
import { LocalStorageWorkoutAdapter } from '../adapters/LocalStorageWorkoutAdapter'
import { LocalStorageWorkoutLogAdapter } from '../adapters/LocalStorageWorkoutLogAdapter'
import type { Workout, WorkoutLog, Exercise } from '@zen-design/domain'

/**
 * ViewModel for Log Set Page
 *
 * Encapsulates state management and use case orchestration for logging exercise sets,
 * providing a clean interface for the component to interact with.
 */
export function useLogSetViewModel() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const logId = searchParams.get('logId')
  const exerciseIndex = parseInt(searchParams.get('exerciseIndex') || '0')
  const setNumber = parseInt(searchParams.get('set') || '1')
  const exerciseDuration = parseInt(searchParams.get('exerciseDuration') || '0')

  // Form state
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [time, setTime] = useState('')

  // Data state
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [workoutLog, setWorkoutLog] = useState<WorkoutLog | null>(null)
  const [exercise, setExercise] = useState<Exercise | null>(null)

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Timer state
  const [totalTime, setTotalTime] = useState(0)
  const [restTime, setRestTime] = useState(0)
  const [restStartTime, setRestStartTime] = useState<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const restTimerStartedRef = useRef(false)

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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'useLogSetViewModel.ts:57',
        message: 'loadData called',
        data: { id, logId, exerciseIndex },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'F',
      }),
    }).catch(() => {})
    // #endregion
    if (!id || !logId) {
      // #region agent log
      fetch(
        'http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'useLogSetViewModel.ts:62',
            message: 'loadData early return - missing id or logId',
            data: { id, logId },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'F',
          }),
        },
      ).catch(() => {})
      // #endregion
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const wo = await useCases.getWorkoutById(id)
      const log = await useCases.getWorkoutLogById(logId)

      // #region agent log
      fetch(
        'http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'useLogSetViewModel.ts:75',
            message: 'Data loaded from repositories',
            data: {
              hasWorkout: !!wo,
              hasLog: !!log,
              logExerciseSetsLength: log?.exerciseSets.length || 0,
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'F',
          }),
        },
      ).catch(() => {})
      // #endregion

      if (wo && log) {
        setWorkout(wo)
        setWorkoutLog(log)

        const workoutExercise = wo.exercises[exerciseIndex]
        if (workoutExercise) {
          const ex = await useCases.getExerciseById(
            workoutExercise.exerciseId as string,
          )
          // #region agent log
          fetch(
            'http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: 'useLogSetViewModel.ts:87',
                message: 'Exercise loaded and set',
                data: { hasExercise: !!ex, exerciseId: ex?.id },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'F',
              }),
            },
          ).catch(() => {})
          // #endregion
          setExercise(ex)
        }

        // Calculate initial total time
        const now = new Date()
        const startedAt =
          log.startedAt instanceof Date
            ? log.startedAt
            : new Date(log.startedAt)
        const elapsed = Math.floor((now.getTime() - startedAt.getTime()) / 1000)
        setTotalTime(elapsed)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [useCases, id, logId, exerciseIndex])

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [loadData])

  // Calculate restStartTime when workoutLog and exercise are available
  // Reset the ref when setNumber changes (new set = new timer)
  useEffect(() => {
    restTimerStartedRef.current = false
  }, [setNumber])

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'useLogSetViewModel.ts:169',
        message: 'Rest timer calculation effect triggered',
        data: {
          hasWorkoutLog: !!workoutLog,
          exerciseSetsLength: workoutLog?.exerciseSets.length || 0,
          hasExercise: !!exercise,
          exerciseId: exercise?.id,
          setNumber,
          restTimerStarted: restTimerStartedRef.current,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'A',
      }),
    }).catch(() => {})
    // #endregion

    if (workoutLog && exercise && !restTimerStartedRef.current) {
      // Start rest timer when landing on LogSetPage (after completing a set)
      // The rest timer should start at 0 and count up
      const now = Date.now()
      setRestStartTime(now)
      setRestTime(0)
      restTimerStartedRef.current = true
      // #region agent log
      fetch(
        'http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'useLogSetViewModel.ts:195',
            message: 'Rest timer started at 0',
            data: { restStartTime: now, restTime: 0, setNumber },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'A',
          }),
        },
      ).catch(() => {})
      // #endregion
    } else if (!workoutLog || !exercise) {
      // Reset if no workoutLog or exercise
      setRestStartTime(0)
      setRestTime(0)
      restTimerStartedRef.current = false
      // #region agent log
      fetch(
        'http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'useLogSetViewModel.ts:220',
            message: 'Rest timer reset - no workoutLog or exercise',
            data: { hasWorkoutLog: !!workoutLog, hasExercise: !!exercise },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'A',
          }),
        },
      ).catch(() => {})
      // #endregion
    }
  }, [workoutLog, exercise, setNumber])

  // Timer interval for both total time and rest time
  useEffect(() => {
    if (!workoutLog) return

    intervalRef.current = setInterval(() => {
      const now = new Date()
      const startedAt =
        workoutLog.startedAt instanceof Date
          ? workoutLog.startedAt
          : new Date(workoutLog.startedAt)
      const elapsed = Math.floor((now.getTime() - startedAt.getTime()) / 1000)
      setTotalTime(elapsed)

      // Update rest time if rest timer is active
      if (restStartTime > 0) {
        const restElapsed = Math.floor((Date.now() - restStartTime) / 1000)
        setRestTime(restElapsed)
        // #region agent log
        fetch(
          'http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'useLogSetViewModel.ts:147',
              message: 'Rest time updated in interval',
              data: { restTime: restElapsed, restStartTime },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'B',
            }),
          },
        ).catch(() => {})
        // #endregion
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [workoutLog, restStartTime])

  // Save set operation
  const saveSet = useCallback(async () => {
    if (!logId || !exercise || !id) return

    try {
      setIsLoading(true)
      setError(null)

      // Save with restDuration=0 - it will be updated when starting next set
      // The rest duration is calculated from restStartTime to when the next set starts
      await useCases.logExerciseSet({
        workoutLogId: logId,
        exerciseId: exercise.id as string,
        setNumber,
        weight: exercise.usesWeight ? parseFloat(weight) || null : null,
        time: exercise.usesTime ? parseFloat(time) || null : null,
        reps: exercise.usesReps ? parseInt(reps) || null : null,
        exerciseDuration,
        restDuration: 0, // Will be updated when starting next set
        completedAt: new Date(),
      })

      // Check if more sets remaining
      const workoutExercise = workout?.exercises[exerciseIndex]
      if (workoutExercise && setNumber < workoutExercise.sets) {
        // More sets - go to rest
        // Use restStartTime state if available, otherwise use current time as fallback
        const restStartTimeToPass = restStartTime || Date.now()
        // #region agent log
        fetch(
          'http://127.0.0.1:7242/ingest/03f8e5cd-3c01-4ff1-8896-6a24c160cf96',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'useLogSetViewModel.ts:186',
              message: 'Navigating to RestPage with restStartTime',
              data: {
                restStartTimeToPass,
                restStartTime,
                setNumber,
                nextSet: setNumber + 1,
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'C',
            }),
          },
        ).catch(() => {})
        // #endregion
        navigate(
          `/workouts/${id}/rest?logId=${logId}&exerciseIndex=${exerciseIndex}&nextSet=${
            setNumber + 1
          }&restStartTime=${restStartTimeToPass}`,
        )
      } else {
        // Check if more exercises
        if (exerciseIndex < (workout?.exercises.length || 0) - 1) {
          // Next exercise
          navigate(`/workouts/${id}/active?logId=${logId}`)
        } else {
          // Complete workout
          await useCases.completeWorkout({ workoutLogId: logId })
          navigate(`/workouts/${id}/summary?logId=${logId}`)
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Error saving set:', error)
    } finally {
      setIsLoading(false)
    }
  }, [
    logId,
    exercise,
    id,
    workoutLog,
    setNumber,
    weight,
    reps,
    time,
    exerciseDuration,
    restStartTime,
    exerciseIndex,
    workout,
    useCases,
    navigate,
  ])

  return {
    // State
    workout,
    workoutLog,
    exercise,
    weight,
    reps,
    time,
    totalTime,
    restTime,
    exerciseDuration,
    isLoading,
    error,

    // Setters
    setWeight,
    setReps,
    setTime,

    // Operations
    saveSet,
    loadData,
  }
}
