import { z } from 'zod'

/**
 * WorkoutId - Branded type representing a workout identifier
 */
export const WorkoutIdSchema = z.string().min(1).brand<'WorkoutId'>()

export type WorkoutId = z.infer<typeof WorkoutIdSchema>

/**
 * Parse a string into a validated WorkoutId branded type
 */
export function parseWorkoutId(id: string): WorkoutId {
  return WorkoutIdSchema.parse(id)
}

/**
 * Safely parse a string into a WorkoutId
 */
export function safeParseWorkoutId(id: string) {
  return WorkoutIdSchema.safeParse(id)
}
