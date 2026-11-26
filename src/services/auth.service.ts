import type { User, LoginResponse, UserRole } from '../types/auth.types';
import mockUsersData from '../data/mockUsers.json';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

interface MockUserRecord extends User {
  password: string;
}

const mockUsers = mockUsersData as MockUserRecord[];

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const emailNorm = credentials.email.trim().toLowerCase();
    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === emailNorm && u.password === credentials.password,
    );

    if (!found) {
      throw new Error('Correo o contraseña incorrectos. Verifica tus credenciales.');
    }

    const { password: _pwd, ...userWithoutPassword } = found;
    void _pwd;

    return {
      accessToken: `local-json-token-${found.id}-${found.rol}`,
      tokenType: 'Bearer',
      expiresIn: '24h',
      user: {
        ...userWithoutPassword,
        rol: found.rol as UserRole,
      },
    };
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const exists = mockUsers.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!exists) {
      return {
        success: false,
        message: 'No se encontró una cuenta registrada con ese correo en el listado local.',
      };
    }
    return {
      success: true,
      message: 'Instrucciones de recuperación simuladas correctamente (modo local JSON).',
      resetToken: 'local-reset-token-demo',
    };
  },

  async resetPassword(_token: string, _newPassword: string): Promise<ResetPasswordResponse> {
    return {
      success: true,
      message: 'Contraseña actualizada en sesión local.',
    };
  },

  async getProfile(): Promise<User> {
    const saved = localStorage.getItem('catovoluntarios_user');
    if (saved) {
      return JSON.parse(saved) as User;
    }
    throw new Error('No hay sesión activa');
  },
};
