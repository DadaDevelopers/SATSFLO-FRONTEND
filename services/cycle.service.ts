import apiClient from '@/lib/api-client';

export type FlowIntensity = 'light' | 'medium' | 'heavy' | 'spotting';

export interface CycleLog {
  id: string;
  log_date: string;
  flow_intensity: FlowIntensity | null;
  symptoms: string[];
  moods: string[];
  notes: string | null;
  temperature: number | null;
  cervical_mucus: string | null;
}

export interface Cycle {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string | null;
  cycle_length: number | null;
  flow_intensity: FlowIntensity | null;
  notes: string | null;
  created_at: string;
}

export interface CurrentCycle extends Cycle {
  current_day: number;
  phase: string;
  logs: CycleLog[];
}

export interface CycleAnalytics {
  average_cycle_length: number;
  average_period_length: number;
  total_cycles: number;
  shortest_cycle: number;
  longest_cycle: number;
  regularity_score: number;
}

export interface CycleHistoryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export const cycleService = {
  async startCycle(body: {
    start_date: string;
    flow_intensity?: FlowIntensity;
    notes?: string;
  }): Promise<Cycle> {
    const { data } = await apiClient.post('/cycles/start', body);
    return data;
  },

  async endCycle(id: string, end_date: string): Promise<Cycle> {
    const { data } = await apiClient.put(`/cycles/${id}/end`, { end_date });
    return data;
  },

  async getCurrent(): Promise<CurrentCycle> {
    const { data } = await apiClient.get('/cycles/current');
    return data;
  },

  async getHistory(params?: CycleHistoryParams): Promise<{
    cycles: Cycle[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { data } = await apiClient.get('/cycles', { params });
    return data;
  },

  async getById(id: string): Promise<Cycle> {
    const { data } = await apiClient.get(`/cycles/${id}`);
    return data;
  },

  async update(id: string, body: Partial<Pick<Cycle, 'flow_intensity' | 'notes' | 'start_date' | 'end_date'>>): Promise<Cycle> {
    const { data } = await apiClient.put(`/cycles/${id}`, body);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/cycles/${id}`);
  },

  async addLog(cycleId: string, body: {
    log_date: string;
    flow_intensity?: FlowIntensity;
    symptoms?: string[];
    moods?: string[];
    notes?: string;
    temperature?: number;
    cervical_mucus?: string;
  }): Promise<CycleLog> {
    const { data } = await apiClient.post(`/cycles/${cycleId}/logs`, body);
    return data;
  },

  async getAnalytics(params?: { startDate?: string; endDate?: string }): Promise<CycleAnalytics> {
    const { data } = await apiClient.get('/cycles/analytics', { params });
    return data;
  },
};
