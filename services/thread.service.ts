import apiClient, { unwrapEnvelope } from '@/lib/api-client';
import axios from 'axios';
import { BASE_URL } from '@/lib/api-client';

export interface ThreadUser {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface ThreadComment {
  id: string;
  content: string;
  created_at: string;
  user: ThreadUser;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  user: ThreadUser;
}

export interface ThreadDetail extends Thread {
  comments: ThreadComment[];
}

export interface ThreadListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface CreateThreadBody {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  is_anonymous?: boolean;
}

export const threadService = {
  // Public — no auth needed to read
  async getThreads(params?: ThreadListParams): Promise<{
    threads: Thread[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { data } = await axios.get(`${BASE_URL}/threads`, { params });
    return unwrapEnvelope<{ threads: Thread[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(data);
  },

  async getById(id: string): Promise<ThreadDetail> {
    const { data } = await axios.get(`${BASE_URL}/threads/${id}`);
    return unwrapEnvelope<ThreadDetail>(data);
  },

  // Auth required
  async create(body: CreateThreadBody): Promise<Thread> {
    const { data } = await apiClient.post('/threads', body);
    return data;
  },

  async update(id: string, body: Partial<CreateThreadBody>): Promise<Thread> {
    const { data } = await apiClient.put(`/threads/${id}`, body);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/threads/${id}`);
  },

  // Comments
  async addComment(threadId: string, content: string, is_anonymous?: boolean): Promise<ThreadComment> {
    const { data } = await apiClient.post(`/threads/${threadId}/comments`, { content, is_anonymous });
    return data;
  },

  async updateComment(threadId: string, commentId: string, content: string): Promise<ThreadComment> {
    const { data } = await apiClient.put(`/threads/${threadId}/comments/${commentId}`, { content });
    return data;
  },

  async deleteComment(threadId: string, commentId: string): Promise<void> {
    await apiClient.delete(`/threads/${threadId}/comments/${commentId}`);
  },

  // Likes
  async like(threadId: string): Promise<void> {
    await apiClient.post(`/threads/${threadId}/like`);
  },

  async unlike(threadId: string): Promise<void> {
    await apiClient.delete(`/threads/${threadId}/like`);
  },
};
