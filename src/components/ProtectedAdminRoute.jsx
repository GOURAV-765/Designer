import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase, isUsingPlaceholder } from '../supabaseClient';

export default function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (isUsingPlaceholder) {
      const mockSession = localStorage.getItem('mock-session');
      setSession(mockSession ? { user: { email: 'admin@example.com' } } : null);
      setLoading(false);
      return;
    }

    // Retrieve initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Subscribe to authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0f19] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <p className="font-heading font-medium tracking-wide text-cyan-500">Checking auth session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
