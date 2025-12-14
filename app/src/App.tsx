import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Layout } from '@zen-design/ui'
import { StartPage } from './pages/StartPage'
import { ExercisesPage } from './pages/ExercisesPage'
import { CreateExercisePage } from './pages/CreateExercisePage'
import { WorkoutsPage } from './pages/WorkoutsPage'
import { CreateWorkoutPage } from './pages/CreateWorkoutPage'
import { StartWorkoutPage } from './pages/StartWorkoutPage'
import { ActiveWorkoutPage } from './pages/ActiveWorkoutPage'
import { LogSetPage } from './pages/LogSetPage'
import { RestPage } from './pages/RestPage'
import { WorkoutSummaryPage } from './pages/WorkoutSummaryPage'

interface RouteConfig {
  path: string
  name: string
  component: React.ComponentType
  showInNav?: boolean
}

const routes: RouteConfig[] = [
  { path: '/', name: 'Start', component: StartPage },
  {
    path: '/exercises',
    name: 'Exercises',
    component: ExercisesPage,
    showInNav: true,
  },
  {
    path: '/exercises/create',
    name: 'Create Exercise',
    component: CreateExercisePage,
  },
  {
    path: '/workouts',
    name: 'Workouts',
    component: WorkoutsPage,
    showInNav: true,
  },
  {
    path: '/workouts/create',
    name: 'Create Workout',
    component: CreateWorkoutPage,
  },
  {
    path: '/workouts/:id/start',
    name: 'Start Workout',
    component: StartWorkoutPage,
  },
  {
    path: '/workouts/:id/active',
    name: 'Active Workout',
    component: ActiveWorkoutPage,
  },
  {
    path: '/workouts/:id/summary',
    name: 'Workout Summary',
    component: WorkoutSummaryPage,
  },
  { path: '/workouts/:id/log-set', name: 'Log Set', component: LogSetPage },
  { path: '/workouts/:id/rest', name: 'Rest', component: RestPage },
]

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <BrowserRouter>
      <Layout
        routerLink={Link}
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Layout.Navbar icon="barbell" title="Workout Tracker" titleTo="/">
          {routes
            .filter((route) => route.showInNav)
            .map((route) => (
              <Layout.NavItem
                key={route.path}
                to={route.path}
                name={route.name}
              />
            ))}
        </Layout.Navbar>

        <Layout.Container>
          <Routes>
            {routes.map((route) => {
              const Component = route.component
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<Component />}
                />
              )
            })}
          </Routes>
        </Layout.Container>
      </Layout>
    </BrowserRouter>
  )
}

export default App
