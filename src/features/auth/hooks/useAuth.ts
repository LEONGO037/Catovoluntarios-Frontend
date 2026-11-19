import { useContext } from 'react';
import type { AuthContextType } from '../context/auth-context-def';
import { AuthContext } from '../context/auth-context-def';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
