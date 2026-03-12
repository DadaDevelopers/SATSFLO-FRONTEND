import apiClient from '@/lib/api-client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  bio: string | null;
  date_of_birth: string | null;  // YYYY-MM-DD
  timezone: string | null;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileBody {
  name?: string;
  bio?: string;
  date_of_birth?: string;
  timezone?: string;
  avatar_url?: string;
}

export interface HealthProfile {
  blood_type: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  health_conditions: string | null;
  medications: string | null;
  notes: string | null;
  updated_at: string;
}

export interface UserPreferences {
  notifications_enabled: boolean;
  reminder_time: string | null;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await apiClient.get('/users/profile');
    return data;
  },

  async updateProfile(body: UpdateProfileBody): Promise<UserProfile> {
    const { data } = await apiClient.put('/users/profile', body);
    return data;
  },

  async getHealthProfile(): Promise<HealthProfile> {
    const { data } = await apiClient.get('/users/health-profile');
    return data;
  },

  async updateHealthProfile(body: Omit<Partial<HealthProfile>, 'updated_at'>): Promise<HealthProfile> {
    const { data } = await apiClient.put('/users/health-profile', body);
    return data;
  },

  async getPreferences(): Promise<UserPreferences> {
    const { data } = await apiClient.get('/users/preferences');
    return data;
  },

  async updatePreferences(body: Partial<UserPreferences>): Promise<UserPreferences> {
    const { data } = await apiClient.put('/users/preferences', body);
    return data;
  },

  async deleteAccount(password: string): Promise<void> {
    await apiClient.delete('/users/account', { data: { password } });
  },

  async exportData(): Promise<unknown> {
    const { data } = await apiClient.get('/users/export');
    return data;
  },
};
