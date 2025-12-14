import { useState } from 'react'
import {
  Heading,
  Text,
  Button,
  Flex,
  Box,
  TextInput,
  Checkbox,
} from '@zen-design/ui'
import { useCreateExerciseViewModel } from '../viewmodels/useCreateExerciseViewModel'
import { useNavigate } from 'react-router-dom'

export function CreateExercisePage() {
  const { isLoading, error, createExercise } = useCreateExerciseViewModel()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [usesWeight, setUsesWeight] = useState(false)
  const [usesTime, setUsesTime] = useState(false)
  const [usesReps, setUsesReps] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      return
    }
    await createExercise({
      name: name.trim(),
      usesWeight,
      usesTime,
      usesReps,
    })
  }

  return (
    <Box padding="lg">
      <Flex direction="column" gap="lg">
        <Heading size="2xl">Create Exercise</Heading>

        {error && (
          <Box
            padding="md"
            style={{
              backgroundColor: 'var(--color-error)',
              color: 'var(--color-text-inverse)',
            }}
          >
            <Text>{error.message}</Text>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="md">
            <Flex direction="column" gap="sm">
              <Text>Name</Text>
              <TextInput
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                placeholder="Exercise name"
                required
              />
            </Flex>

            <Flex direction="column" gap="sm">
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <Checkbox
                  checked={usesWeight}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsesWeight(e.target.checked)
                  }
                />
                <Text>Uses Weight</Text>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <Checkbox
                  checked={usesTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsesTime(e.target.checked)
                  }
                />
                <Text>Uses Time</Text>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <Checkbox
                  checked={usesReps}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsesReps(e.target.checked)
                  }
                />
                <Text>Uses Reps</Text>
              </label>
            </Flex>

            <Flex gap="md">
              <Button type="submit" variant="primary" disabled={isLoading}>
                Save Exercise
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/exercises')}
              >
                Cancel
              </Button>
            </Flex>
          </Flex>
        </form>
      </Flex>
    </Box>
  )
}
