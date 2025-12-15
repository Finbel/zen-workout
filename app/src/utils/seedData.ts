import {
  createExercise,
  createWorkout,
  parseWorkoutLog,
  completeWorkoutLog,
  type Exercise,
  type Workout,
  type WorkoutLog,
} from '@zen-design/domain'
import { LocalStorageExerciseAdapter } from '../adapters/LocalStorageExerciseAdapter'
import { LocalStorageWorkoutAdapter } from '../adapters/LocalStorageWorkoutAdapter'
import { LocalStorageWorkoutLogAdapter } from '../adapters/LocalStorageWorkoutLogAdapter'

export interface SeedDataOptions {
  force?: boolean
}

export interface SeedDataResult {
  exercises: number
  workouts: number
  workoutLogs: number
  message: string
}

export interface ClearDataResult {
  message: string
}

/**
 * Sample exercise definitions
 */
const sampleExercises = [
  { name: 'Bench Press', usesWeight: true, usesTime: false, usesReps: true },
  { name: 'Squat', usesWeight: true, usesTime: false, usesReps: true },
  { name: 'Deadlift', usesWeight: true, usesTime: false, usesReps: true },
  { name: 'Shoulder Press', usesWeight: true, usesTime: false, usesReps: true },
  { name: 'Barbell Row', usesWeight: true, usesTime: false, usesReps: true },
  { name: 'Plank', usesWeight: false, usesTime: true, usesReps: false },
  { name: 'Wall Sit', usesWeight: false, usesTime: true, usesReps: false },
  { name: 'Pull-ups', usesWeight: false, usesTime: false, usesReps: true },
  { name: 'Push-ups', usesWeight: false, usesTime: false, usesReps: true },
  { name: 'Overhead Press', usesWeight: true, usesTime: false, usesReps: true },
]

/**
 * Seed data into localStorage
 *
 * @param options - Seeding options
 * @returns Summary of seeded data
 */
export async function seedData(
  options: SeedDataOptions = {},
): Promise<SeedDataResult> {
  const { force = false } = options

  const exerciseAdapter = new LocalStorageExerciseAdapter()
  const workoutAdapter = new LocalStorageWorkoutAdapter()
  const workoutLogAdapter = new LocalStorageWorkoutLogAdapter()

  // Check if data already exists
  const existingExercises = await exerciseAdapter.getAllExercises()
  const existingWorkouts = await workoutAdapter.getAllWorkouts()
  const existingLogs = await workoutLogAdapter.getAllWorkoutLogs()

  if (
    !force &&
    (existingExercises.length > 0 ||
      existingWorkouts.length > 0 ||
      existingLogs.length > 0)
  ) {
    return {
      exercises: existingExercises.length,
      workouts: existingWorkouts.length,
      workoutLogs: existingLogs.length,
      message: 'Data already exists. Use { force: true } to overwrite.',
    }
  }

  // Clear existing data if force is enabled
  if (force) {
    localStorage.removeItem('exercises')
    localStorage.removeItem('workouts')
    localStorage.removeItem('workoutLogs')
  }

  // Seed exercises
  const seededExercises: Exercise[] = []
  for (const exerciseData of sampleExercises) {
    const exercise = createExercise(exerciseData)
    await exerciseAdapter.createExercise(exercise)
    seededExercises.push(exercise)
  }

  // Find exercise IDs by name for workout creation
  const getExerciseId = (name: string): string => {
    const exercise = seededExercises.find((e) => e.name === name)
    if (!exercise) {
      throw new Error(`Exercise "${name}" not found`)
    }
    return exercise.id as string
  }

  // Seed workouts
  const seededWorkouts: Workout[] = []

  // Push Day workout
  const pushWorkout = createWorkout({
    name: 'Push Day',
    exercises: [
      { exerciseId: getExerciseId('Bench Press'), sets: 4 },
      { exerciseId: getExerciseId('Shoulder Press'), sets: 3 },
      { exerciseId: getExerciseId('Push-ups'), sets: 3 },
    ],
  })
  await workoutAdapter.createWorkout(pushWorkout)
  seededWorkouts.push(pushWorkout)

  // Pull Day workout
  const pullWorkout = createWorkout({
    name: 'Pull Day',
    exercises: [
      { exerciseId: getExerciseId('Deadlift'), sets: 3 },
      { exerciseId: getExerciseId('Barbell Row'), sets: 4 },
      { exerciseId: getExerciseId('Pull-ups'), sets: 3 },
    ],
  })
  await workoutAdapter.createWorkout(pullWorkout)
  seededWorkouts.push(pullWorkout)

  // Leg Day workout
  const legWorkout = createWorkout({
    name: 'Leg Day',
    exercises: [
      { exerciseId: getExerciseId('Squat'), sets: 4 },
      { exerciseId: getExerciseId('Deadlift'), sets: 3 },
      { exerciseId: getExerciseId('Wall Sit'), sets: 3 },
    ],
  })
  await workoutAdapter.createWorkout(legWorkout)
  seededWorkouts.push(legWorkout)

  // Seed workout logs
  const seededLogs: WorkoutLog[] = []

  // Helper to create dates relative to now
  const daysAgo = (days: number): Date => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
  }

  const minutesAgo = (minutes: number): Date => {
    const date = new Date()
    date.setMinutes(date.getMinutes() - minutes)
    return date
  }

  // Completed Push Day workout (2 days ago)
  const pushStartTime = daysAgo(2)
  const pushCompletedTime = new Date(pushStartTime.getTime() + 45 * 60 * 1000) // 45 minutes after start
  const pushWorkoutLog = parseWorkoutLog({
    id: crypto.randomUUID(),
    workoutId: pushWorkout.id as string,
    startedAt: pushStartTime,
    completedAt: pushCompletedTime,
    exerciseSets: [
      // Bench Press sets
      {
        exerciseId: getExerciseId('Bench Press'),
        setNumber: 1,
        weight: 135,
        time: null,
        reps: 8,
        exerciseDuration: 45,
        restDuration: 120,
        completedAt: new Date(pushStartTime.getTime() + 0.75 * 60 * 1000), // 45s after start
      },
      {
        exerciseId: getExerciseId('Bench Press'),
        setNumber: 2,
        weight: 135,
        time: null,
        reps: 8,
        exerciseDuration: 45,
        restDuration: 120,
        completedAt: new Date(pushStartTime.getTime() + 3.75 * 60 * 1000), // 3:45 after start
      },
      {
        exerciseId: getExerciseId('Bench Press'),
        setNumber: 3,
        weight: 135,
        time: null,
        reps: 7,
        exerciseDuration: 50,
        restDuration: 120,
        completedAt: new Date(pushStartTime.getTime() + 6.92 * 60 * 1000), // ~7 min after start
      },
      {
        exerciseId: getExerciseId('Bench Press'),
        setNumber: 4,
        weight: 135,
        time: null,
        reps: 7,
        exerciseDuration: 50,
        restDuration: 180,
        completedAt: new Date(pushStartTime.getTime() + 11.92 * 60 * 1000), // ~12 min after start
      },
      // Shoulder Press sets
      {
        exerciseId: getExerciseId('Shoulder Press'),
        setNumber: 1,
        weight: 95,
        time: null,
        reps: 10,
        exerciseDuration: 40,
        restDuration: 90,
        completedAt: new Date(pushStartTime.getTime() + 15.33 * 60 * 1000), // ~15 min after start
      },
      {
        exerciseId: getExerciseId('Shoulder Press'),
        setNumber: 2,
        weight: 95,
        time: null,
        reps: 10,
        exerciseDuration: 40,
        restDuration: 90,
        completedAt: new Date(pushStartTime.getTime() + 17.83 * 60 * 1000), // ~18 min after start
      },
      {
        exerciseId: getExerciseId('Shoulder Press'),
        setNumber: 3,
        weight: 95,
        time: null,
        reps: 9,
        exerciseDuration: 45,
        restDuration: 180,
        completedAt: new Date(pushStartTime.getTime() + 20.58 * 60 * 1000), // ~21 min after start
      },
      // Push-ups sets
      {
        exerciseId: getExerciseId('Push-ups'),
        setNumber: 1,
        weight: null,
        time: null,
        reps: 20,
        exerciseDuration: 60,
        restDuration: 60,
        completedAt: new Date(pushStartTime.getTime() + 24.58 * 60 * 1000), // ~25 min after start
      },
      {
        exerciseId: getExerciseId('Push-ups'),
        setNumber: 2,
        weight: null,
        time: null,
        reps: 18,
        exerciseDuration: 60,
        restDuration: 60,
        completedAt: new Date(pushStartTime.getTime() + 26.58 * 60 * 1000), // ~27 min after start
      },
      {
        exerciseId: getExerciseId('Push-ups'),
        setNumber: 3,
        weight: null,
        time: null,
        reps: 15,
        exerciseDuration: 70,
        restDuration: 0,
        completedAt: new Date(pushStartTime.getTime() + 28.58 * 60 * 1000), // ~29 min after start
      },
    ],
  })

  const completedPushLog = completeWorkoutLog(pushWorkoutLog)
  await workoutLogAdapter.createWorkoutLog(completedPushLog)
  seededLogs.push(completedPushLog)

  // Completed Pull Day workout (1 day ago)
  const pullStartTime = daysAgo(1)
  const pullCompletedTime = new Date(pullStartTime.getTime() + 50 * 60 * 1000) // 50 minutes after start
  const pullWorkoutLog = parseWorkoutLog({
    id: crypto.randomUUID(),
    workoutId: pullWorkout.id as string,
    startedAt: pullStartTime,
    completedAt: pullCompletedTime,
    exerciseSets: [
      // Deadlift sets
      {
        exerciseId: getExerciseId('Deadlift'),
        setNumber: 1,
        weight: 225,
        time: null,
        reps: 5,
        exerciseDuration: 60,
        restDuration: 180,
        completedAt: new Date(pullStartTime.getTime() + 1 * 60 * 1000), // 1 min after start
      },
      {
        exerciseId: getExerciseId('Deadlift'),
        setNumber: 2,
        weight: 225,
        time: null,
        reps: 5,
        exerciseDuration: 60,
        restDuration: 180,
        completedAt: new Date(pullStartTime.getTime() + 5 * 60 * 1000), // 5 min after start
      },
      {
        exerciseId: getExerciseId('Deadlift'),
        setNumber: 3,
        weight: 225,
        time: null,
        reps: 4,
        exerciseDuration: 65,
        restDuration: 240,
        completedAt: new Date(pullStartTime.getTime() + 10.08 * 60 * 1000), // ~10 min after start
      },
      // Barbell Row sets
      {
        exerciseId: getExerciseId('Barbell Row'),
        setNumber: 1,
        weight: 135,
        time: null,
        reps: 10,
        exerciseDuration: 50,
        restDuration: 120,
        completedAt: new Date(pullStartTime.getTime() + 15.58 * 60 * 1000), // ~16 min after start
      },
      {
        exerciseId: getExerciseId('Barbell Row'),
        setNumber: 2,
        weight: 135,
        time: null,
        reps: 10,
        exerciseDuration: 50,
        restDuration: 120,
        completedAt: new Date(pullStartTime.getTime() + 19.42 * 60 * 1000), // ~19 min after start
      },
      {
        exerciseId: getExerciseId('Barbell Row'),
        setNumber: 3,
        weight: 135,
        time: null,
        reps: 9,
        exerciseDuration: 55,
        restDuration: 120,
        completedAt: new Date(pullStartTime.getTime() + 23.25 * 60 * 1000), // ~23 min after start
      },
      {
        exerciseId: getExerciseId('Barbell Row'),
        setNumber: 4,
        weight: 135,
        time: null,
        reps: 8,
        exerciseDuration: 55,
        restDuration: 180,
        completedAt: new Date(pullStartTime.getTime() + 27.17 * 60 * 1000), // ~27 min after start
      },
      // Pull-ups sets
      {
        exerciseId: getExerciseId('Pull-ups'),
        setNumber: 1,
        weight: null,
        time: null,
        reps: 12,
        exerciseDuration: 45,
        restDuration: 90,
        completedAt: new Date(pullStartTime.getTime() + 32.42 * 60 * 1000), // ~32 min after start
      },
      {
        exerciseId: getExerciseId('Pull-ups'),
        setNumber: 2,
        weight: null,
        time: null,
        reps: 10,
        exerciseDuration: 50,
        restDuration: 90,
        completedAt: new Date(pullStartTime.getTime() + 35.08 * 60 * 1000), // ~35 min after start
      },
      {
        exerciseId: getExerciseId('Pull-ups'),
        setNumber: 3,
        weight: null,
        time: null,
        reps: 8,
        exerciseDuration: 55,
        restDuration: 0,
        completedAt: new Date(pullStartTime.getTime() + 37.58 * 60 * 1000), // ~38 min after start
      },
    ],
  })

  const completedPullLog = completeWorkoutLog(pullWorkoutLog)
  await workoutLogAdapter.createWorkoutLog(completedPullLog)
  seededLogs.push(completedPullLog)

  // Completed Leg Day workout (today, completed recently)
  const legStartTime = minutesAgo(60)
  const legCompletedTime = minutesAgo(5)
  const legWorkoutLog = parseWorkoutLog({
    id: crypto.randomUUID(),
    workoutId: legWorkout.id as string,
    startedAt: legStartTime,
    completedAt: legCompletedTime,
    exerciseSets: [
      // Squat sets
      {
        exerciseId: getExerciseId('Squat'),
        setNumber: 1,
        weight: 185,
        time: null,
        reps: 8,
        exerciseDuration: 55,
        restDuration: 120,
        completedAt: new Date(legStartTime.getTime() + 0.92 * 60 * 1000), // ~1 min after start
      },
      {
        exerciseId: getExerciseId('Squat'),
        setNumber: 2,
        weight: 185,
        time: null,
        reps: 8,
        exerciseDuration: 55,
        restDuration: 120,
        completedAt: new Date(legStartTime.getTime() + 3.92 * 60 * 1000), // ~4 min after start
      },
      {
        exerciseId: getExerciseId('Squat'),
        setNumber: 3,
        weight: 185,
        time: null,
        reps: 7,
        exerciseDuration: 60,
        restDuration: 120,
        completedAt: new Date(legStartTime.getTime() + 6.92 * 60 * 1000), // ~7 min after start
      },
      {
        exerciseId: getExerciseId('Squat'),
        setNumber: 4,
        weight: 185,
        time: null,
        reps: 6,
        exerciseDuration: 65,
        restDuration: 180,
        completedAt: new Date(legStartTime.getTime() + 10.08 * 60 * 1000), // ~10 min after start
      },
      // Deadlift sets
      {
        exerciseId: getExerciseId('Deadlift'),
        setNumber: 1,
        weight: 205,
        time: null,
        reps: 5,
        exerciseDuration: 60,
        restDuration: 180,
        completedAt: new Date(legStartTime.getTime() + 14.08 * 60 * 1000), // ~14 min after start
      },
      {
        exerciseId: getExerciseId('Deadlift'),
        setNumber: 2,
        weight: 205,
        time: null,
        reps: 5,
        exerciseDuration: 60,
        restDuration: 180,
        completedAt: new Date(legStartTime.getTime() + 18.08 * 60 * 1000), // ~18 min after start
      },
      {
        exerciseId: getExerciseId('Deadlift'),
        setNumber: 3,
        weight: 205,
        time: null,
        reps: 4,
        exerciseDuration: 65,
        restDuration: 240,
        completedAt: new Date(legStartTime.getTime() + 22.17 * 60 * 1000), // ~22 min after start
      },
      // Wall Sit sets
      {
        exerciseId: getExerciseId('Wall Sit'),
        setNumber: 1,
        weight: null,
        time: 60,
        reps: null,
        exerciseDuration: 60,
        restDuration: 60,
        completedAt: new Date(legStartTime.getTime() + 27.42 * 60 * 1000), // ~27 min after start
      },
      {
        exerciseId: getExerciseId('Wall Sit'),
        setNumber: 2,
        weight: null,
        time: 60,
        reps: null,
        exerciseDuration: 60,
        restDuration: 60,
        completedAt: new Date(legStartTime.getTime() + 29.42 * 60 * 1000), // ~29 min after start
      },
      {
        exerciseId: getExerciseId('Wall Sit'),
        setNumber: 3,
        weight: null,
        time: 45,
        reps: null,
        exerciseDuration: 45,
        restDuration: 0,
        completedAt: new Date(legStartTime.getTime() + 31.25 * 60 * 1000), // ~31 min after start
      },
    ],
  })

  const completedLegLog = completeWorkoutLog(legWorkoutLog)
  await workoutLogAdapter.createWorkoutLog(completedLegLog)
  seededLogs.push(completedLegLog)

  return {
    exercises: seededExercises.length,
    workouts: seededWorkouts.length,
    workoutLogs: seededLogs.length,
    message: `Successfully seeded ${seededExercises.length} exercises, ${seededWorkouts.length} workouts, and ${seededLogs.length} workout logs.`,
  }
}

/**
 * Clear all data from localStorage
 *
 * @returns Summary of cleared data
 */
export async function clearData(): Promise<ClearDataResult> {
  const exerciseAdapter = new LocalStorageExerciseAdapter()
  const workoutAdapter = new LocalStorageWorkoutAdapter()
  const workoutLogAdapter = new LocalStorageWorkoutLogAdapter()

  // Get counts before clearing
  const exercises = await exerciseAdapter.getAllExercises()
  const workouts = await workoutAdapter.getAllWorkouts()
  const workoutLogs = await workoutLogAdapter.getAllWorkoutLogs()

  const exerciseCount = exercises.length
  const workoutCount = workouts.length
  const workoutLogCount = workoutLogs.length

  // Clear localStorage keys
  localStorage.removeItem('exercises')
  localStorage.removeItem('workouts')
  localStorage.removeItem('workoutLogs')

  return {
    message: `Successfully cleared ${exerciseCount} exercises, ${workoutCount} workouts, and ${workoutLogCount} workout logs.`,
  }
}
