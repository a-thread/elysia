import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../shared/services/supabase';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      } else {
        setSession(data.session);
      }
      setLoading(false);
    };
    getSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return session ? children : <Navigate to="/auth" />;
}

export default ProtectedRoute;
