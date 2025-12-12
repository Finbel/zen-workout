import type { StoragePort } from '../ports/StoragePort.js'
import {
  createIncrementCounter,
  createGetCounter,
} from '../usecases/Counter/index.js'

/**
 * Ports required by counter use cases
 */
export interface CounterUseCasePorts {
  storagePort: StoragePort
}

/**
 * Counter use cases returned by the factory
 */
export interface CounterUseCases {
  incrementCounter: () => Promise<number>
  getCounter: () => Promise<number>
}

/**
 * Factory function that creates counter use cases with injected ports
 *
 * This factory pattern allows for dependency injection of ports,
 * making the use cases testable and flexible.
 *
 * @param ports - The ports required by counter use cases
 * @returns An object containing the counter use case functions
 *
 * @example
 * ```typescript
 * const storage = new InMemoryStorage();
 * const counterUseCases = createCounterUseCases({ storagePort: storage });
 *
 * await counterUseCases.incrementCounter(); // Returns 1
 * await counterUseCases.incrementCounter(); // Returns 2
 * const value = await counterUseCases.getCounter(); // Returns 2
 * ```
 */
export function createCounterUseCases(
  ports: CounterUseCasePorts,
): CounterUseCases {
  return {
    incrementCounter: createIncrementCounter(ports),
    getCounter: createGetCounter(ports),
  }
}



