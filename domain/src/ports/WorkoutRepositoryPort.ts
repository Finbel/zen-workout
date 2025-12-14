import type { Workout } from '../entities/Workout/Workout.js'
import type { WorkoutId } from '../valueobjects/WorkoutId/WorkoutId.js'

/**
 * WorkoutRepositoryPort - Port interface for workout persistence
 */
export interface WorkoutRepositoryPort {
  /**
   * Create a new workout
   */
  createWorkout(workout: Workout): Promise<Workout>

  /**
   * Get all workouts
   */
  getAllWorkouts(): Promise<Workout[]>

  /**
   * Get a workout by ID
   */
  getWorkoutById(id: WorkoutId): Promise<Workout | null>

  /**
   * Update an existing workout
   */
  updateWorkout(workout: Workout): Promise<Workout>

  /**
   * Delete a workout by ID
   */
  deleteWorkout(id: WorkoutId): Promise<void>
}
