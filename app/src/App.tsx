import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Layout } from '@zen-design/ui'
import { StartPage } from './pages/StartPage'
import { AboutPage } from './pages/AboutPage'

interface RouteConfig {
  path: string
  name: string
  component: React.ComponentType
}

const routes: RouteConfig[] = [
  { path: '/', name: 'Home', component: StartPage },
  { path: '/about', name: 'About', component: AboutPage },
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
        <Layout.Navbar icon="barbell" title="Zen Design" titleTo="/">
          {routes.map((route) => (
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
