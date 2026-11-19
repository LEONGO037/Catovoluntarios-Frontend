import { createContext } from 'react';
import type { User, AuthState } from '../../../types/auth.types';
import type { LoginCredentials } from '../../../services/auth.service';

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUserDirectly: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
