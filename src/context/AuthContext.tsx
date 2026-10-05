import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  id?: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkSession = async (): Promise<boolean> => {
    try {
      const storedToken = sessionStorage.getItem('cms_bearer_token');
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
      }

      const res = await fetch('/api/auth/session', {
        headers,
        credentials: 'include'
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      const data = await res.json();

      if (data && data.authenticated && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        sessionStorage.removeItem('cms_bearer_token');
        return false;
      }
    } catch (err) {
      console.error('[Auth] Session check failed:', err);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        const snippet = text.slice(0, 120).trim();
        return {
          success: false,
          error: res.status === 404
            ? 'Authentication service route not found (404). Please verify deployment API configuration.'
            : `Authentication service returned unexpected response (${res.status}): ${snippet}`
        };
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || data.message || 'Incorrect email/username or password. Access denied.'
        };
      }

      if (data.token) {
        sessionStorage.setItem('cms_bearer_token', data.token);
      }

      setIsAuthenticated(true);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error occurred during sign in.' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const storedToken = sessionStorage.getItem('cms_bearer_token');
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
      }

      await fetch('/api/auth/logout', {
        method: 'POST',
        headers,
        credentials: 'include'
      });
    } catch (err) {
      console.warn('[Auth] Logout request error:', err);
    } finally {
      sessionStorage.removeItem('cms_bearer_token');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
        checkSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
