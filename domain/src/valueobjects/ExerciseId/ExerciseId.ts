import { z } from 'zod'

/**
 * ExerciseId - Branded type representing an exercise identifier
 *
 * Branded types ensure type safety - an ExerciseId cannot be accidentally
 * used where a WorkoutId or other string type is expected.
 */
export const ExerciseIdSchema = z.string().min(1).brand<'ExerciseId'>()

export type ExerciseId = z.infer<typeof ExerciseIdSchema>

/**
 * Parse a string into a validated ExerciseId branded type
 *
 * @param id - The string to parse
 * @returns The validated ExerciseId branded type
 * @throws ZodError if the id is invalid
 */
export function parseExerciseId(id: string): ExerciseId {
  return ExerciseIdSchema.parse(id)
}

/**
 * Safely parse a string into an ExerciseId
 *
 * @param id - The string to parse
 * @returns A result object with success flag and data/error
 */
export function safeParseExerciseId(id: string) {
  return ExerciseIdSchema.safeParse(id)
}
