import { z } from 'zod'
import { ExerciseIdSchema, parseExerciseId } from '../ExerciseId/ExerciseId.js'

/**
 * LoggedExerciseSet - Value object representing a completed exercise set
 */
export const LoggedExerciseSetSchema = z.object({
  exerciseId: ExerciseIdSchema,
  setNumber: z.number().int().min(1),
  weight: z.number().nullable(),
  time: z.number().nullable(), // seconds
  reps: z.number().nullable(),
  exerciseDuration: z.number().nonnegative(), // seconds - time spent doing the exercise
  restDuration: z.number().nonnegative(), // seconds - time between completing this set and starting the next
  completedAt: z.date(),
})

export type LoggedExerciseSet = z.infer<typeof LoggedExerciseSetSchema>

/**
 * Parse raw data into a LoggedExerciseSet value object
 */
export function parseLoggedExerciseSet(data: {
  exerciseId: string
  setNumber: number
  weight: number | null
  time: number | null
  reps: number | null
  exerciseDuration: number
  restDuration: number
  completedAt: Date | string
}): LoggedExerciseSet {
  return LoggedExerciseSetSchema.parse({
    exerciseId: parseExerciseId(data.exerciseId),
    setNumber: data.setNumber,
    weight: data.weight,
    time: data.time,
    reps: data.reps,
    exerciseDuration: data.exerciseDuration,
    restDuration: data.restDuration,
    completedAt:
      typeof data.completedAt === 'string'
        ? new Date(data.completedAt)
        : data.completedAt,
  })
}

/**
 * Safely parse raw data into a LoggedExerciseSet
 */
export function safeParseLoggedExerciseSet(data: {
  exerciseId: string
  setNumber: number
  weight: number | null
  time: number | null
  reps: number | null
  exerciseDuration: number
  restDuration: number
  completedAt: Date | string
}) {
  return LoggedExerciseSetSchema.safeParse({
    exerciseId: ExerciseIdSchema.safeParse(data.exerciseId).success
      ? ExerciseIdSchema.parse(data.exerciseId)
      : data.exerciseId,
    setNumber: data.setNumber,
    weight: data.weight,
    time: data.time,
    reps: data.reps,
    exerciseDuration: data.exerciseDuration,
    restDuration: data.restDuration,
    completedAt:
      typeof data.completedAt === 'string'
        ? new Date(data.completedAt)
        : data.completedAt,
  })
}
