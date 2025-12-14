import type { WorkoutLogRepositoryPort } from '../../ports/WorkoutLogRepositoryPort.js'
import type { WorkoutLog } from '../../entities/WorkoutLog/WorkoutLog.js'
import { completeWorkoutLog } from '../../entities/WorkoutLog/WorkoutLog.js'
import { parseWorkoutLogId } from '../../valueobjects/WorkoutLogId/WorkoutLogId.js'

/**
 * Input type for CompleteWorkout use case
 */
export interface CompleteWorkoutInput {
  workoutLogId: string
}

/**
 * CompleteWorkout - Use case for completing a workout session
 */
export const createCompleteWorkout =
  ({
    workoutLogRepositoryPort,
  }: {
    workoutLogRepositoryPort: WorkoutLogRepositoryPort
  }) =>
  async (input: CompleteWorkoutInput): Promise<WorkoutLog> => {
    const workoutLogId = parseWorkoutLogId(input.workoutLogId)
    const log = await workoutLogRepositoryPort.getWorkoutLogById(workoutLogId)
    if (!log) {
      throw new Error('Workout log not found')
    }

    const completedLog = completeWorkoutLog(log)
    return await workoutLogRepositoryPort.updateWorkoutLog(completedLog)
  }
