import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Apply stored theme class or default to dark on visit
try {
  const saved = localStorage.getItem('sb_theme');
  const theme = saved ? JSON.parse(saved) : 'dark';
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(theme === 'light' ? 'light' : 'dark');
} catch {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
