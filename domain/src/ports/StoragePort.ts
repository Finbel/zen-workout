/**
 * StoragePort - A port interface for storage operations
 *
 * Ports define the contract that adapters must implement.
 * This allows the domain layer to remain independent of infrastructure concerns.
 */
export interface StoragePort {
  /**
   * Retrieves a value from storage by key
   * @param key - The storage key
   * @returns The stored value or null if not found
   */
  get(key: string): Promise<number | null>

  /**
   * Stores a value in storage by key
   * @param key - The storage key
   * @param value - The value to store
   */
  set(key: string, value: number): Promise<void>
}



