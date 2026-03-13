import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from './token-storage';

export const BASE_URL = 'http://192.168.0.18:3000/api/v1';

/**
 * Unwrap the { success, data } envelope the backend puts on every response.
 * Works for bare axios calls (auth endpoints, public thread reads) that can't
 * go through the apiClient interceptor.
 */
export function unwrapEnvelope<T>(raw: unknown): T {
  if (raw && typeof raw === 'object' && 'success' in raw && 'data' in raw) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Request: attach access token ──────────────────────────────────────────
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response: auto-unwrap { success, data } envelope ─────────────────────
apiClient.interceptors.response.use(
  (response) => {
    if (response.data?.success && response.data?.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// ── Response: 401 → silent token refresh + retry ──────────────────────────
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(err: unknown, token: string | null) {
  refreshQueue.forEach((p) => (err ? p.reject(err) : p.resolve(token!)));
  refreshQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original: AxiosRequestConfig & { _retry?: boolean } = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
            resolve(apiClient(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const { data: raw } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
      // Unwrap envelope manually here since this is a bare axios call
      const tokens = unwrapEnvelope<{ accessToken: string; refreshToken: string }>(raw);
      await tokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken);

      processQueue(null, tokens.accessToken);
      original.headers = { ...original.headers, Authorization: `Bearer ${tokens.accessToken}` };
      return apiClient(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      try { await tokenStorage.clearTokens(); } catch { /* ignore */ }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
