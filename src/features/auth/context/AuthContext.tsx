import React, { useState } from 'react';
import type { User, AuthState, LoginResponse } from '../../../types/auth.types';
import type { LoginCredentials } from '../../../services/auth.service';
import { authService } from '../../../services/auth.service';
import { AuthContext } from './auth-context-def';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedToken = localStorage.getItem('catovoluntarios_token');
    if (savedToken?.startsWith('local-json-token-')) {
      return { user: null, token: null, isAuthenticated: false, isLoading: false };
    }
    const savedUserStr = localStorage.getItem('catovoluntarios_user');
    let savedUser: User | null = null;
    if (savedUserStr) {
      try {
        savedUser = JSON.parse(savedUserStr);
      } catch {
        savedUser = null;
      }
    }
    return {
      user: savedUser,
      token: savedToken,
      isAuthenticated: !!savedToken && !!savedUser,
      isLoading: false,
    };
  });

  const login = async (credentials: LoginCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response: LoginResponse = await authService.login(credentials);
      localStorage.setItem('catovoluntarios_token', response.accessToken);
      localStorage.setItem('catovoluntarios_user', JSON.stringify(response.user));
      setAuthState({
        user: response.user,
        token: response.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('catovoluntarios_token');
    localStorage.removeItem('catovoluntarios_user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const setUserDirectly = (user: User) => {
    localStorage.setItem('catovoluntarios_user', JSON.stringify(user));
    setAuthState((prev) => ({
      ...prev,
      user,
      isAuthenticated: true,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        setUserDirectly,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
