import type { WorkoutLogRepositoryPort } from '../../ports/WorkoutLogRepositoryPort.js'
import {
  createWorkoutLog,
  type WorkoutLog,
} from '../../entities/WorkoutLog/WorkoutLog.js'

/**
 * Input type for StartWorkout use case
 */
export interface StartWorkoutInput {
  workoutId: string
}

/**
 * StartWorkout - Use case for starting a workout session
 */
export const createStartWorkout =
  ({
    workoutLogRepositoryPort,
  }: {
    workoutLogRepositoryPort: WorkoutLogRepositoryPort
  }) =>
  async (input: StartWorkoutInput): Promise<WorkoutLog> => {
    const workoutLog = createWorkoutLog({
      workoutId: input.workoutId,
    })
    return await workoutLogRepositoryPort.createWorkoutLog(workoutLog)
  }
