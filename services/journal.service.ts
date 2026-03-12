import apiClient from '@/lib/api-client';

export interface JournalEntry {
  id: string;
  entry_date: string;  // YYYY-MM-DD
  title: string | null;
  content: string;
  mood: string | null;
  created_at: string;
}

export interface CreateJournalEntryBody {
  entry_date: string;  // YYYY-MM-DD
  title?: string;
  content: string;
  mood?: string;
}

export const journalService = {
  async getByMonth(month: string): Promise<JournalEntry[]> {
    const { data } = await apiClient.get('/journal', { params: { month } });
    return data;
  },

  async create(body: CreateJournalEntryBody): Promise<JournalEntry> {
    const { data } = await apiClient.post('/journal', body);
    return data;
  },
};
