import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from '@shared/components/Toast/ToastManager.tsx'
import { DarkModeProvider } from './shared/contexts/DarkModeContext.tsx'
import { AuthProvider } from './shared/contexts/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
        <DarkModeProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </DarkModeProvider>
      </AuthProvider>
  </StrictMode>,
)
