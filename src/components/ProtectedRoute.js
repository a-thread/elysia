import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/services/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return window.location.pathname === '/auth' ? <Navigate to="/" /> : children;
  } else {
    return <Navigate to="/auth" />;
  }
}

export default ProtectedRoute;
