import type { ExerciseRepositoryPort } from '../../ports/ExerciseRepositoryPort.js'
import type { Exercise } from '../../entities/Exercise/Exercise.js'
import { parseExerciseId } from '../../valueobjects/ExerciseId/ExerciseId.js'

/**
 * GetExerciseById - Use case for retrieving an exercise by ID
 */
export const createGetExerciseById =
  ({ repositoryPort }: { repositoryPort: ExerciseRepositoryPort }) =>
  async (id: string): Promise<Exercise | null> => {
    const exerciseId = parseExerciseId(id)
    return await repositoryPort.getExerciseById(exerciseId)
  }
