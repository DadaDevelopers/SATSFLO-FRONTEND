import apiClient, { unwrapEnvelope } from '@/lib/api-client';
import axios from 'axios';
import { BASE_URL } from '@/lib/api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  last_login: string | null;
  created_at?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}

export const authService = {
  async register(name: string, email: string, password: string): Promise<LoginResponse> {
    const { data } = await axios.post(`${BASE_URL}/auth/register`, { name, email, password });
    return unwrapEnvelope<LoginResponse>(data);
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    return unwrapEnvelope<LoginResponse>(data);
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/auth/logout', { refreshToken });
  },

  async logoutAll(): Promise<void> {
    await apiClient.post('/auth/logout-all');
  },

  async getMe(): Promise<User> {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  async forgotPassword(email: string): Promise<void> {
    await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
    // response body intentionally ignored
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await axios.post(`${BASE_URL}/auth/reset-password`, { token, newPassword });
    // response body intentionally ignored
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', { currentPassword, newPassword });
  },

  async resendVerification(): Promise<void> {
    await apiClient.post('/auth/resend-verification');
  },
};
