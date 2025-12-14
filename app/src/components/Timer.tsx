import { Text } from '@zen-design/ui'

interface TimerProps {
  seconds: number
  size?: 'sm' | 'md' | 'lg'
}

export function Timer({ seconds, size = 'md' }: TimerProps) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const formatted = `${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`

  const sizeMap = {
    sm: 'var(--font-size-lg)',
    md: 'var(--font-size-2xl)',
    lg: 'var(--font-size-4xl)',
  }

  return (
    <Text
      style={{
        fontSize: sizeMap[size],
        fontFamily: 'monospace',
        fontWeight: 'var(--font-weight-semibold)',
      }}
    >
      {formatted}
    </Text>
  )
}
