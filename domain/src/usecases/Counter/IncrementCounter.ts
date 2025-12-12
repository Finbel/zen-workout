import type { StoragePort } from '../../ports/StoragePort.js'

const COUNTER_KEY = 'counter'

/**
 * IncrementCounter - Use case for incrementing a counter
 *
 * This use case contains the business logic for incrementing a counter.
 * It depends on the StoragePort interface, not a concrete implementation.
 */
export const createIncrementCounter =
  ({ storagePort }: { storagePort: StoragePort }) =>
  async (): Promise<number> => {
    // Get current value
    const currentValue = await storagePort.get(COUNTER_KEY)

    // Business logic: increment by 1, starting at 0 if no value exists
    const newValue = (currentValue ?? 0) + 1

    // Persist the new value
    await storagePort.set(COUNTER_KEY, newValue)

    return newValue
  }



