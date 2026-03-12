import { AxiosError } from 'axios';

export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors.map((e: { message: string }) => e.message).join('\n');
    }
    return data?.message ?? 'Something went wrong';
  }
  return 'Network error — check your connection';
}
