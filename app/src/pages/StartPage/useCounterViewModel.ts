import { useState, useEffect, useMemo, useCallback } from 'react'
import { createCounterUseCases } from '@zen-design/domain'
import { LocalStorageAdapter } from '../../adapters/LocalStorageAdapter'

/**
 * ViewModel for the counter functionality on StartPage
 *
 * Encapsulates state management and use case orchestration,
 * providing a clean interface for the component to interact with.
 */
export function useCounterViewModel() {
  const [counterValue, setCounterValue] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize use cases with LocalStorageAdapter
  const counterUseCases = useMemo(() => {
    const storageAdapter = new LocalStorageAdapter()
    return createCounterUseCases({ storagePort: storageAdapter })
  }, [])

  // Load initial counter value
  const loadCounter = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const value = await counterUseCases.getCounter()
      setCounterValue(value)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Error loading counter:', error)
    } finally {
      setIsLoading(false)
    }
  }, [counterUseCases])

  // Handle increment counter
  const incrementCounter = useCallback(async () => {
    try {
      setError(null)
      const newValue = await counterUseCases.incrementCounter()
      setCounterValue(newValue)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('Error incrementing counter:', error)
    }
  }, [counterUseCases])

  // Load counter on mount
  useEffect(() => {
    loadCounter()
  }, [loadCounter])

  return {
    counterValue,
    isLoading,
    error,
    incrementCounter,
  }
}
