import type { WorkoutLogRepositoryPort } from '../../ports/WorkoutLogRepositoryPort.js'
import type { WorkoutLog } from '../../entities/WorkoutLog/WorkoutLog.js'
import { parseWorkoutLogId } from '../../valueobjects/WorkoutLogId/WorkoutLogId.js'

/**
 * GetWorkoutLogById - Use case for retrieving a workout log by ID
 */
export const createGetWorkoutLogById =
  ({
    workoutLogRepositoryPort,
  }: {
    workoutLogRepositoryPort: WorkoutLogRepositoryPort
  }) =>
  async (id: string): Promise<WorkoutLog | null> => {
    const workoutLogId = parseWorkoutLogId(id)
    return await workoutLogRepositoryPort.getWorkoutLogById(workoutLogId)
  }
