import apiClient from '@/lib/api-client';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export interface CycleProfile {
  cycle_length: number;
  period_length: number;
  last_period_date: string;  // YYYY-MM-DD
  updated_at: string;
}

export interface CycleProfileWithPredictions extends CycleProfile {
  current_phase: CyclePhase;
  days_until_next_period: number;
  predicted_next_period: string;  // YYYY-MM-DD
  fertile_window_start: string;
  fertile_window_end: string;
}

export interface UpsertCycleProfileBody {
  cycle_length: number;
  period_length: number;
  last_period_date: string;  // YYYY-MM-DD
}

export const cycleProfileService = {
  async get(): Promise<CycleProfileWithPredictions> {
    const { data } = await apiClient.get('/cycle-profile');
    return data;
  },

  async upsert(body: UpsertCycleProfileBody): Promise<CycleProfile> {
    const { data } = await apiClient.post('/cycle-profile', body);
    return data;
  },
};
