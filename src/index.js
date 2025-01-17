import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DarkModeProvider } from './shared/contexts/DarkModeContext';
import { AuthProvider } from './shared/contexts/AuthContext';
import { ToastProvider } from './shared/services/toastManager';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <DarkModeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </DarkModeProvider>
    </AuthProvider>
  </React.StrictMode>
);
