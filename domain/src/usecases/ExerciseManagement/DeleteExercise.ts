import type { ExerciseRepositoryPort } from '../../ports/ExerciseRepositoryPort.js'
import { parseExerciseId } from '../../valueobjects/ExerciseId/ExerciseId.js'

/**
 * DeleteExercise - Use case for deleting an exercise
 */
export const createDeleteExercise =
  ({ repositoryPort }: { repositoryPort: ExerciseRepositoryPort }) =>
  async (id: string): Promise<void> => {
    const exerciseId = parseExerciseId(id)
    return await repositoryPort.deleteExercise(exerciseId)
  }
