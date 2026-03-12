import apiClient from '@/lib/api-client';

export interface Notification {
  id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  actor: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
}

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    const { data } = await apiClient.get('/notifications');
    return data;
  },

  async markRead(id: string): Promise<void> {
    await apiClient.put(`/notifications/${id}/read`);
  },

  async markAllRead(): Promise<void> {
    await apiClient.put('/notifications/read-all');
  },
};
