import { z } from 'zod'
import {
  ExerciseIdSchema,
  parseExerciseId,
} from '../../valueobjects/ExerciseId/ExerciseId.js'

/**
 * Exercise - Entity representing an exercise
 *
 * Entities have unique identity and can change state over time.
 * They encapsulate business logic and enforce invariants.
 */
export const ExerciseSchema = z.object({
  id: ExerciseIdSchema,
  name: z.string().min(1, 'Name cannot be empty'),
  usesWeight: z.boolean(),
  usesTime: z.boolean(),
  usesReps: z.boolean(),
  isTwoSided: z.boolean().default(false),
})

export type Exercise = z.infer<typeof ExerciseSchema>

/**
 * Parse raw data into an Exercise entity
 *
 * @param data - Raw data to parse into an Exercise
 * @returns The validated Exercise entity
 * @throws ZodError if validation fails
 */
export function parseExercise(data: {
  id: string
  name: string
  usesWeight: boolean
  usesTime: boolean
  usesReps: boolean
  isTwoSided?: boolean
}): Exercise {
  return ExerciseSchema.parse({
    id: parseExerciseId(data.id),
    name: data.name,
    usesWeight: data.usesWeight,
    usesTime: data.usesTime,
    usesReps: data.usesReps,
    isTwoSided: data.isTwoSided ?? false,
  })
}

/**
 * Safely parse raw data into an Exercise entity
 */
export function safeParseExercise(data: {
  id: string
  name: string
  usesWeight: boolean
  usesTime: boolean
  usesReps: boolean
  isTwoSided?: boolean
}) {
  return ExerciseSchema.safeParse({
    id: ExerciseIdSchema.safeParse(data.id).success
      ? ExerciseIdSchema.parse(data.id)
      : data.id,
    name: data.name,
    usesWeight: data.usesWeight,
    usesTime: data.usesTime,
    usesReps: data.usesReps,
    isTwoSided: data.isTwoSided ?? false,
  })
}

/**
 * Create a new Exercise with a generated ID
 */
export function createExercise(data: {
  name: string
  usesWeight: boolean
  usesTime: boolean
  usesReps: boolean
  isTwoSided?: boolean
  id?: string
}): Exercise {
  const id = data.id ?? crypto.randomUUID()
  return parseExercise({
    id,
    name: data.name,
    usesWeight: data.usesWeight,
    usesTime: data.usesTime,
    usesReps: data.usesReps,
    isTwoSided: data.isTwoSided ?? false,
  })
}
