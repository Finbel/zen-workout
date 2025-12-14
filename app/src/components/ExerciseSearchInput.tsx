import { useState, useRef, useEffect } from 'react'
import { TextInput, Box, Flex, Text } from '@zen-design/ui'
import type { Exercise } from '@zen-design/domain'

interface ExerciseSearchInputProps {
  exercises: Exercise[]
  onSelect: (exercise: Exercise) => void
  placeholder?: string
}

export function ExerciseSearchInput({
  exercises,
  onSelect,
  placeholder = 'Search exercises...',
}: ExerciseSearchInputProps) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise)
    setQuery('')
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < filteredExercises.length - 1 ? prev + 1 : prev,
      )
      setShowSuggestions(true)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(filteredExercises[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <TextInput
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setShowSuggestions(true)
          setSelectedIndex(-1)
        }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
          handleKeyDown(e)
        }
        placeholder={placeholder}
      />
      {showSuggestions && query.trim() && filteredExercises.length > 0 && (
        <Box
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 'var(--space-1)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {filteredExercises.map((exercise, index) => (
            <Flex
              key={exercise.id as string}
              padding="sm"
              style={{
                cursor: 'pointer',
                backgroundColor:
                  index === selectedIndex
                    ? 'var(--color-surface-elevated)'
                    : 'transparent',
              }}
              onClick={() => handleSelect(exercise)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <Text>{exercise.name}</Text>
            </Flex>
          ))}
        </Box>
      )}
    </div>
  )
}
