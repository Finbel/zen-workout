import { Heading, Text, Table, Button, Flex, Box } from '@zen-design/ui'
import { useExerciseListViewModel } from '../viewmodels/useExerciseListViewModel'
import { useNavigate } from 'react-router-dom'

export function ExercisesPage() {
  const { exercises, isLoading, error, deleteExercise } =
    useExerciseListViewModel()
  const navigate = useNavigate()

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      await deleteExercise(id as any)
    }
  }

  if (isLoading) {
    return (
      <Box padding="lg">
        <Text>Loading...</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box padding="lg">
        <Text>{error.message}</Text>
      </Box>
    )
  }

  return (
    <Box padding="lg">
      <Flex direction="column" gap="lg">
        <Flex justify="between" align="center">
          <Heading size="2xl">Exercises</Heading>
          <Button
            variant="primary"
            onClick={() => navigate('/exercises/create')}
          >
            Create Exercise
          </Button>
        </Flex>

        {exercises.length === 0 ? (
          <Text>
            No exercises yet. Create your first exercise to get started.
          </Text>
        ) : (
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Name</Table.Header>
                <Table.Header>Uses Weight</Table.Header>
                <Table.Header>Uses Time</Table.Header>
                <Table.Header>Uses Reps</Table.Header>
                <Table.Header>Actions</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {exercises.map((exercise) => (
                <Table.Row key={exercise.id as string}>
                  <Table.Cell>{exercise.name}</Table.Cell>
                  <Table.Cell>{exercise.usesWeight ? 'Yes' : 'No'}</Table.Cell>
                  <Table.Cell>{exercise.usesTime ? 'Yes' : 'No'}</Table.Cell>
                  <Table.Cell>{exercise.usesReps ? 'Yes' : 'No'}</Table.Cell>
                  <Table.Cell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(exercise.id as string)}
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Flex>
    </Box>
  )
}
