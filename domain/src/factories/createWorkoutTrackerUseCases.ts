import type { ExerciseRepositoryPort } from '../ports/ExerciseRepositoryPort.js'
import type { WorkoutRepositoryPort } from '../ports/WorkoutRepositoryPort.js'
import type { WorkoutLogRepositoryPort } from '../ports/WorkoutLogRepositoryPort.js'

import * as ExerciseManagement from '../usecases/ExerciseManagement/index.js'
import * as WorkoutManagement from '../usecases/WorkoutManagement/index.js'
import * as WorkoutExecution from '../usecases/WorkoutExecution/index.js'

/**
 * Ports required for all workout tracker use cases
 */
export interface WorkoutTrackerUseCasePorts {
  exerciseRepositoryPort: ExerciseRepositoryPort
  workoutRepositoryPort: WorkoutRepositoryPort
  workoutLogRepositoryPort: WorkoutLogRepositoryPort
}

/**
 * All workout tracker use cases
 */
export interface WorkoutTrackerUseCases {
  // Exercise Management
  createExercise: ReturnType<typeof ExerciseManagement.createCreateExercise>
  getAllExercises: ReturnType<typeof ExerciseManagement.createGetAllExercises>
  getExerciseById: ReturnType<typeof ExerciseManagement.createGetExerciseById>
  updateExercise: ReturnType<typeof ExerciseManagement.createUpdateExercise>
  deleteExercise: ReturnType<typeof ExerciseManagement.createDeleteExercise>

  // Workout Management
  createWorkout: ReturnType<typeof WorkoutManagement.createCreateWorkout>
  getAllWorkouts: ReturnType<typeof WorkoutManagement.createGetAllWorkouts>
  getWorkoutById: ReturnType<typeof WorkoutManagement.createGetWorkoutById>
  updateWorkout: ReturnType<typeof WorkoutManagement.createUpdateWorkout>
  deleteWorkout: ReturnType<typeof WorkoutManagement.createDeleteWorkout>

  // Workout Execution
  startWorkout: ReturnType<typeof WorkoutExecution.createStartWorkout>
  logExerciseSet: ReturnType<typeof WorkoutExecution.createLogExerciseSet>
  updateSetRestDuration: ReturnType<
    typeof WorkoutExecution.createUpdateSetRestDuration
  >
  completeWorkout: ReturnType<typeof WorkoutExecution.createCompleteWorkout>
  getWorkoutLogs: ReturnType<typeof WorkoutExecution.createGetWorkoutLogs>
  getWorkoutLogById: ReturnType<typeof WorkoutExecution.createGetWorkoutLogById>
}

/**
 * Factory function that creates all workout tracker use cases with injected ports
 */
export function createWorkoutTrackerUseCases(
  ports: WorkoutTrackerUseCasePorts,
): WorkoutTrackerUseCases {
  return {
    // Exercise Management
    createExercise: ExerciseManagement.createCreateExercise({
      repositoryPort: ports.exerciseRepositoryPort,
    }),
    getAllExercises: ExerciseManagement.createGetAllExercises({
      repositoryPort: ports.exerciseRepositoryPort,
    }),
    getExerciseById: ExerciseManagement.createGetExerciseById({
      repositoryPort: ports.exerciseRepositoryPort,
    }),
    updateExercise: ExerciseManagement.createUpdateExercise({
      repositoryPort: ports.exerciseRepositoryPort,
    }),
    deleteExercise: ExerciseManagement.createDeleteExercise({
      repositoryPort: ports.exerciseRepositoryPort,
    }),

    // Workout Management
    createWorkout: WorkoutManagement.createCreateWorkout({
      repositoryPort: ports.workoutRepositoryPort,
    }),
    getAllWorkouts: WorkoutManagement.createGetAllWorkouts({
      repositoryPort: ports.workoutRepositoryPort,
    }),
    getWorkoutById: WorkoutManagement.createGetWorkoutById({
      repositoryPort: ports.workoutRepositoryPort,
    }),
    updateWorkout: WorkoutManagement.createUpdateWorkout({
      repositoryPort: ports.workoutRepositoryPort,
    }),
    deleteWorkout: WorkoutManagement.createDeleteWorkout({
      repositoryPort: ports.workoutRepositoryPort,
    }),

    // Workout Execution
    startWorkout: WorkoutExecution.createStartWorkout({
      workoutLogRepositoryPort: ports.workoutLogRepositoryPort,
    }),
    logExerciseSet: WorkoutExecution.createLogExerciseSet({
      workoutLogRepositoryPort: ports.workoutLogRepositoryPort,
    }),
    updateSetRestDuration: WorkoutExecution.createUpdateSetRestDuration({
      workoutLogRepositoryPort: ports.workoutLogRepositoryPort,
    }),
    completeWorkout: WorkoutExecution.createCompleteWorkout({
      workoutLogRepositoryPort: ports.workoutLogRepositoryPort,
    }),
    getWorkoutLogs: WorkoutExecution.createGetWorkoutLogs({
      workoutLogRepositoryPort: ports.workoutLogRepositoryPort,
    }),
    getWorkoutLogById: WorkoutExecution.createGetWorkoutLogById({
      workoutLogRepositoryPort: ports.workoutLogRepositoryPort,
    }),
  }
}
