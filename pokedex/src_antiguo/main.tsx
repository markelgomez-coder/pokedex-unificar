import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/css-initializer/reset.css'
import './css/css-initializer/reboot.css'
import './css/css-initializer/normalize.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
