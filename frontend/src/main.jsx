import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LadybugFarmSystem from './home.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LadybugFarmSystem />
  </StrictMode>,
)
