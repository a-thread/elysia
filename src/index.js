import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ModalManager } from './shared/components/modalManager';
import { DarkModeProvider } from './shared/services/DarkModeContext';
import { AuthProvider } from './shared/services/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <DarkModeProvider>
        <ModalManager>
          <App />
        </ModalManager>
      </DarkModeProvider>
    </AuthProvider>
  </React.StrictMode>
);
