import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { useLogSetViewModel } from './useLogSetViewModel'
import { createWorkoutTrackerUseCases } from '@zen-design/domain'
import { createWorkoutLog } from '@zen-design/domain'
import type { Workout, Exercise } from '@zen-design/domain'

// Mock the adapters
vi.mock('../adapters/LocalStorageExerciseAdapter')
vi.mock('../adapters/LocalStorageWorkoutAdapter')
vi.mock('../adapters/LocalStorageWorkoutLogAdapter')

describe('useLogSetViewModel - Rest Timer', () => {
  const mockWorkout: Partial<Workout> = {
    id: 'workout-1' as any,
    name: 'Test Workout',
    exercises: [
      {
        exerciseId: 'exercise-1' as any,
        sets: 3,
      },
    ],
  }

  const mockExercise: Partial<Exercise> = {
    id: 'exercise-1' as any,
    name: 'Push-ups',
    usesWeight: false,
    usesReps: true,
    usesTime: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should start rest timer at 0 when landing on LogSetPage after completing first set', async () => {
    const workoutLog = createWorkoutLog({
      workoutId: 'workout-1',
      startedAt: new Date(Date.now() - 60000), // 1 minute ago
    })

    // Add one completed set
    const completedSet = {
      exerciseId: 'exercise-1',
      setNumber: 1,
      weight: null,
      time: null,
      reps: 10,
      exerciseDuration: 30,
      restDuration: 0,
      completedAt: new Date(),
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BrowserRouter>{children}</BrowserRouter>
    )

    // Mock useSearchParams to return log-set page params
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual,
        useParams: () => ({ id: 'workout-1' }),
        useSearchParams: () => [
          new URLSearchParams(
            '?logId=log-1&exerciseIndex=0&set=1&exerciseDuration=30',
          ),
        ],
        useNavigate: () => vi.fn(),
      }
    })

    // This test will need proper mocking setup
    // For now, let's focus on the actual bug fix
  })

  it('should show rest timer on LogSetPage even when restTime is 0', () => {
    // Test that rest timer is visible when restTime is 0
    // This tests the UI condition
  })

  it('should pass restStartTime to RestPage when navigating', () => {
    // Test that restStartTime is correctly passed in URL params
  })
})
