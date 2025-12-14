import type { Exercise } from '../entities/Exercise/Exercise.js'
import type { ExerciseId } from '../valueobjects/ExerciseId/ExerciseId.js'

/**
 * ExerciseRepositoryPort - Port interface for exercise persistence
 *
 * Defines the contract for storing and retrieving exercises.
 * Implementations are provided by adapters in the infrastructure layer.
 */
export interface ExerciseRepositoryPort {
  /**
   * Create a new exercise
   */
  createExercise(exercise: Exercise): Promise<Exercise>

  /**
   * Get all exercises
   */
  getAllExercises(): Promise<Exercise[]>

  /**
   * Get an exercise by ID
   */
  getExerciseById(id: ExerciseId): Promise<Exercise | null>

  /**
   * Update an existing exercise
   */
  updateExercise(exercise: Exercise): Promise<Exercise>

  /**
   * Delete an exercise by ID
   */
  deleteExercise(id: ExerciseId): Promise<void>
}
