import type { WorkoutLogRepositoryPort } from '../../ports/WorkoutLogRepositoryPort.js'
import type { WorkoutLog } from '../../entities/WorkoutLog/WorkoutLog.js'

/**
 * GetWorkoutLogs - Use case for retrieving all workout logs
 */
export const createGetWorkoutLogs =
  ({
    workoutLogRepositoryPort,
  }: {
    workoutLogRepositoryPort: WorkoutLogRepositoryPort
  }) =>
  async (): Promise<WorkoutLog[]> => {
    return await workoutLogRepositoryPort.getAllWorkoutLogs()
  }
