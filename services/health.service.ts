import apiClient from '@/lib/api-client';

export type Severity = 1 | 2 | 3 | 4 | 5;
export type Intensity = 1 | 2 | 3 | 4 | 5;

export interface Symptom {
  id: string;
  symptom_name: string;
  severity: Severity;
  logged_at: string;
  notes: string | null;
  cycle_id: string | null;
}

export interface Mood {
  id: string;
  mood: string;
  intensity: Intensity;
  logged_at: string;
  notes: string | null;
  cycle_id: string | null;
}

export interface LogSymptomBody {
  symptom_name: string;
  severity: Severity;
  logged_at?: string;
  notes?: string;
  cycle_id?: string;
}

export interface LogMoodBody {
  mood: string;
  intensity: Intensity;
  logged_at?: string;
  notes?: string;
  cycle_id?: string;
}

export interface SymptomAnalytics {
  top_symptoms: { symptom_name: string; count: number; avg_severity: number }[];
  by_phase: {
    menstrual: { symptom_name: string; count: number }[];
    follicular: { symptom_name: string; count: number }[];
    ovulation: { symptom_name: string; count: number }[];
    luteal: { symptom_name: string; count: number }[];
  };
}

export interface MoodAnalytics {
  mood_distribution: { mood: string; count: number; avg_intensity: number }[];
  by_phase: {
    menstrual: { mood: string; count: number }[];
    follicular: { mood: string; count: number }[];
    ovulation: { mood: string; count: number }[];
    luteal: { mood: string; count: number }[];
  };
}

export interface DailySummary {
  date: string;
  symptoms: Symptom[];
  moods: Mood[];
}

export interface CycleTrends {
  symptoms_by_day: { day: number; symptoms: Symptom[] }[];
  moods_by_day: { day: number; moods: Mood[] }[];
}

export const healthService = {
  // ── Symptoms ──────────────────────────────────────────────
  async logSymptom(body: LogSymptomBody): Promise<Symptom> {
    const { data } = await apiClient.post('/health/symptoms', body);
    return data;
  },

  async logSymptomsBatch(symptoms: LogSymptomBody[]): Promise<Symptom[]> {
    const { data } = await apiClient.post('/health/symptoms/batch', { symptoms });
    return data;
  },

  async getSymptoms(params?: {
    startDate?: string;
    endDate?: string;
    symptomName?: string;
    severity?: number;
  }): Promise<Symptom[]> {
    const { data } = await apiClient.get('/health/symptoms', { params });
    return data;
  },

  async getSymptomsByDate(date: string): Promise<Symptom[]> {
    const { data } = await apiClient.get(`/health/symptoms/date/${date}`);
    return data;
  },

  async updateSymptom(id: string, body: { severity?: Severity; notes?: string }): Promise<Symptom> {
    const { data } = await apiClient.put(`/health/symptoms/${id}`, body);
    return data;
  },

  async deleteSymptom(id: string): Promise<void> {
    await apiClient.delete(`/health/symptoms/${id}`);
  },

  // ── Moods ─────────────────────────────────────────────────
  async logMood(body: LogMoodBody): Promise<Mood> {
    const { data } = await apiClient.post('/health/moods', body);
    return data;
  },

  async logMoodsBatch(moods: LogMoodBody[]): Promise<Mood[]> {
    const { data } = await apiClient.post('/health/moods/batch', { moods });
    return data;
  },

  async getMoods(params?: {
    startDate?: string;
    endDate?: string;
    mood?: string;
    intensity?: number;
  }): Promise<Mood[]> {
    const { data } = await apiClient.get('/health/moods', { params });
    return data;
  },

  async getMoodsByDate(date: string): Promise<Mood[]> {
    const { data } = await apiClient.get(`/health/moods/date/${date}`);
    return data;
  },

  async updateMood(id: string, body: { intensity?: Intensity; notes?: string }): Promise<Mood> {
    const { data } = await apiClient.put(`/health/moods/${id}`, body);
    return data;
  },

  async deleteMood(id: string): Promise<void> {
    await apiClient.delete(`/health/moods/${id}`);
  },

  // ── Analytics ─────────────────────────────────────────────
  async getSymptomAnalytics(): Promise<SymptomAnalytics> {
    const { data } = await apiClient.get('/health/analytics/symptoms');
    return data;
  },

  async getMoodAnalytics(): Promise<MoodAnalytics> {
    const { data } = await apiClient.get('/health/analytics/moods');
    return data;
  },

  // ── Summary & Trends ──────────────────────────────────────
  async getDailySummary(date: string): Promise<DailySummary> {
    const { data } = await apiClient.get(`/health/summary/${date}`);
    return data;
  },

  async getCycleTrends(cycleId: string): Promise<CycleTrends> {
    const { data } = await apiClient.get(`/health/trends/${cycleId}`);
    return data;
  },
};
