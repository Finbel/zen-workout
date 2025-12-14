import type { WorkoutRepositoryPort } from '../../ports/WorkoutRepositoryPort.js'
import { createWorkout, type Workout } from '../../entities/Workout/Workout.js'

/**
 * Input type for CreateWorkout use case
 */
export interface CreateWorkoutInput {
  name: string
  exercises: Array<{ exerciseId: string; sets: number }>
}

/**
 * CreateWorkout - Use case for creating a new workout
 */
export const createCreateWorkout =
  ({ repositoryPort }: { repositoryPort: WorkoutRepositoryPort }) =>
  async (input: CreateWorkoutInput): Promise<Workout> => {
    const workout = createWorkout({
      name: input.name,
      exercises: input.exercises,
    })
    return await repositoryPort.createWorkout(workout)
  }
