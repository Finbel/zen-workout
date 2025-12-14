import { z } from 'zod'

/**
 * WorkoutLogId - Branded type representing a workout log identifier
 */
export const WorkoutLogIdSchema = z.string().min(1).brand<'WorkoutLogId'>()

export type WorkoutLogId = z.infer<typeof WorkoutLogIdSchema>

/**
 * Parse a string into a validated WorkoutLogId branded type
 */
export function parseWorkoutLogId(id: string): WorkoutLogId {
  return WorkoutLogIdSchema.parse(id)
}

/**
 * Safely parse a string into a WorkoutLogId
 */
export function safeParseWorkoutLogId(id: string) {
  return WorkoutLogIdSchema.safeParse(id)
}
