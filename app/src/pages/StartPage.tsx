import { Heading, Text, Table, Flex, Box } from '@zen-design/ui'
import { useStartPageViewModel } from '../viewmodels/useStartPageViewModel'

export function StartPage() {
  const {
    workoutLogs,
    isLoading,
    error,
    formatDuration,
    formatDate,
    handleWorkoutLogClick,
  } = useStartPageViewModel()

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
      <style>{`
        .workout-log-row:hover {
          background-color: var(--color-border-subtle, rgba(0, 0, 0, 0.05)) !important;
        }
        .workout-log-row:focus {
          outline: 2px solid var(--color-primary, #007bff);
          outline-offset: -2px;
        }
      `}</style>
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
              {workoutLogs.map((log) => {
                const isCompleted = !!log.completedAt
                const workoutName =
                  (log as any).workout?.name || (log.workoutId as string)
                const ariaLabel = isCompleted
                  ? `View summary for ${workoutName} workout`
                  : `Continue ${workoutName} workout`

                return (
                  <Table.Row
                    key={log.id as string}
                    onClick={() => handleWorkoutLogClick(log)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleWorkoutLogClick(log)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={ariaLabel}
                    style={{
                      cursor: 'pointer',
                    }}
                    className="workout-log-row"
                  >
                    <Table.Cell>{formatDate(log.startedAt)}</Table.Cell>
                    <Table.Cell>{workoutName}</Table.Cell>
                    <Table.Cell>
                      {formatDuration(log.startedAt, log.completedAt)}
                    </Table.Cell>
                    <Table.Cell>
                      {isCompleted ? (
                        <Text>Completed</Text>
                      ) : (
                        <Text>In Progress</Text>
                      )}
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        )}
      </Flex>
    </Box>
  )
}
