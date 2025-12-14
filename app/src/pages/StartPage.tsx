import { Heading, Text, Table, Flex, Box } from '@zen-design/ui'
import { useStartPageViewModel } from '../viewmodels/useStartPageViewModel'

export function StartPage() {
  const { workoutLogs, isLoading, error, formatDuration, formatDate } =
    useStartPageViewModel()

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
        <Heading size="2xl">Workout Logs</Heading>

        {workoutLogs.length === 0 ? (
          <Text>No workout logs yet. Start a workout to see it here.</Text>
        ) : (
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Date</Table.Header>
                <Table.Header>Workout</Table.Header>
                <Table.Header>Duration</Table.Header>
                <Table.Header>Status</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {workoutLogs.map((log) => (
                <Table.Row key={log.id as string}>
                  <Table.Cell>{formatDate(log.startedAt)}</Table.Cell>
                  <Table.Cell>
                    {(log as any).workout?.name || (log.workoutId as string)}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDuration(log.startedAt, log.completedAt)}
                  </Table.Cell>
                  <Table.Cell>
                    {log.completedAt ? (
                      <Text>Completed</Text>
                    ) : (
                      <Text>In Progress</Text>
                    )}
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
