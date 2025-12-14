import type { WorkoutRepositoryPort } from '../../ports/WorkoutRepositoryPort.js'
import type { Workout } from '../../entities/Workout/Workout.js'

/**
 * GetAllWorkouts - Use case for retrieving all workouts
 */
export const createGetAllWorkouts =
  ({ repositoryPort }: { repositoryPort: WorkoutRepositoryPort }) =>
  async (): Promise<Workout[]> => {
    return await repositoryPort.getAllWorkouts()
  }
