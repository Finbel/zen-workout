import { z } from 'zod'
import {
  WorkoutIdSchema,
  parseWorkoutId,
} from '../../valueobjects/WorkoutId/WorkoutId.js'
import { ExerciseIdSchema } from '../../valueobjects/ExerciseId/ExerciseId.js'
import {
  WorkoutExerciseSchema,
  parseWorkoutExercise,
} from '../../valueobjects/WorkoutExercise/WorkoutExercise.js'

/**
 * Workout - Entity representing a workout template
 */
export const WorkoutSchema = z.object({
  id: WorkoutIdSchema,
  name: z.string().min(1, 'Name cannot be empty'),
  exercises: z
    .array(WorkoutExerciseSchema)
    .min(1, 'Workout must have at least one exercise'),
})

export type Workout = z.infer<typeof WorkoutSchema>

/**
 * Parse raw data into a Workout entity
 */
export function parseWorkout(data: {
  id: string
  name: string
  exercises: Array<{ exerciseId: string; sets: number }>
}): Workout {
  return WorkoutSchema.parse({
    id: parseWorkoutId(data.id),
    name: data.name,
    exercises: data.exercises.map((ex) =>
      parseWorkoutExercise({ exerciseId: ex.exerciseId, sets: ex.sets }),
    ),
  })
}

/**
 * Safely parse raw data into a Workout entity
 */
export function safeParseWorkout(data: {
  id: string
  name: string
  exercises: Array<{ exerciseId: string; sets: number }>
}) {
  const workoutIdResult = WorkoutIdSchema.safeParse(data.id)
  if (!workoutIdResult.success) {
    return workoutIdResult
  }

  const exercisesResults = data.exercises.map((ex) =>
    WorkoutExerciseSchema.safeParse({
      exerciseId: ExerciseIdSchema.safeParse(ex.exerciseId).success
        ? ExerciseIdSchema.parse(ex.exerciseId)
        : ex.exerciseId,
      sets: ex.sets,
    }),
  )

  const failedExercise = exercisesResults.find((r) => !r.success)
  if (failedExercise && !failedExercise.success) {
    return failedExercise
  }

  return WorkoutSchema.safeParse({
    id: workoutIdResult.data,
    name: data.name,
    exercises: exercisesResults
      .map((r) => (r.success ? r.data : null))
      .filter(Boolean),
  })
}

/**
 * Create a new Workout with a generated ID
 */
export function createWorkout(data: {
  name: string
  exercises: Array<{ exerciseId: string; sets: number }>
  id?: string
}): Workout {
  const id = data.id ?? crypto.randomUUID()
  return parseWorkout({
    id,
    name: data.name,
    exercises: data.exercises,
  })
}
