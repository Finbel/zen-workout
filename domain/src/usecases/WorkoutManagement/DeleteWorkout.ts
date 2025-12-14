import type { WorkoutRepositoryPort } from '../../ports/WorkoutRepositoryPort.js'
import { parseWorkoutId } from '../../valueobjects/WorkoutId/WorkoutId.js'

/**
 * DeleteWorkout - Use case for deleting a workout
 */
export const createDeleteWorkout =
  ({ repositoryPort }: { repositoryPort: WorkoutRepositoryPort }) =>
  async (id: string): Promise<void> => {
    const workoutId = parseWorkoutId(id)
    return await repositoryPort.deleteWorkout(workoutId)
  }
