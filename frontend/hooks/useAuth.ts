import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Read from localStorage on mount
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === 'admin' || parsedUser.role === 'authority');
      } catch (e) {
        // Invalid user JSON
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);

    // Listen for custom event for cross-component sync
    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem('user');
      if (updatedUser) {
        const parsed = JSON.parse(updatedUser);
        setUser(parsed);
        setIsAdmin(parsed.role === 'admin' || parsed.role === 'authority');
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const signOut = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    setUser(null);
    setIsAdmin(false);
  };

  return { user, loading, isAdmin, signOut };
}
