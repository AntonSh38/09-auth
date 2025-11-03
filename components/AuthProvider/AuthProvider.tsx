'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, getMe } from '@/lib/api/clientApi';

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    state => state.clearIsAuthenticated
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const isAuthenticated = await checkSession();
        if (isAuthenticated) {
          const user = await getMe();
          if (user) setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  if (loading) return <p>Loading...</p>;

  return children;
}
