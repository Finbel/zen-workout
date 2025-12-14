import { z } from 'zod'
import { ExerciseIdSchema, parseExerciseId } from '../ExerciseId/ExerciseId.js'
import type { Exercise } from '../../entities/Exercise/Exercise.js'

/**
 * WorkoutExercise - Value object representing an exercise in a workout
 */
export const WorkoutExerciseSchema = z.object({
  exerciseId: ExerciseIdSchema,
  sets: z.number().int().min(1, 'Sets must be at least 1'),
})

export type WorkoutExercise = z.infer<typeof WorkoutExerciseSchema> & {
  exercise?: Exercise // Reference to exercise, not stored
}

/**
 * Parse raw data into a WorkoutExercise value object
 */
export function parseWorkoutExercise(data: {
  exerciseId: string
  sets: number
  exercise?: Exercise
}): WorkoutExercise {
  const workoutExercise = WorkoutExerciseSchema.parse({
    exerciseId: parseExerciseId(data.exerciseId),
    sets: data.sets,
  })
  if (data.exercise) {
    return { ...workoutExercise, exercise: data.exercise }
  }
  return workoutExercise
}

/**
 * Safely parse raw data into a WorkoutExercise
 */
export function safeParseWorkoutExercise(data: {
  exerciseId: string
  sets: number
  exercise?: Exercise
}) {
  const result = WorkoutExerciseSchema.safeParse({
    exerciseId: ExerciseIdSchema.safeParse(data.exerciseId).success
      ? ExerciseIdSchema.parse(data.exerciseId)
      : data.exerciseId,
    sets: data.sets,
  })
  if (result.success && data.exercise) {
    return {
      ...result,
      data: { ...result.data, exercise: data.exercise },
    }
  }
  return result
}
