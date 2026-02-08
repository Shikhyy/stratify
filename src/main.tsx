import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TamboWrapper } from './providers/TamboWrapper.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TamboWrapper>
      <App />
    </TamboWrapper>
  </StrictMode>,
)
