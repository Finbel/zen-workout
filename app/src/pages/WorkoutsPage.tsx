import { Heading, Text, Table, Button, Flex, Box } from '@zen-design/ui'
import { useWorkoutListViewModel } from '../viewmodels/useWorkoutListViewModel'
import { useNavigate } from 'react-router-dom'

export function WorkoutsPage() {
  const { workouts, isLoading, error, deleteWorkout } =
    useWorkoutListViewModel()
  const navigate = useNavigate()

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      await deleteWorkout(id as any)
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
          <Heading size="2xl">Workouts</Heading>
          <Button
            variant="primary"
            onClick={() => navigate('/workouts/create')}
          >
            Create Workout
          </Button>
        </Flex>

        {workouts.length === 0 ? (
          <Text>
            No workouts yet. Create your first workout to get started.
          </Text>
        ) : (
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Name</Table.Header>
                <Table.Header>Exercises</Table.Header>
                <Table.Header>Actions</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {workouts.map((workout) => (
                <Table.Row key={workout.id as string}>
                  <Table.Cell>{workout.name}</Table.Cell>
                  <Table.Cell>{workout.exercises.length} exercises</Table.Cell>
                  <Table.Cell>
                    <Flex gap="sm">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          navigate(`/workouts/${workout.id}/start`)
                        }
                      >
                        Start
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(workout.id as string)}
                      >
                        Delete
                      </Button>
                    </Flex>
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
