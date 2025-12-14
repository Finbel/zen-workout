import type { WorkoutRepositoryPort } from '../../ports/WorkoutRepositoryPort.js'
import { parseWorkout, type Workout } from '../../entities/Workout/Workout.js'

/**
 * Input type for UpdateWorkout use case
 */
export interface UpdateWorkoutInput {
  id: string
  name: string
  exercises: Array<{ exerciseId: string; sets: number }>
}

/**
 * UpdateWorkout - Use case for updating an existing workout
 */
export const createUpdateWorkout =
  ({ repositoryPort }: { repositoryPort: WorkoutRepositoryPort }) =>
  async (input: UpdateWorkoutInput): Promise<Workout> => {
    const workout = parseWorkout({
      id: input.id,
      name: input.name,
      exercises: input.exercises,
    })
    return await repositoryPort.updateWorkout(workout)
  }
