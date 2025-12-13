# Creating a Domain-Driven Design Feature

This guide explains how to create a feature in the domain layer following Domain-Driven Design (DDD) principles. The domain layer is the core of your application and should be independent of frameworks, databases, and external concerns.

## Overview

A DDD feature in the domain layer consists of:

1. **Entities** - Domain objects with unique identity, defined using Zod schemas following the "Parse don't validate" pattern
2. **Value Objects and Branded Types** - Immutable domain concepts using Zod schemas with branded types for type safety
3. **Ports** - Interfaces that define contracts for external dependencies
4. **Use Cases** - Business logic operations that orchestrate entities and value objects
5. **Factories** - Functions that create use cases with injected dependencies

**Key Approach:**

- Use **Zod schemas** for parsing and validation (Parse don't validate)
- Use **branded types** for primitives to prevent type mixing (UserId, Email, etc.)
- Entities and value objects are **immutable** - updates return new objects
- All validation happens through **Zod parsing**, ensuring type safety at compile-time and runtime

## Directory Structure

The domain layer is organized into shared domain concepts and feature-specific use cases:

```
domain/src/
├── entities/
│   └── {{EntityName}}/
│       ├── {{EntityName}}.ts       # Entity class
│       └── index.ts
├── valueobjects/
│   └── {{ValueObjectName}}/
│       ├── {{ValueObjectName}}.ts  # Value object
│       └── index.ts
├── ports/
│   └── {{PortName}}Port.ts
├── usecases/
│   └── {{FeatureName}}/
│       ├── {{UseCaseName}}.ts
│       └── index.ts
└── factories/
    └── create{{FeatureName}}UseCases.ts
```

**Important:** Entities and value objects are organized by their **domain concept name**, not by feature. This allows multiple features to share the same entities and value objects without duplication.

**Example:** If you have both an `Authentication` feature and a `UserManagement` feature that both use a `User` entity, you would have:

```
domain/src/
├── entities/
│   └── User/              # Shared across features
│       ├── User.ts
│       └── index.ts
├── valueobjects/
│   └── Email/             # Shared across features
│       ├── Email.ts
│       └── index.ts
├── usecases/
│   ├── Authentication/    # Feature-specific
│   │   ├── LoginUser.ts
│   │   └── index.ts
│   └── UserManagement/    # Feature-specific
│       ├── UpdateUser.ts
│       └── index.ts
```

**Note:** Not all features will require all of these components. Some features may only need use cases and ports, while others may require entities and value objects. Structure your feature based on its specific domain requirements.

## Sharing Entities and Value Objects Across Features

When multiple features need to use the same entity or value object, they simply import from the shared location. There is no code duplication - the entity/value object is defined once and reused.

**Example:** Both `Authentication` and `UserManagement` features use the `User` entity:

```typescript
// src/usecases/Authentication/LoginUser.ts
import type { UserRepositoryPort } from '../../ports/UserRepositoryPort.js'
import type { User } from '../../entities/User/User.js' // Shared entity type
import { parseEmail } from '../../valueobjects/Email/Email.js' // Shared value object parser

export const createLoginUser =
  ({ repositoryPort }: { repositoryPort: UserRepositoryPort }) =>
  async (input: LoginUserInput): Promise<User> => {
    // Parse email (validates format)
    const email = parseEmail(input.email)

    // Use the shared User entity
    const user = await repositoryPort.findByEmail(email)
    // ... authentication logic
    return user
  }
```

```typescript
// src/usecases/UserManagement/UpdateUser.ts
import type { UserRepositoryPort } from '../../ports/UserRepositoryPort.js'
import { updateUserName, type User } from '../../entities/User/User.js' // Same shared entity
import { parseUserId } from '../../valueobjects/UserId/UserId.js' // Shared branded type parser

export const createUpdateUser =
  ({ repositoryPort }: { repositoryPort: UserRepositoryPort }) =>
  async (input: UpdateUserInput): Promise<User> => {
    // Parse ID into branded type
    const userId = parseUserId(input.id)

    // Use the same shared User entity
    const user = await repositoryPort.findById(userId)
    // ... update logic using entity functions
    return user
  }
```

**Key Points:**

- Entities and value objects are defined once in `entities/` and `valueobjects/` directories
- Multiple features import from the same shared location
- No duplication - changes to the entity affect all features using it
- Ports can also be shared if multiple features need the same repository interface

## Step 1: Define Value Objects and Branded Types

Value objects are immutable objects that represent domain concepts. They have no identity - two value objects with the same values are considered equal. We use Zod schemas to parse and validate data, following the "Parse don't validate" pattern.

**Characteristics:**

- Immutable (cannot be changed after creation)
- No unique identifier
- Equality based on values, not identity
- Self-validating using Zod schemas
- Use branded types for primitives to prevent mixing different domain concepts

**Example - Branded Type for Email:**

```typescript
// src/valueobjects/Email/Email.ts

import { z } from 'zod'

/**
 * Email - Branded type representing an email address
 *
 * Branded types prevent mixing different string types (e.g., email vs userId).
 * The Zod schema validates and parses the email, ensuring it's valid.
 */
export const EmailSchema = z
  .string()
  .email('Invalid email format')
  .brand<'Email'>()

export type Email = z.infer<typeof EmailSchema>

/**
 * Parse an email string into a validated Email branded type
 *
 * Following the "Parse don't validate" pattern - we parse and get back
 * a typed result, rather than validating and then using the data.
 *
 * @param email - The email string to parse
 * @returns The validated Email branded type
 * @throws ZodError if the email is invalid
 */
export function parseEmail(email: string): Email {
  return EmailSchema.parse(email)
}

/**
 * Safely parse an email string
 *
 * @param email - The email string to parse
 * @returns A result object with success flag and data/error
 */
export function safeParseEmail(email: string) {
  return EmailSchema.safeParse(email)
}
```

```typescript
// src/valueobjects/Email/index.ts
export { EmailSchema, parseEmail, safeParseEmail, type Email } from './Email.js'
```

**Example - Branded Type for UserId:**

```typescript
// src/valueobjects/UserId/UserId.ts

import { z } from 'zod'

/**
 * UserId - Branded type representing a user identifier
 *
 * Branded types ensure type safety - a UserId cannot be accidentally
 * used where an Email or other string type is expected.
 */
export const UserIdSchema = z.string().uuid().brand<'UserId'>()

export type UserId = z.infer<typeof UserIdSchema>

export function parseUserId(id: string): UserId {
  return UserIdSchema.parse(id)
}

export function safeParseUserId(id: string) {
  return UserIdSchema.safeParse(id)
}
```

**When to use Value Objects and Branded Types:**

- Represent domain concepts (Email, Money, Address, DateRange)
- Need validation or business rules
- Should be immutable
- Don't need unique identity
- Want type safety to prevent mixing different primitive types (e.g., UserId vs Email)

**Benefits of Branded Types:**

- **Type Safety**: Prevents accidentally using a UserId where an Email is expected
- **Self-Documenting**: The type system makes it clear what kind of data is expected
- **Parse Don't Validate**: Zod schemas parse and return typed data, ensuring validity

## Step 2: Define Entities

Entities are domain objects with unique identity. Two entities with the same attributes but different IDs are considered different. We use Zod schemas to parse and validate entities, following the "Parse don't validate" pattern.

**Characteristics:**

- Have a unique identifier (using branded types)
- Mutable (can change state over time)
- Equality based on identity, not values
- Encapsulate business logic and invariants
- Defined using Zod schemas for parsing and validation

**Example:**

```typescript
// src/entities/User/User.ts

import { z } from 'zod'
import { EmailSchema, type Email } from '../../valueobjects/Email/Email.js'
import { UserIdSchema, type UserId } from '../../valueobjects/UserId/UserId.js'

/**
 * User - Entity representing a user with identity
 *
 * Entities have unique identity and can change state over time.
 * They encapsulate business logic and enforce invariants.
 *
 * Following the "Parse don't validate" pattern - we parse data into
 * typed entities rather than validating and then constructing.
 */
export const UserSchema = z.object({
  id: UserIdSchema,
  name: z.string().min(1, 'Name cannot be empty'),
  email: EmailSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof UserSchema>

/**
 * Parse raw data into a User entity
 *
 * This function parses and validates the input data, returning
 * a typed User entity. It enforces all business rules and invariants.
 *
 * @param data - Raw data to parse into a User
 * @returns The validated User entity
 * @throws ZodError if validation fails
 */
export function parseUser(data: {
  id: string
  name: string
  email: string
  createdAt?: Date
  updatedAt?: Date
}): User {
  const now = new Date()
  return UserSchema.parse({
    id: UserIdSchema.parse(data.id),
    name: data.name,
    email: EmailSchema.parse(data.email),
    createdAt: data.createdAt ?? now,
    updatedAt: data.updatedAt ?? now,
  })
}

/**
 * Safely parse raw data into a User entity
 *
 * @param data - Raw data to parse into a User
 * @returns A result object with success flag and data/error
 */
export function safeParseUser(data: {
  id: string
  name: string
  email: string
  createdAt?: Date
  updatedAt?: Date
}) {
  const now = new Date()

  // First parse the nested branded types
  const userIdResult = UserIdSchema.safeParse(data.id)
  const emailResult = EmailSchema.safeParse(data.email)

  // If any nested parsing fails, return early
  if (!userIdResult.success || !emailResult.success) {
    return {
      success: false as const,
      error: userIdResult.success ? emailResult.error : userIdResult.error,
    }
  }

  // Now parse the full User schema
  return UserSchema.safeParse({
    id: userIdResult.data,
    name: data.name,
    email: emailResult.data,
    createdAt: data.createdAt ?? now,
    updatedAt: data.updatedAt ?? now,
  })
}

/**
 * Create a new User entity
 *
 * Factory function for creating a new User with current timestamps.
 *
 * @param data - Data for creating a new User
 * @returns A new User entity
 */
export function createUser(data: {
  id: string
  name: string
  email: string
}): User {
  return parseUser(data)
}

/**
 * Reconstitute a User entity from persistence
 *
 * Factory function for recreating a User from stored data.
 *
 * @param data - Stored User data
 * @returns A User entity
 */
export function reconstituteUser(data: {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}): User {
  return parseUser(data)
}

/**
 * Update a User's name
 *
 * Business logic function that enforces rules when updating a user's name.
 * Returns a new User object with updated state.
 *
 * @param user - The user to update
 * @param newName - The new name
 * @returns A new User with updated name and timestamp
 */
export function updateUserName(user: User, newName: string): User {
  return UserSchema.parse({
    ...user,
    name: newName,
    updatedAt: new Date(),
  })
}

/**
 * Update a User's email
 *
 * @param user - The user to update
 * @param newEmail - The new email (as string, will be parsed)
 * @returns A new User with updated email and timestamp
 */
export function updateUserEmail(user: User, newEmail: string): User {
  return UserSchema.parse({
    ...user,
    email: EmailSchema.parse(newEmail),
    updatedAt: new Date(),
  })
}

/**
 * Check if two User entities are equal (by identity)
 *
 * @param user1 - First user
 * @param user2 - Second user
 * @returns True if both users have the same ID
 */
export function usersEqual(user1: User, user2: User): boolean {
  return user1.id === user2.id
}
```

```typescript
// src/entities/User/index.ts
export {
  UserSchema,
  parseUser,
  safeParseUser,
  createUser,
  reconstituteUser,
  updateUserName,
  updateUserEmail,
  usersEqual,
  type User,
} from './User.js'
```

**When to use Entities:**

- Need unique identity (using branded types)
- State changes over time
- Need to track lifecycle
- Represent core business concepts
- Need to parse and validate complex domain objects

**Benefits of Using Zod for Entities:**

- **Parse Don't Validate**: Parse data once and get back typed, validated entities
- **Type Safety**: TypeScript types are inferred from Zod schemas
- **Composable**: Zod schemas can be composed and extended
- **Runtime Validation**: Validation happens at runtime, catching errors early
- **Clear Errors**: Zod provides detailed error messages when parsing fails

## Step 3: Define Ports

Ports are interfaces that define contracts for external dependencies. They allow the domain to remain independent of infrastructure concerns.

**Characteristics:**

- Define what the domain needs, not how it's implemented
- No concrete implementations in the domain layer
- Enable dependency inversion
- Make the domain testable

**Example:**

```typescript
// src/ports/UserRepositoryPort.ts

import type { User } from '../entities/User/User.js'
import type { UserId } from '../valueobjects/UserId/UserId.js'

/**
 * UserRepositoryPort - Port interface for User persistence
 *
 * Ports define the contract that adapters must implement.
 * This allows the domain layer to remain independent of infrastructure concerns.
 */
export interface UserRepositoryPort {
  /**
   * Save a User entity
   * @param user - The entity to save
   */
  save(user: User): Promise<void>

  /**
   * Find a User by ID
   * @param id - The unique identifier (branded type)
   * @returns The entity or null if not found
   */
  findById(id: UserId): Promise<User | null>

  /**
   * Find all Users
   * @returns Array of all entities
   */
  findAll(): Promise<User[]>

  /**
   * Delete a User by ID
   * @param id - The unique identifier (branded type)
   */
  delete(id: UserId): Promise<void>
}
```

**Port Naming Convention:**

- Use descriptive names: `{Feature}RepositoryPort`, `{Feature}NotificationPort`, `{Feature}ValidationPort`
- Suffix with `Port` to make it clear it's an interface
- Keep ports focused on a single responsibility

## Step 4: Create Use Cases

Use cases contain business logic and orchestrate entities and value objects. They depend on ports, not concrete implementations.

**Pattern:**

- Use arrow functions with naming convention: `create{UseCaseName}`
- Outer function receives ports as an object: `{ portName: PortType }`
- Inner function receives input (if any) and returns output
- Define input interfaces for use cases that need parameters

**Example Use Case with Input:**

```typescript
// src/usecases/UserManagement/CreateUser.ts

import type { UserRepositoryPort } from '../../ports/UserRepositoryPort.js'
import { createUser, type User } from '../../entities/User/User.js'
import { parseUserId, type UserId } from '../../valueobjects/UserId/UserId.js'
import { parseEmail } from '../../valueobjects/Email/Email.js'

/**
 * Input type for CreateUser use case
 */
export interface CreateUserInput {
  id: string
  name: string
  email: string
}

/**
 * CreateUser - Use case for creating a new User
 *
 * This use case contains the business logic for creating a User.
 * It depends on the UserRepositoryPort interface, not a concrete implementation.
 * Note: This use case uses the shared User entity and Email value object.
 *
 * Following "Parse don't validate" - we parse the input into typed domain objects.
 */
export const createCreateUser =
  ({ repositoryPort }: { repositoryPort: UserRepositoryPort }) =>
  async (input: CreateUserInput): Promise<User> => {
    // Parse input into branded types
    const userId = parseUserId(input.id)

    // Check if entity already exists
    const existing = await repositoryPort.findById(userId)
    if (existing) {
      throw new Error('User with this ID already exists')
    }

    // Parse email (validates format)
    parseEmail(input.email) // Will throw if invalid

    // Create entity using factory function (parses and validates)
    const user = createUser({
      id: input.id,
      name: input.name,
      email: input.email,
    })

    // Persist entity
    await repositoryPort.save(user)

    return user
  }
```

**Example Use Case with No Input:**

```typescript
// src/usecases/UserManagement/GetAllUsers.ts

import type { UserRepositoryPort } from '../../ports/UserRepositoryPort.js'
import type { User } from '../../entities/User/User.js'

/**
 * GetAllUsers - Use case for retrieving all Users
 *
 * This use case contains the business logic for retrieving all Users.
 */
export const createGetAllUsers =
  ({ repositoryPort }: { repositoryPort: UserRepositoryPort }) =>
  async (): Promise<User[]> => {
    return await repositoryPort.findAll()
  }
```

**Example Use Case with Business Logic:**

```typescript
// src/usecases/UserManagement/UpdateUser.ts

import type { UserRepositoryPort } from '../../ports/UserRepositoryPort.js'
import {
  updateUserName,
  updateUserEmail,
  type User,
} from '../../entities/User/User.js'
import { parseUserId } from '../../valueobjects/UserId/UserId.js'
import { parseEmail } from '../../valueobjects/Email/Email.js'

/**
 * Input type for UpdateUser use case
 */
export interface UpdateUserInput {
  id: string
  name?: string
  email?: string
}

/**
 * UpdateUser - Use case for updating a User
 *
 * This use case contains the business logic for updating a User.
 * It enforces business rules and uses entity functions to update state.
 *
 * Following "Parse don't validate" - we parse inputs and return new
 * immutable User objects with updated state.
 */
export const createUpdateUser =
  ({ repositoryPort }: { repositoryPort: UserRepositoryPort }) =>
  async (input: UpdateUserInput): Promise<User> => {
    // Parse ID into branded type
    const userId = parseUserId(input.id)

    // Load entity
    const user = await repositoryPort.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Update name if provided (returns new User object)
    let updatedUser = user
    if (input.name !== undefined) {
      updatedUser = updateUserName(updatedUser, input.name)
    }

    // Update email if provided (validates and returns new User object)
    if (input.email !== undefined) {
      parseEmail(input.email) // Validate email format
      updatedUser = updateUserEmail(updatedUser, input.email)
    }

    // Persist changes
    await repositoryPort.save(updatedUser)

    return updatedUser
  }
```

**Export Use Cases:**

```typescript
// src/usecases/UserManagement/index.ts
export { createCreateUser, type CreateUserInput } from './CreateUser.js'
export { createGetAllUsers } from './GetAllUsers.js'
export { createUpdateUser, type UpdateUserInput } from './UpdateUser.js'
export { createGetUserById, type GetUserByIdInput } from './GetUserById.js'
```

```typescript
// src/usecases/index.ts
export * from './Authentication/index.js'
export * from './UserManagement/index.js'
// ... export other features
```

## Step 5: Create Factory Functions

Factories inject ports into use cases and return configured use case functions. This simplifies dependency injection for consumers. Each feature has its own factory, even if it uses shared entities.

**Example - Feature-Specific Factory Using Shared Entity:**

````typescript
// src/factories/createUserManagementUseCases.ts

import type { UserRepositoryPort } from '../ports/UserRepositoryPort.js'
import {
  createCreateUser,
  createGetAllUsers,
  createUpdateUser,
  createGetUserById,
  type CreateUserInput,
  type UpdateUserInput,
  type GetUserByIdInput,
} from '../usecases/UserManagement/index.js'
import type { User } from '../entities/User/User.js' // Shared entity

/**
 * Ports required by UserManagement use cases
 */
export interface UserManagementUseCasePorts {
  repositoryPort: UserRepositoryPort
}

/**
 * UserManagement use cases returned by the factory
 */
export interface UserManagementUseCases {
  createUser: (input: CreateUserInput) => Promise<User>
  getAllUsers: () => Promise<User[]>
  updateUser: (input: UpdateUserInput) => Promise<User>
  getUserById: (input: GetUserByIdInput) => Promise<User | null>
}

/**
 * Factory function that creates UserManagement use cases with injected ports
 *
 * This factory is feature-specific, but uses the shared User entity.
 * Other features (like Authentication) would have their own factory.
 *
 * @param ports - The ports required by UserManagement use cases
 * @returns An object containing the UserManagement use case functions
 *
 * @example
 * ```typescript
 * const repository = new DatabaseRepository();
 * const userManagementUseCases = createUserManagementUseCases({
 *   repositoryPort: repository
 * });
 *
 * const user = await userManagementUseCases.createUser({
 *   id: '123',
 *   name: 'Example',
 *   email: 'example@example.com'
 * });
 * ```
 */
export function createUserManagementUseCases(
  ports: UserManagementUseCasePorts,
): UserManagementUseCases {
  return {
    createUser: createCreateUser(ports),
    getAllUsers: createGetAllUsers(ports),
    updateUser: createUpdateUser(ports),
    getUserById: createGetUserById(ports),
  }
}
````

**Example - Another Feature Using the Same Entity:**

```typescript
// src/factories/createAuthenticationUseCases.ts

import type { UserRepositoryPort } from '../ports/UserRepositoryPort.js'
import {
  createLoginUser,
  createLogoutUser,
  type LoginUserInput,
} from '../usecases/Authentication/index.js'
import type { User } from '../entities/User/User.js' // Same shared entity

export interface AuthenticationUseCasePorts {
  repositoryPort: UserRepositoryPort
}

export interface AuthenticationUseCases {
  loginUser: (input: LoginUserInput) => Promise<User>
  logoutUser: () => Promise<void>
}

export function createAuthenticationUseCases(
  ports: AuthenticationUseCasePorts,
): AuthenticationUseCases {
  return {
    loginUser: createLoginUser(ports),
    logoutUser: createLogoutUser(ports),
  }
}
```

**Key Points:**

- Each feature has its own factory function
- Factories are feature-specific, but can use shared entities and ports
- Multiple features can use the same entity without duplication
- Ports can also be shared if multiple features need the same repository interface

## Step 6: Export from Domain Package

Export all public APIs from the main index file:

```typescript
// src/index.ts

// Entities (shared across features)
export {
  UserSchema,
  parseUser,
  safeParseUser,
  createUser,
  reconstituteUser,
  updateUserName,
  updateUserEmail,
  usersEqual,
  type User,
} from './entities/User/index.js'

// Value Objects (shared across features)
export {
  EmailSchema,
  parseEmail,
  safeParseEmail,
  type Email,
} from './valueobjects/Email/index.js'

export {
  UserIdSchema,
  parseUserId,
  safeParseUserId,
  type UserId,
} from './valueobjects/UserId/index.js'

// Ports (can be shared or feature-specific)
export type { UserRepositoryPort } from './ports/UserRepositoryPort.js'

// Use Cases (feature-specific)
export * from './usecases/index.js'

// Factories (feature-specific)
export {
  createUserManagementUseCases,
  type UserManagementUseCasePorts,
  type UserManagementUseCases,
} from './factories/createUserManagementUseCases.js'

export {
  createAuthenticationUseCases,
  type AuthenticationUseCasePorts,
  type AuthenticationUseCases,
} from './factories/createAuthenticationUseCases.js'
```

## Complete Example Structure

Here's a complete example showing how multiple features share the same `User` entity:

```
domain/src/
├── entities/
│   └── User/                    # Shared entity
│       ├── User.ts
│       └── index.ts
├── valueobjects/
│   ├── Email/                   # Shared value object
│   │   ├── Email.ts
│   │   └── index.ts
│   └── Password/                # Shared value object
│       ├── Password.ts
│       └── index.ts
├── ports/
│   └── UserRepositoryPort.ts    # Shared port
├── usecases/
│   ├── Authentication/          # Feature 1: uses User entity
│   │   ├── LoginUser.ts
│   │   ├── LogoutUser.ts
│   │   └── index.ts
│   └── UserManagement/          # Feature 2: uses same User entity
│       ├── CreateUser.ts
│       ├── UpdateUser.ts
│       ├── GetUserById.ts
│       ├── GetAllUsers.ts
│       └── index.ts
└── factories/
    ├── createAuthenticationUseCases.ts    # Feature 1 factory
    └── createUserManagementUseCases.ts    # Feature 2 factory
```

**Key Points:**

- Both `Authentication` and `UserManagement` features import the same `User` entity from `entities/User/`
- Both features use the same `Email` and `Password` value objects
- Both features can use the same `UserRepositoryPort` if they need the same repository operations
- Each feature has its own use cases and factory, but they share the domain entities and value objects
- No code duplication - the `User` entity is defined once and reused

## Best Practices

### 1. Entities

- Use Zod schemas to define entity structure
- Use factory functions (`create`, `reconstitute`) to create entities
- Use `parseUser()` or `safeParseUser()` to parse raw data into entities
- Encapsulate business logic in pure functions that return new entity objects
- Update timestamps when state changes
- Compare entities by identity (using branded types), not values
- Follow "Parse don't validate" - parse once, get typed result

### 2. Value Objects and Branded Types

- Use Zod schemas with `.brand()` to create branded types
- Use branded types for primitives to prevent type mixing (UserId, Email, etc.)
- Export `parse*()` functions for parsing and validation
- Export `safeParse*()` functions for safe parsing with error handling
- Use branded types to make the type system enforce domain rules
- Follow "Parse don't validate" - parse once, get typed result

### 3. Ports

- Keep ports focused and minimal
- Define only what the use case needs
- Use descriptive names with `Port` suffix
- Document expected behavior in comments

### 4. Use Cases

- One use case per business operation
- Keep use cases focused and single-purpose
- Use entities and value objects for business logic
- Depend on ports, not concrete implementations
- Handle errors appropriately (throw domain exceptions)

### 5. Factories

- Group related use cases in a single factory
- Define clear port interfaces
- Export both the factory and type definitions
- Document usage with examples

## Testing

Use cases can be tested by providing mock ports. With Zod schemas, you can also test parsing logic:

```typescript
import { createUserManagementUseCases } from '@your-domain/domain'
import { parseUserId } from '@your-domain/domain'

test('createUser creates a new entity', async () => {
  const mockRepository = {
    findById: vi.fn().mockResolvedValue(null),
    save: vi.fn().mockResolvedValue(undefined),
    findAll: vi.fn(),
    delete: vi.fn(),
  }

  const useCases = createUserManagementUseCases({
    repositoryPort: mockRepository,
  })

  const result = await useCases.createUser({
    id: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID
    name: 'Test',
    email: 'test@example.com',
  })

  expect(result.id).toBe('550e8400-e29b-41d4-a716-446655440000')
  expect(mockRepository.save).toHaveBeenCalledWith(result)
})

test('parseUserId validates UUID format', () => {
  const validId = parseUserId('550e8400-e29b-41d4-a716-446655440000')
  expect(validId).toBe('550e8400-e29b-41d4-a716-446655440000')

  expect(() => parseUserId('invalid-id')).toThrow()
})

test('parseEmail validates email format', () => {
  const validEmail = parseEmail('test@example.com')
  expect(validEmail).toBe('test@example.com')

  expect(() => parseEmail('invalid-email')).toThrow()
})
```

## Summary

Creating a DDD feature involves:

1. **Value Objects and Branded Types** - Use Zod schemas with branded types to create type-safe domain primitives (Email, UserId, etc.)
2. **Entities** - Use Zod schemas to define entities, following the "Parse don't validate" pattern
3. **Ports** - Define interfaces for external dependencies, using branded types for type safety
4. **Use Cases** - Implement business operations using parsed entities and value objects
5. **Factories** - Create configured use cases with dependency injection

**Key Principles:**

- **Parse Don't Validate**: Use Zod schemas to parse data once and get back typed, validated results
- **Branded Types**: Use branded types for primitives to prevent mixing different domain concepts
- **Type Safety**: Leverage TypeScript's type system with Zod's runtime validation
- **Immutability**: Entities and value objects are immutable - updates return new objects

This structure keeps your domain layer independent, testable, and focused on business logic while providing strong type safety and runtime validation.
