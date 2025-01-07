import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ModalManager } from './shared/components/modalManager';
import { DarkModeProvider } from './shared/services/DarkModeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <ModalManager>
        <App />
      </ModalManager>
    </DarkModeProvider>
  </React.StrictMode>
);
