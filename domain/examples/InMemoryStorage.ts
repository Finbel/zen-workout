import type { StoragePort } from '../src/ports/StoragePort.js'

/**
 * InMemoryStorage - Example implementation of StoragePort
 *
 * This is a simple in-memory implementation for demonstration purposes.
 * In a real application, you might have implementations like:
 * - LocalStorageAdapter (for browser)
 * - DatabaseAdapter (for server)
 * - RedisAdapter (for distributed systems)
 */
export class InMemoryStorage implements StoragePort {
  private storage = new Map<string, number>()

  async get(key: string): Promise<number | null> {
    const value = this.storage.get(key)
    return value ?? null
  }

  async set(key: string, value: number): Promise<void> {
    this.storage.set(key, value)
  }
}



