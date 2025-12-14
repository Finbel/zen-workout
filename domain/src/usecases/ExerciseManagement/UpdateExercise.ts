import type { ExerciseRepositoryPort } from '../../ports/ExerciseRepositoryPort.js'
import {
  parseExercise,
  type Exercise,
} from '../../entities/Exercise/Exercise.js'

/**
 * Input type for UpdateExercise use case
 */
export interface UpdateExerciseInput {
  id: string
  name: string
  usesWeight: boolean
  usesTime: boolean
  usesReps: boolean
}

/**
 * UpdateExercise - Use case for updating an existing exercise
 */
export const createUpdateExercise =
  ({ repositoryPort }: { repositoryPort: ExerciseRepositoryPort }) =>
  async (input: UpdateExerciseInput): Promise<Exercise> => {
    const exercise = parseExercise({
      id: input.id,
      name: input.name,
      usesWeight: input.usesWeight,
      usesTime: input.usesTime,
      usesReps: input.usesReps,
    })
    return await repositoryPort.updateExercise(exercise)
  }
