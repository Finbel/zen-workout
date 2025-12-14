import type { WorkoutRepositoryPort } from '../../ports/WorkoutRepositoryPort.js'
import type { Workout } from '../../entities/Workout/Workout.js'
import { parseWorkoutId } from '../../valueobjects/WorkoutId/WorkoutId.js'

/**
 * GetWorkoutById - Use case for retrieving a workout by ID
 */
export const createGetWorkoutById =
  ({ repositoryPort }: { repositoryPort: WorkoutRepositoryPort }) =>
  async (id: string): Promise<Workout | null> => {
    const workoutId = parseWorkoutId(id)
    return await repositoryPort.getWorkoutById(workoutId)
  }
