import type { StoragePort } from '../../ports/StoragePort.js'

const COUNTER_KEY = 'counter'

/**
 * GetCounter - Use case for retrieving the current counter value
 *
 * This use case contains the business logic for retrieving a counter.
 * It depends on the StoragePort interface, not a concrete implementation.
 */
export const createGetCounter =
  ({ storagePort }: { storagePort: StoragePort }) =>
  async (): Promise<number> => {
    // Get current value
    const value = await storagePort.get(COUNTER_KEY)

    // Business logic: return 0 if no value exists
    return value ?? 0
  }



