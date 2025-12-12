# Domain Layer - Clean Architecture

This directory contains the domain layer following clean architecture principles. The domain layer is independent of frameworks, UI, databases, and external concerns.

## Architecture Overview

### Clean Architecture Principles

Clean architecture organizes code into layers with clear dependencies:

1. **Domain Layer** (this package) - Contains business logic, use cases, and port interfaces
2. **Application Layer** - Orchestrates use cases and adapts them to the framework
3. **Infrastructure Layer** - Implements ports (adapters) for external services

The key principle: **Dependencies point inward**. The domain layer has no dependencies on external frameworks or infrastructure.

### Ports and Adapters Pattern

The **Ports and Adapters** pattern (also known as Hexagonal Architecture) is used here:

- **Ports** = Interfaces that define contracts (in `src/ports/`)
- **Adapters** = Concrete implementations of ports (in infrastructure layer)
- **Use Cases** = Business logic that depends on ports, not adapters

This allows the domain to remain testable and independent of implementation details.

## Structure

```
domain/
├── src/
│   ├── ports/           # Port interfaces (contracts)
│   ├── usecases/        # Business logic use cases
│   └── factories/       # Factory functions for creating use cases
├── examples/            # Example adapter implementations
└── README.md
```

## Usage

### 1. Define Ports

Ports are interfaces that define what the domain needs from the outside world:

```typescript
// src/ports/StoragePort.ts
export interface StoragePort {
  get(key: string): Promise<number | null>
  set(key: string, value: number): Promise<void>
}
```

### 2. Create Use Cases

Use cases contain business logic and depend on ports. Use cases should be built with arrow functions following this format:

**For use cases without input:**

```typescript
// src/usecases/Counter/IncrementCounter.ts

/**
 * IncrementCounter - Use case for incrementing a counter
 */
export const createIncrementCounter =
  ({ storagePort }: { storagePort: StoragePort }) =>
  async (): Promise<number> => {
    const currentValue = await storagePort.get('counter')
    const newValue = (currentValue ?? 0) + 1
    await storagePort.set('counter', newValue)
    return newValue
  }
```

**For use cases with input:**

```typescript
// src/usecases/User/UpdateUser.ts

/**
 * Input type for UpdateUser use case
 */
export interface UpdateUserInput {
  userId: string
  name: string
  email: string
}

/**
 * UpdateUser - Use case for updating a user
 */
export const createUpdateUser =
  ({ userRepositoryPort }: { userRepositoryPort: UserRepositoryPort }) =>
  async (input: UpdateUserInput): Promise<User> => {
    // Domain logic using input.userId, input.name, input.email
    // ...
  }
```

**Pattern:**

- Use cases are created using arrow functions with the naming convention: `create{UseCaseName}`
- The outer function receives ports as an object: `{ portName: PortType }`
- If the use case has input, define an input interface `{UseCaseName}Input` and the inner function receives it: `(input: {UseCaseName}Input) => { ... }`
- If the use case has no input, the inner function takes no parameters: `() => { ... }`
- This pattern enables dependency injection and makes use cases testable

### 3. Create Factory Functions

Factories inject ports into use cases and return configured use case functions:

```typescript
// src/factories/createCounterUseCases.ts
import {
  createIncrementCounter,
  createGetCounter,
  type IncrementCounterInput,
  type GetCounterInput,
} from '../usecases/Counter/index.js'

export interface CounterUseCasePorts {
  storagePort: StoragePort
}

export interface CounterUseCases {
  incrementCounter: (input: IncrementCounterInput) => Promise<number>
  getCounter: (input: GetCounterInput) => Promise<number>
}

export function createCounterUseCases(
  ports: CounterUseCasePorts,
): CounterUseCases {
  return {
    incrementCounter: createIncrementCounter(ports),
    getCounter: createGetCounter(ports),
  }
}
```

### 4. Implement Adapters

Adapters implement ports in your infrastructure layer:

```typescript
// In your infrastructure layer (not in domain/)
class LocalStorageAdapter implements StoragePort {
  async get(key: string) {
    const value = localStorage.getItem(key)
    return value ? Number(value) : null
  }

  async set(key: string, value: number) {
    localStorage.setItem(key, String(value))
  }
}
```

### 5. Wire Everything Together

In your application layer:

```typescript
import { createCounterUseCases } from '@zen-design/domain'
import { LocalStorageAdapter } from './adapters/LocalStorageAdapter'

// Create adapter
const storage = new LocalStorageAdapter()

// Create use cases with injected ports
const counterUseCases = createCounterUseCases({ storagePort: storage })

// Use the use cases
await counterUseCases.incrementCounter() // Returns 1
await counterUseCases.incrementCounter() // Returns 2
const value = await counterUseCases.getCounter() // Returns 2
```

## Example: Counter Use Case

The `Counter` use case demonstrates the pattern:

- **Port**: `StoragePort` - Interface for storage operations
- **Use Cases**:
  - `incrementCounter` - Increments the counter
  - `getCounter` - Gets the current counter value
- **Factory**: `createCounterUseCases` - Creates use cases with injected ports
- **Example Adapter**: `InMemoryStorage` - Simple in-memory implementation

See `examples/InMemoryStorage.ts` for a reference implementation.

## Benefits

1. **Testability**: Use cases can be tested with mock ports
2. **Independence**: Domain logic doesn't depend on frameworks or databases
3. **Flexibility**: Easy to swap implementations (e.g., switch from localStorage to IndexedDB)
4. **Clarity**: Clear separation of concerns

## Testing

Use cases can be tested by providing mock ports:

```typescript
import { createCounterUseCases } from '@zen-design/domain'

test('incrementCounter increments the value', async () => {
  const mockStorage = {
    get: vi.fn().mockResolvedValue(5),
    set: vi.fn().mockResolvedValue(undefined),
  }

  const counterUseCases = createCounterUseCases({ storagePort: mockStorage })
  const result = await counterUseCases.incrementCounter()

  expect(result).toBe(6)
  expect(mockStorage.set).toHaveBeenCalledWith('counter', 6)
})
```

## Best Practices

1. **Ports should be minimal**: Only define what the use case actually needs
2. **Use cases should be pure**: Business logic only, no side effects except through ports
3. **Factories simplify usage**: They handle dependency injection for consumers
4. **Keep domain independent**: Never import from infrastructure or application layers



