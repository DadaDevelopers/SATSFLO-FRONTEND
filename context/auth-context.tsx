import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authService, User } from '@/services/auth.service';
import { tokenStorage } from '@/lib/token-storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // On mount: restore session from stored token.
  // Always resolves isLoading — never hangs the splash screen.
  useEffect(() => {
    const done = () => setState((s) => ({ ...s, isLoading: false }));

    // Hard timeout: if storage/network stalls, unblock splash after 5s
    const timeout = setTimeout(() => {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }, 5000);

    (async () => {
      try {
        const accessToken = await tokenStorage.getAccessToken();
        if (accessToken) {
          const user = await authService.getMe();
          clearTimeout(timeout);
          setState({ user, isAuthenticated: true, isLoading: false });
        } else {
          clearTimeout(timeout);
          done();
        }
      } catch {
        // Stale/expired token — clear it silently
        try { await tokenStorage.clearTokens(); } catch { /* ignore */ }
        clearTimeout(timeout);
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    })();

    return () => clearTimeout(timeout);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { user, accessToken, refreshToken } = await authService.register(name, email, password);
    await tokenStorage.saveTokens(accessToken, refreshToken);
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user, accessToken, refreshToken } = await authService.login(email, password);
    await tokenStorage.saveTokens(accessToken, refreshToken);
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken) await authService.logout(refreshToken);
    } catch {
      // ignore — we still clear local state
    } finally {
      try { await tokenStorage.clearTokens(); } catch { /* ignore */ }
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const user = await authService.getMe();
    setState((s) => ({ ...s, user }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
