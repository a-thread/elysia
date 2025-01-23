import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from '@shared/components/Toast/ToastManager.tsx'
import { DarkModeProvider } from './components/DarkModeContext.tsx'
import { AuthProvider } from './modules/auth/AuthContext.tsx'

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
