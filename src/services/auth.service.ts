import type { User, LoginResponse } from '../types/auth.types';
import { apiClient } from './api.client';

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
  login({ email, password }: LoginCredentials): Promise<LoginResponse> {
    return apiClient.post('/auth/login', { email: email.trim().toLowerCase(), password });
  },

  forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return apiClient.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
  },

  resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  },

  async getProfile(): Promise<User> {
    const saved = localStorage.getItem('catovoluntarios_user');
    if (saved) {
      return JSON.parse(saved) as User;
    }
    throw new Error('No hay sesión activa');
  },
};
