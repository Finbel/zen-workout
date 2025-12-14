import type { ExerciseRepositoryPort } from '../../ports/ExerciseRepositoryPort.js'
import {
  createExercise,
  type Exercise,
} from '../../entities/Exercise/Exercise.js'

/**
 * Input type for CreateExercise use case
 */
export interface CreateExerciseInput {
  name: string
  usesWeight: boolean
  usesTime: boolean
  usesReps: boolean
}

/**
 * CreateExercise - Use case for creating a new exercise
 */
export const createCreateExercise =
  ({ repositoryPort }: { repositoryPort: ExerciseRepositoryPort }) =>
  async (input: CreateExerciseInput): Promise<Exercise> => {
    const exercise = createExercise({
      name: input.name,
      usesWeight: input.usesWeight,
      usesTime: input.usesTime,
      usesReps: input.usesReps,
    })
    return await repositoryPort.createExercise(exercise)
  }
