export type UserRole =
  | 'ADMIN_PASTORAL'
  | 'CATOLIDER'
  | 'VOLUNTARIO'
  | 'POSTULANTE'
  | 'INTERESADO';

export interface User {
  id: number;
  ci: string;
  email: string;
  nombres: string;
  primerApellido: string;
  segundoApellido?: string;
  rol: UserRole;
  carrera?: string;
  telefono?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: User;
}
