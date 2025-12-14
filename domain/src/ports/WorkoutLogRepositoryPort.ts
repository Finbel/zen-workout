import type { WorkoutLog } from '../entities/WorkoutLog/WorkoutLog.js'
import type { WorkoutLogId } from '../valueobjects/WorkoutLogId/WorkoutLogId.js'

/**
 * WorkoutLogRepositoryPort - Port interface for workout log persistence
 */
export interface WorkoutLogRepositoryPort {
  /**
   * Create a new workout log
   */
  createWorkoutLog(log: WorkoutLog): Promise<WorkoutLog>

  /**
   * Get all workout logs
   */
  getAllWorkoutLogs(): Promise<WorkoutLog[]>

  /**
   * Get a workout log by ID
   */
  getWorkoutLogById(id: WorkoutLogId): Promise<WorkoutLog | null>

  /**
   * Update an existing workout log
   */
  updateWorkoutLog(log: WorkoutLog): Promise<WorkoutLog>
}
