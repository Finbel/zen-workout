import type { WorkoutRepositoryPort } from '@zen-design/domain'
import type { Workout, WorkoutId } from '@zen-design/domain'
import { safeParseWorkout } from '@zen-design/domain'

const STORAGE_KEY = 'workouts'

export class LocalStorageWorkoutAdapter implements WorkoutRepositoryPort {
  async createWorkout(workout: Workout): Promise<Workout> {
    const workouts = await this.getAllWorkouts()
    workouts.push(workout)
    this.saveWorkouts(workouts)
    return workout
  }

  async getAllWorkouts(): Promise<Workout[]> {
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
          const result = safeParseWorkout(item)
          return result.success ? result.data : null
        })
        .filter((workout): workout is Workout => workout !== null)
    } catch {
      return []
    }
  }

  async getWorkoutById(id: WorkoutId): Promise<Workout | null> {
    const workouts = await this.getAllWorkouts()
    return workouts.find((wo) => wo.id === id) ?? null
  }

  async updateWorkout(workout: Workout): Promise<Workout> {
    const workouts = await this.getAllWorkouts()
    const index = workouts.findIndex((wo) => wo.id === workout.id)
    if (index === -1) {
      throw new Error('Workout not found')
    }
    workouts[index] = workout
    this.saveWorkouts(workouts)
    return workout
  }

  async deleteWorkout(id: WorkoutId): Promise<void> {
    const workouts = await this.getAllWorkouts()
    const filtered = workouts.filter((wo) => wo.id !== id)
    this.saveWorkouts(filtered)
  }

  private saveWorkouts(workouts: Workout[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts))
  }
}
