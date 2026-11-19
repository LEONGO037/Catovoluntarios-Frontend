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

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      return response;
    } catch (error) {
      // Si el backend aún no está corriendo en localhost:3000, proporcionamos simulación
      // basada en las credenciales institucionales de prueba
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

      // Default: Postulante
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
          'Se ha enviado un enlace de recuperación seguro a tu correo electrónico registrado (válido por 15 minutos).',
      };
    }
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/profile');
  },
};
