import type { WorkoutLogRepositoryPort } from '../../ports/WorkoutLogRepositoryPort.js'
import type { WorkoutLog } from '../../entities/WorkoutLog/WorkoutLog.js'
import { addLoggedSet } from '../../entities/WorkoutLog/WorkoutLog.js'
import { parseWorkoutLogId } from '../../valueobjects/WorkoutLogId/WorkoutLogId.js'

/**
 * Input type for LogExerciseSet use case
 */
export interface LogExerciseSetInput {
  workoutLogId: string
  exerciseId: string
  setNumber: number
  weight: number | null
  time: number | null
  reps: number | null
  exerciseDuration: number
  restDuration: number
  completedAt: Date
}

/**
 * LogExerciseSet - Use case for logging a completed exercise set
 */
export const createLogExerciseSet =
  ({
    workoutLogRepositoryPort,
  }: {
    workoutLogRepositoryPort: WorkoutLogRepositoryPort
  }) =>
  async (input: LogExerciseSetInput): Promise<WorkoutLog> => {
    const workoutLogId = parseWorkoutLogId(input.workoutLogId)
    const log = await workoutLogRepositoryPort.getWorkoutLogById(workoutLogId)
    if (!log) {
      throw new Error('Workout log not found')
    }

    const updatedLog = addLoggedSet(log, {
      exerciseId: input.exerciseId,
      setNumber: input.setNumber,
      weight: input.weight,
      time: input.time,
      reps: input.reps,
      exerciseDuration: input.exerciseDuration,
      restDuration: input.restDuration,
      completedAt: input.completedAt,
    })

    return await workoutLogRepositoryPort.updateWorkoutLog(updatedLog)
  }
