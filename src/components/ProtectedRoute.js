import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return window.location.pathname === '/elysia/sign-in' ? <Navigate to="/" /> : children;
  } else {
    return window.location.pathname === '/elysia/sign-in' ? children : <Navigate to="/sign-in" />;
  }
}

export default ProtectedRoute;
