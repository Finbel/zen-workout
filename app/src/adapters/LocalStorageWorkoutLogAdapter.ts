import type { WorkoutLogRepositoryPort } from '@zen-design/domain'
import type { WorkoutLog, WorkoutLogId } from '@zen-design/domain'
import { safeParseWorkoutLog } from '@zen-design/domain'

const STORAGE_KEY = 'workoutLogs'

export class LocalStorageWorkoutLogAdapter implements WorkoutLogRepositoryPort {
  async createWorkoutLog(log: WorkoutLog): Promise<WorkoutLog> {
    const logs = await this.getAllWorkoutLogs()
    logs.push(log)
    this.saveWorkoutLogs(logs)
    return log
  }

  async getAllWorkoutLogs(): Promise<WorkoutLog[]> {
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
          // Convert date strings to Date objects
          const parsedItem = {
            ...item,
            startedAt: new Date(item.startedAt),
            completedAt: item.completedAt ? new Date(item.completedAt) : null,
            exerciseSets: item.exerciseSets.map((set: any) => ({
              ...set,
              completedAt: new Date(set.completedAt),
            })),
          }
          const result = safeParseWorkoutLog(parsedItem)
          return result.success ? result.data : null
        })
        .filter((log): log is WorkoutLog => log !== null)
    } catch {
      return []
    }
  }

  async getWorkoutLogById(id: WorkoutLogId): Promise<WorkoutLog | null> {
    const logs = await this.getAllWorkoutLogs()
    return logs.find((log) => log.id === id) ?? null
  }

  async updateWorkoutLog(log: WorkoutLog): Promise<WorkoutLog> {
    const logs = await this.getAllWorkoutLogs()
    const index = logs.findIndex((l) => l.id === log.id)
    if (index === -1) {
      throw new Error('Workout log not found')
    }
    logs[index] = log
    this.saveWorkoutLogs(logs)
    return log
  }

  private saveWorkoutLogs(logs: WorkoutLog[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
  }
}
