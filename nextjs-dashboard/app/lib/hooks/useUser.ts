'use client';

import { useEffect, useState } from 'react';

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
} | null;

export function useUser() {
  const [user, setUser] = useState<UserData>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (!res.ok) {
          setUser(null);
          return;
        }
        const session = await res.json();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Failed to fetch user session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}
