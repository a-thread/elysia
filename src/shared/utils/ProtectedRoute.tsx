import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "@shared/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();

  const isOnSignInPage = window.location.hash === '#/sign-in';
  console.log('isOnSignInPage', isOnSignInPage);
  console.log('window.location.hash', window.location.hash);
  if (user) {
    return isOnSignInPage ? <Navigate to="/" /> : <>{children}</>;
  } else {
    return isOnSignInPage ? <>{children}</> : <Navigate to="/sign-in" />;
  }
}

export default ProtectedRoute;
