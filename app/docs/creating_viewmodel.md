# Creating ViewModels

A ViewModel is a React hook that acts as a bridge between your UI components and your domain layer. It encapsulates state management, orchestrates use cases, and provides a clean interface for components to interact with business logic.

## Responsibilities

The ViewModel has several key responsibilities:

1. **State Management**: Manages UI-related state (data, loading states, errors)
2. **Use Case Orchestration**: Initializes and coordinates domain use cases
3. **Adapter Integration**: Wires adapters to use cases through dependency injection
4. **Error Handling**: Catches and manages errors from async operations
5. **Side Effects**: Handles lifecycle operations like loading initial data
6. **Interface Simplification**: Provides a simple, component-friendly API

## Structure

A ViewModel follows this general structure:

```typescript
import { useState, useEffect, useMemo, useCallback } from 'react'
import { createUseCases } from '@your-domain/package'
import { YourAdapter } from '../../adapters/YourAdapter'

/**
 * ViewModel for [feature description]
 *
 * Encapsulates state management and use case orchestration,
 * providing a clean interface for the component to interact with.
 */
export function useYourViewModel() {
  // 1. State declarations
  const [data, setData] = useState<DataType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // 2. Initialize use cases with adapters
  const useCases = useMemo(() => {
    const adapter = new YourAdapter()
    return createUseCases({ port: adapter })
  }, [])

  // 3. Async operations wrapped in useCallback
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await useCases.getData()
      setData(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [useCases])

  const performAction = useCallback(
    async (input: ActionInput) => {
      try {
        setError(null)
        const result = await useCases.performAction(input)
        setData(result)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        console.error('Error performing action:', error)
      }
    },
    [useCases],
  )

  // 4. Side effects (e.g., load data on mount)
  useEffect(() => {
    loadData()
  }, [loadData])

  // 5. Return clean interface
  return {
    data,
    isLoading,
    error,
    loadData,
    performAction,
  }
}
```

## Patterns

### 1. State Management Pattern

ViewModels typically manage three types of state:

- **Data State**: The primary data the component needs to display
- **Loading State**: Indicates when async operations are in progress
- **Error State**: Captures errors from failed operations

```typescript
const [data, setData] = useState<DataType | null>(null)
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState<Error | null>(null)
```

**Guidelines:**

- Initialize loading state to `true` if data loads on mount
- Use `null` for optional data that may not exist yet
- Always type error state as `Error | null`

### 2. Use Case Initialization Pattern

Use cases should be initialized once using `useMemo` to avoid recreating them on every render:

```typescript
const useCases = useMemo(() => {
  const adapter = new YourAdapter()
  return createUseCases({ port: adapter })
}, [])
```

**Guidelines:**

- Create adapters inside the `useMemo` callback
- Keep the dependency array empty unless adapters have dependencies
- This ensures use cases are created once and reused across renders

### 3. Async Operation Pattern

All async operations should follow a consistent pattern:

```typescript
const performOperation = useCallback(
  async (input?: InputType) => {
    try {
      setIsLoading(true) // Only if this is a loading operation
      setError(null) // Clear previous errors
      const result = await useCases.operation(input)
      setData(result) // Update state with result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Error performing operation:', error)
    } finally {
      setIsLoading(false) // Only if loading state was set
    }
  },
  [useCases],
)
```

**Guidelines:**

- Wrap async operations in `useCallback` with `useCases` as a dependency
- Always clear errors before starting a new operation
- Use try-catch-finally for consistent error handling
- Convert unknown errors to `Error` instances
- Set loading state only for operations that should show loading indicators
- Log errors for debugging purposes

### 4. Error Handling Pattern

Consistent error handling ensures a good user experience:

```typescript
catch (err) {
  const error = err instanceof Error ? err : new Error('Unknown error')
  setError(error)
  console.error('Error [operation name]:', error)
}
```

**Guidelines:**

- Always normalize errors to `Error` instances
- Store errors in state so components can display them
- Log errors with descriptive messages
- Clear errors before starting new operations

### 5. Side Effects Pattern

Use `useEffect` for lifecycle operations:

```typescript
// Load data on mount
useEffect(() => {
  loadData()
}, [loadData])

// Or with dependencies
useEffect(() => {
  if (someCondition) {
    loadData()
  }
}, [loadData, someCondition])
```

**Guidelines:**

- Use `useEffect` for operations that should run on mount or when dependencies change
- Include the operation function in the dependency array
- Add conditional logic inside `useEffect` if needed

### 6. Return Interface Pattern

Return only what the component needs:

```typescript
return {
  // State
  data,
  isLoading,
  error,

  // Operations
  loadData,
  performAction,

  // Optional: computed values
  // hasData: data !== null,
}
```

**Guidelines:**

- Return all state the component needs to render
- Return all operations the component can trigger
- Optionally include computed values that are commonly needed
- Keep the interface minimal and focused

## Best Practices

### Naming Conventions

- ViewModel hooks should be named `use[Feature]ViewModel`
- State variables should be descriptive: `userData`, `isLoading`, `error`
- Operation functions should be verbs: `loadUser`, `updateProfile`, `deleteItem`

### Separation of Concerns

- **ViewModel**: State management, use case orchestration, error handling
- **Component**: Rendering, user interaction, UI logic
- **Use Cases**: Business logic, domain rules
- **Adapters**: External service integration

### Performance Considerations

- Use `useMemo` for expensive computations or use case initialization
- Use `useCallback` for functions passed to child components or used in effects
- Avoid unnecessary re-renders by memoizing values and callbacks

### Testing Considerations

- ViewModels can be tested by mocking use cases
- Test state transitions, error handling, and side effects
- Ensure adapters are properly injected

## Example Usage in Component

```typescript
import { useYourViewModel } from './useYourViewModel'

export function YourComponent() {
  const { data, isLoading, error, performAction } = useYourViewModel()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  return (
    <div>
      <DataDisplay data={data} />
      <Button onClick={() => performAction(input)}>Perform Action</Button>
    </div>
  )
}
```

## Common Patterns

### Loading Initial Data

```typescript
useEffect(() => {
  loadData()
}, [loadData])
```

### Conditional Loading

```typescript
useEffect(() => {
  if (shouldLoad) {
    loadData()
  }
}, [loadData, shouldLoad])
```

### Optimistic Updates

```typescript
const updateData = useCallback(
  async (input: UpdateInput) => {
    // Optimistically update UI
    setData((prev) => ({ ...prev, ...input }))

    try {
      setError(null)
      const result = await useCases.updateData(input)
      setData(result) // Update with server response
    } catch (err) {
      // Revert on error
      loadData()
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
    }
  },
  [useCases, loadData],
)
```

### Dependent Operations

```typescript
const performDependentAction = useCallback(
  async (input: InputType) => {
    try {
      setError(null)
      const result = await useCases.firstOperation(input)
      setData(result)

      // Perform second operation with result
      const finalResult = await useCases.secondOperation(result.id)
      setData(finalResult)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
    }
  },
  [useCases],
)
```

## Summary

ViewModels provide a clean separation between UI and business logic by:

1. Managing component state in one place
2. Coordinating domain use cases
3. Handling errors consistently
4. Providing a simple interface for components
5. Following React best practices (hooks, memoization, effects)

By following these patterns, you create maintainable, testable, and reusable ViewModels that keep your components focused on presentation while your domain logic remains independent and testable.
