import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { seedData, clearData } from './utils/seedData'

// Expose utility functions to window for console access during development
if (typeof window !== 'undefined') {
  ;(window as any).seedData = seedData
  ;(window as any).clearData = clearData
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
