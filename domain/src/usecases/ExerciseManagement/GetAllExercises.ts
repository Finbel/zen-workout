import type { ExerciseRepositoryPort } from '../../ports/ExerciseRepositoryPort.js'
import type { Exercise } from '../../entities/Exercise/Exercise.js'

/**
 * GetAllExercises - Use case for retrieving all exercises
 */
export const createGetAllExercises =
  ({ repositoryPort }: { repositoryPort: ExerciseRepositoryPort }) =>
  async (): Promise<Exercise[]> => {
    return await repositoryPort.getAllExercises()
  }
