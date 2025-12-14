import type { ExerciseRepositoryPort } from '@zen-design/domain'
import type { Exercise, ExerciseId } from '@zen-design/domain'
import { safeParseExercise } from '@zen-design/domain'

const STORAGE_KEY = 'exercises'

export class LocalStorageExerciseAdapter implements ExerciseRepositoryPort {
  async createExercise(exercise: Exercise): Promise<Exercise> {
    const exercises = await this.getAllExercises()
    exercises.push(exercise)
    this.saveExercises(exercises)
    return exercise
  }

  async getAllExercises(): Promise<Exercise[]> {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }

    try {
      const data = JSON.parse(stored)
      if (!Array.isArray(data)) {
        return []
      }

      return data
        .map((item) => {
          const result = safeParseExercise(item)
          return result.success ? result.data : null
        })
        .filter((exercise): exercise is Exercise => exercise !== null)
    } catch {
      return []
    }
  }

  async getExerciseById(id: ExerciseId): Promise<Exercise | null> {
    const exercises = await this.getAllExercises()
    return exercises.find((ex) => ex.id === id) ?? null
  }

  async updateExercise(exercise: Exercise): Promise<Exercise> {
    const exercises = await this.getAllExercises()
    const index = exercises.findIndex((ex) => ex.id === exercise.id)
    if (index === -1) {
      throw new Error('Exercise not found')
    }
    exercises[index] = exercise
    this.saveExercises(exercises)
    return exercise
  }

  async deleteExercise(id: ExerciseId): Promise<void> {
    const exercises = await this.getAllExercises()
    const filtered = exercises.filter((ex) => ex.id !== id)
    this.saveExercises(filtered)
  }

  private saveExercises(exercises: Exercise[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises))
  }
}
