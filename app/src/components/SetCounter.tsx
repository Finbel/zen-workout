import { Button, Text, Flex } from '@zen-design/ui'

interface SetCounterProps {
  sets: number
  onIncrement: () => void
  onDecrement: () => void
  min?: number
}

export function SetCounter({
  sets,
  onIncrement,
  onDecrement,
  min = 1,
}: SetCounterProps) {
  return (
    <Flex align="center" gap="sm">
      <Button
        variant="outline"
        size="sm"
        onClick={onDecrement}
        disabled={sets <= min}
      >
        -
      </Button>
      <Text>{sets}</Text>
      <Button variant="outline" size="sm" onClick={onIncrement}>
        +
      </Button>
    </Flex>
  )
}
