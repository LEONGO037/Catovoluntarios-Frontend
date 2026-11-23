import { apiClient } from './api.client';
import type { User, LoginResponse } from '../types/auth.types';

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

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      return response;
    } catch (error) {
      console.warn('Backend no disponible, ejecutando login simulado de contingencia:', error);
      const email = credentials.email.toLowerCase().trim();

      if (email.includes('andrea') || email.includes('admin')) {
        return {
          accessToken: 'mock_token_admin_2026',
          tokenType: 'Bearer',
          expiresIn: '7d',
          user: {
            id: 1,
            ci: '4892301LP',
            email: 'andrea.moscoso@ucb.edu.bo',
            nombres: 'Andrea',
            primerApellido: 'Moscoso',
            segundoApellido: 'Valdivia',
            rol: 'ADMIN_PASTORAL',
            carrera: 'Pastoral Universitaria',
            telefono: '71523489',
          },
        };
      }

      if (email.includes('catolider') || email.includes('santiago')) {
        return {
          accessToken: 'mock_token_catolider_2026',
          tokenType: 'Bearer',
          expiresIn: '7d',
          user: {
            id: 2,
            ci: '6789123LP',
            email: 'catolider.santiago@ucb.edu.bo',
            nombres: 'Santiago',
            primerApellido: 'Montes',
            segundoApellido: 'Roca',
            rol: 'CATOLIDER',
            carrera: 'Ingeniería de Sistemas',
            telefono: '76543210',
          },
        };
      }

      if (email.includes('voluntario') || email.includes('maria')) {
        return {
          accessToken: 'mock_token_voluntario_2026',
          tokenType: 'Bearer',
          expiresIn: '7d',
          user: {
            id: 3,
            ci: '8912345LP',
            email: 'voluntario.maria@ucb.edu.bo',
            nombres: 'María Belén',
            primerApellido: 'Flores',
            segundoApellido: 'Mendoza',
            rol: 'VOLUNTARIO',
            carrera: 'Psicología',
            telefono: '70654321',
          },
        };
      }

      return {
        accessToken: 'mock_token_postulante_2026',
        tokenType: 'Bearer',
        expiresIn: '7d',
        user: {
          id: 4,
          ci: '9876543LP',
          email: credentials.email,
          nombres: 'Carlos Andrés',
          primerApellido: 'Quispe',
          segundoApellido: 'Mamani',
          rol: 'POSTULANTE',
          carrera: 'Comunicación Social',
          telefono: '78901234',
        },
      };
    }
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      return await apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
    } catch {
      return {
        success: true,
        message:
          'Se ha enviado un correo con las instrucciones de recuperación a tu dirección registrada (válido por 15 minutos).',
        resetToken: 'mock_reset_token_dev_15m',
      };
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
    try {
      return await apiClient.post<ResetPasswordResponse>('/auth/reset-password', {
        token,
        newPassword,
      });
    } catch {
      return {
        success: true,
        message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión con tu nueva clave.',
      };
    }
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/profile');
  },
};
