# Creating the Initial Layout for a New Application

This guide walks you through setting up the initial layout structure for a new application using the Zen Design Layout component with React Router.

## Prerequisites

Ensure you have the following dependencies installed:

- `react-router-dom` (v6.x)
- `@zen-design/ui` (Layout component and related UI components)

## Step-by-Step Guide

### 1. Define Your Application Structure

Before implementing the layout, identify:

- **Application Purpose**: What is the main purpose of your application?
- **Logo/Icon**: Choose an icon from the available Phosphor icons (see "Finding Icons" below)
- **Application Name**: The title to display in the navbar
- **Routes**: List all main routes (excluding potential sub-routes)

### 2. Finding Icons

The Layout component uses icons from the Phosphor icon library. To find available icons:

1. **Browse Available Icons**: Check the Icon component documentation or browse [phosphoricons.com](https://phosphoricons.com/)
2. **Check Supported Icons**: Verify the icon is supported by checking `lib/ui/src/components/Icon/Icon.tsx`
   - Look for the icon in the `IconName` type
   - Icons use kebab-case naming (e.g., `barbell`, `arrow-left`, `check-circle`)
3. **Common Available Icons**: `barbell`, `list`, `x`, `arrow-left`, `arrow-right`, `user`, `gear`, `envelope`, `bell`, `check`, `search`, and more

If you need a new icon, you'll need to add it to the Icon component first (see the Icon component documentation for details).

### 3. Set Up React Router

Import React Router components in your `App.tsx`:

```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
```

### 4. Import Layout Components

Import the Layout component:

```tsx
import { Layout } from '@zen-design/ui'
```

### 5. Create Menu State

The Layout component supports a mobile menu that can be toggled. Create state to manage the menu. This state will be passed to the `Layout` root component:

```tsx
const [isMenuOpen, setIsMenuOpen] = useState(false)
```

### 6. Structure Your App Component

Wrap your application with `BrowserRouter` and use the Layout component. Pass the menu state and toggle handler to the `Layout` root component:

```tsx
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <BrowserRouter>
      <Layout
        routerLink={Link}
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      >
        {/* Layout content */}
      </Layout>
    </BrowserRouter>
  )
}
```

**Important**:

- Pass the `Link` component from `react-router-dom` to the `routerLink` prop. This enables navigation links throughout the Layout.
- Pass `isMenuOpen` and `onMenuToggle` to the `Layout` root component. These props are available through context to all Layout sub-components.

### 7. Add the Navbar

Use `Layout.Navbar` to create the application header. The navigation items you add as children will automatically be registered and used in the mobile menu:

```tsx
<Layout.Navbar
  icon="barbell" // Icon name (IconName type)
  title="Your App Name" // Application title
  titleTo="/" // Route for home (logo/title click)
>
  {/* Desktop navigation items */}
  <Layout.NavItem to="/" name="Home" />
  <Layout.NavItem to="/about" name="About" />
</Layout.Navbar>
```

**Navbar Props:**

- `icon`: Icon name from the Icon component (optional)
- `title`: Text to display as the application name (optional)
- `titleTo`: Route path for the title/logo link (optional, makes title clickable)
- `children`: `Layout.NavItem` components for desktop navigation (visible on md+ breakpoints)

**Note**:

- The logo/title will link to the home route when `titleTo` is provided. Desktop navigation items appear in the navbar on medium screens and larger.
- The `onMenuToggle` and `isMenuOpen` props are optional on `Layout.Navbar`. If not provided, they will fall back to the values passed to the `Layout` root component through context.
- Navigation items defined in the navbar are automatically registered and will appear in the mobile menu when it's open.

### 8. Add the Container and Routes

Wrap your routes in `Layout.Container`. The container automatically handles the mobile menu - when `isMenuOpen` is true, it displays all registered navigation items. When the menu is closed, it shows your routes:

```tsx
<Layout.Container>
  <Routes>
    <Route path="/" element={<StartPage />} />
    <Route path="/about" element={<AboutPage />} />
  </Routes>
</Layout.Container>
```

**Automatic Mobile Menu:**

- `Layout.Container` automatically detects when `isMenuOpen` is `true` (from the context provided by the `Layout` root component)
- When the menu is open, it automatically displays all navigation items that were registered from `Layout.Navbar` children
- When the menu is closed, it displays your `Routes` component
- Navigation items in the mobile menu automatically close the menu when clicked
- No manual conditional rendering is needed - the container handles everything automatically

### 9. Create Your Route Pages

Create page components for each route:

```tsx
// pages/StartPage.tsx
export function StartPage() {
  return (
    <div>
      <h1>Welcome</h1>
      {/* Your page content */}
    </div>
  )
}
```

## Complete Example

Here's a complete example combining all the steps. This example uses a route configuration array pattern for cleaner, more maintainable code:

```tsx
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
```

**Benefits of the Route Configuration Pattern:**

- Single source of truth for routes - define them once in the array
- Navigation items and route definitions are automatically synchronized
- Easy to add or remove routes - just update the array
- Reduces duplication and potential inconsistencies

## Key Points

1. **Router Integration**: Always pass `Link` from `react-router-dom` to the `Layout` component's `routerLink` prop
2. **Menu State Management**: Pass `isMenuOpen` and `onMenuToggle` to the `Layout` root component. These are available through context to all Layout sub-components
3. **Automatic Mobile Menu**: `Layout.Container` automatically handles the mobile menu. When `isMenuOpen` is true, it displays all navigation items registered from `Layout.Navbar` children. No manual conditional rendering is needed
4. **Navigation Item Registration**: Navigation items defined as children of `Layout.Navbar` are automatically registered and used in both the desktop navbar and the mobile menu
5. **Navigation Items**: Use `Layout.NavItem` with the `to` prop for routing. The component automatically uses the router link when `routerLink` is provided
6. **Responsive Behavior**: Desktop navigation appears in the navbar on medium screens and larger. The mobile menu automatically appears when the hamburger button is clicked
7. **Logo/Title Link**: The navbar title becomes a clickable link to the home route when `titleTo` is provided

## Layout Component Structure

The Layout component uses a compound component pattern:

- `Layout` (root): Wraps the entire layout, accepts `routerLink`, `isMenuOpen`, and `onMenuToggle` props. Provides context to all sub-components
- `Layout.Navbar`: Creates the top navigation bar. Automatically registers navigation items from children for use in the mobile menu
- `Layout.Container`: Creates the main content area with proper spacing and max-width. Automatically handles mobile menu display when `isMenuOpen` is true
- `Layout.NavItem`: Creates navigation items that work with routing

This structure provides a responsive, accessible layout foundation for your application with automatic mobile menu handling.
