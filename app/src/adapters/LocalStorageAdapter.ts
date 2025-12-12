import type { StoragePort } from '@zen-design/domain'

/**
 * LocalStorageAdapter - Browser implementation of StoragePort
 *
 * Uses the browser's localStorage API to persist counter values.
 * Wraps synchronous localStorage operations in async interface.
 */
export class LocalStorageAdapter implements StoragePort {
  /**
   * Retrieves a value from localStorage by key
   * @param key - The storage key
   * @returns The stored value or null if not found
   */
  async get(key: string): Promise<number | null> {
    try {
      const value = localStorage.getItem(key)
      if (value === null) {
        return null
      }
      const parsed = Number.parseInt(value, 10)
      if (Number.isNaN(parsed)) {
        return null
      }
      return parsed
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error)
      return null
    }
  }

  /**
   * Stores a value in localStorage by key
   * @param key - The storage key
   * @param value - The value to store
   */
  async set(key: string, value: number): Promise<void> {
    try {
      localStorage.setItem(key, value.toString())
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error)
      throw error
    }
  }
}



