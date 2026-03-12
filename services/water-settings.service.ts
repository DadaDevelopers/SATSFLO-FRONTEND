import apiClient from '@/lib/api-client';

export interface WaterSettings {
  daily_goal_ml: number;
  cup_sizes: number[];
  updated_at: string;
}

export const waterSettingsService = {
  async get(): Promise<WaterSettings> {
    const { data } = await apiClient.get('/water-settings');
    return data;
  },

  async update(body: { daily_goal_ml?: number; cup_sizes?: number[] }): Promise<WaterSettings> {
    const { data } = await apiClient.put('/water-settings', body);
    return data;
  },
};
