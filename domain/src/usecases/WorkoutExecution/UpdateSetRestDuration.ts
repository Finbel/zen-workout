import type { WorkoutLogRepositoryPort } from '../../ports/WorkoutLogRepositoryPort.js'
import type { WorkoutLog } from '../../entities/WorkoutLog/WorkoutLog.js'
import { parseWorkoutLogId } from '../../valueobjects/WorkoutLogId/WorkoutLogId.js'
import { parseExerciseId } from '../../valueobjects/ExerciseId/ExerciseId.js'
import { parseLoggedExerciseSet } from '../../valueobjects/LoggedExerciseSet/LoggedExerciseSet.js'
import { WorkoutLogSchema } from '../../entities/WorkoutLog/WorkoutLog.js'

/**
 * Input type for UpdateSetRestDuration use case
 */
export interface UpdateSetRestDurationInput {
  workoutLogId: string
  exerciseId: string
  setNumber: number
  restDuration: number
}

/**
 * UpdateSetRestDuration - Use case for updating rest duration of a previously logged set
 */
export const createUpdateSetRestDuration =
  ({
    workoutLogRepositoryPort,
  }: {
    workoutLogRepositoryPort: WorkoutLogRepositoryPort
  }) =>
  async (input: UpdateSetRestDurationInput): Promise<WorkoutLog> => {
    const workoutLogId = parseWorkoutLogId(input.workoutLogId)
    const log = await workoutLogRepositoryPort.getWorkoutLogById(workoutLogId)
    if (!log) {
      throw new Error('Workout log not found')
    }

    const exerciseId = parseExerciseId(input.exerciseId)

    // Find and update the set
    const updatedSets = log.exerciseSets.map((set) => {
      if (set.exerciseId === exerciseId && set.setNumber === input.setNumber) {
        return parseLoggedExerciseSet({
          exerciseId: input.exerciseId,
          setNumber: set.setNumber,
          weight: set.weight,
          time: set.time,
          reps: set.reps,
          exerciseDuration: set.exerciseDuration,
          restDuration: input.restDuration,
          completedAt: set.completedAt,
        })
      }
      return set
    })

    const updatedLog = WorkoutLogSchema.parse({
      ...log,
      exerciseSets: updatedSets,
    })

    return await workoutLogRepositoryPort.updateWorkoutLog(updatedLog)
  }
