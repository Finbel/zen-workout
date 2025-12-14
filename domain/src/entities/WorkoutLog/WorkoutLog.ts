import { z } from 'zod'
import {
  WorkoutLogIdSchema,
  parseWorkoutLogId,
} from '../../valueobjects/WorkoutLogId/WorkoutLogId.js'
import {
  WorkoutIdSchema,
  parseWorkoutId,
} from '../../valueobjects/WorkoutId/WorkoutId.js'
import {
  LoggedExerciseSetSchema,
  parseLoggedExerciseSet,
  safeParseLoggedExerciseSet,
} from '../../valueobjects/LoggedExerciseSet/LoggedExerciseSet.js'

/**
 * WorkoutLog - Entity representing a completed or in-progress workout session
 */
export const WorkoutLogSchema = z.object({
  id: WorkoutLogIdSchema,
  workoutId: WorkoutIdSchema,
  startedAt: z.date(),
  completedAt: z.date().nullable(),
  exerciseSets: z.array(LoggedExerciseSetSchema),
})

export type WorkoutLog = z.infer<typeof WorkoutLogSchema>

/**
 * Parse raw data into a WorkoutLog entity
 */
export function parseWorkoutLog(data: {
  id: string
  workoutId: string
  startedAt: Date | string
  completedAt: Date | string | null
  exerciseSets: Array<{
    exerciseId: string
    setNumber: number
    weight: number | null
    time: number | null
    reps: number | null
    exerciseDuration: number
    restDuration: number
    completedAt: Date | string
  }>
}): WorkoutLog {
  return WorkoutLogSchema.parse({
    id: parseWorkoutLogId(data.id),
    workoutId: parseWorkoutId(data.workoutId),
    startedAt:
      typeof data.startedAt === 'string'
        ? new Date(data.startedAt)
        : data.startedAt,
    completedAt:
      data.completedAt === null
        ? null
        : typeof data.completedAt === 'string'
        ? new Date(data.completedAt)
        : data.completedAt,
    exerciseSets: data.exerciseSets.map((set) => parseLoggedExerciseSet(set)),
  })
}

/**
 * Safely parse raw data into a WorkoutLog entity
 */
export function safeParseWorkoutLog(data: {
  id: string
  workoutId: string
  startedAt: Date | string
  completedAt: Date | string | null
  exerciseSets: Array<{
    exerciseId: string
    setNumber: number
    weight: number | null
    time: number | null
    reps: number | null
    exerciseDuration: number
    restDuration: number
    completedAt: Date | string
  }>
}) {
  const workoutLogIdResult = WorkoutLogIdSchema.safeParse(data.id)
  if (!workoutLogIdResult.success) {
    return workoutLogIdResult
  }

  const workoutIdResult = WorkoutIdSchema.safeParse(data.workoutId)
  if (!workoutIdResult.success) {
    return workoutIdResult
  }

  const setsResults = data.exerciseSets.map((set) =>
    safeParseLoggedExerciseSet(set),
  )
  const failedSet = setsResults.find((r) => !r.success)
  if (failedSet && !failedSet.success) {
    return failedSet
  }

  return WorkoutLogSchema.safeParse({
    id: workoutLogIdResult.data,
    workoutId: workoutIdResult.data,
    startedAt:
      typeof data.startedAt === 'string'
        ? new Date(data.startedAt)
        : data.startedAt,
    completedAt:
      data.completedAt === null
        ? null
        : typeof data.completedAt === 'string'
        ? new Date(data.completedAt)
        : data.completedAt,
    exerciseSets: setsResults
      .map((r) => (r.success ? r.data : null))
      .filter(Boolean),
  })
}

/**
 * Create a new WorkoutLog with a generated ID
 */
export function createWorkoutLog(data: {
  workoutId: string
  startedAt?: Date
  id?: string
}): WorkoutLog {
  const id = data.id ?? crypto.randomUUID()
  return parseWorkoutLog({
    id,
    workoutId: data.workoutId,
    startedAt: data.startedAt ?? new Date(),
    completedAt: null,
    exerciseSets: [],
  })
}

/**
 * Add a logged set to a workout log
 */
export function addLoggedSet(
  log: WorkoutLog,
  set: {
    exerciseId: string
    setNumber: number
    weight: number | null
    time: number | null
    reps: number | null
    exerciseDuration: number
    restDuration: number
    completedAt: Date
  },
): WorkoutLog {
  return WorkoutLogSchema.parse({
    ...log,
    exerciseSets: [...log.exerciseSets, parseLoggedExerciseSet(set)],
  })
}

/**
 * Complete a workout log
 */
export function completeWorkoutLog(log: WorkoutLog): WorkoutLog {
  return WorkoutLogSchema.parse({
    ...log,
    completedAt: new Date(),
  })
}
