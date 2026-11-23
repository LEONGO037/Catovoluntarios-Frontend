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
    return await apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return await apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
    return await apiClient.post<ResetPasswordResponse>('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  async getProfile(): Promise<User> {
    return await apiClient.get<User>('/auth/profile');
  },
};
