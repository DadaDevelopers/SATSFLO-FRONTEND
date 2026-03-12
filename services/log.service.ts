import apiClient from '@/lib/api-client';

export interface DayLog {
  id: string;
  user_id: string;
  log_date: string;   // YYYY-MM-DD
  water_ml: number | null;
  weight_kg: number | null;
  temperature: number | null;
  notes: string | null;
  updated_at: string;
}

export interface UpsertDayLogBody {
  water_ml?: number;
  weight_kg?: number;
  temperature?: number;
  notes?: string;
}

export const logService = {
  async getByDate(date: string): Promise<DayLog | null> {
    const { data } = await apiClient.get('/logs', { params: { date } });
    return data ?? null;
  },

  async getRange(from: string, to: string): Promise<DayLog[]> {
    const { data } = await apiClient.get('/logs/range', { params: { from, to } });
    return data;
  },

  async upsert(date: string, body: UpsertDayLogBody): Promise<DayLog> {
    const { data } = await apiClient.put(`/logs/${date}`, body);
    return data;
  },
};
