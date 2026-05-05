import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://satsflo-backend.onrender.com/api/v1";

// Paths that must never trigger a token refresh (they ARE the auth endpoints)
const NO_REFRESH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/forgot-password", "/auth/verify-otp"];

async function doFetch(
  method: string,
  path: string,
  body?: Record<string, unknown>,
  token?: string,
): Promise<{ response: Response; data: any }> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  return { response, data };
}

async function withTokenRefresh(
  method: string,
  path: string,
  body?: Record<string, unknown>,
  token?: string,
): Promise<{ response: Response; data: any }> {
  const result = await doFetch(method, path, body, token);

  // If not a 401 or this path should never refresh, return as-is
  if (result.response.status !== 401 || NO_REFRESH_PATHS.some((p) => path.startsWith(p))) {
    return result;
  }

  // Access token expired — try to refresh
  const newToken = await refreshTokens();
  if (!newToken) {
    // Refresh failed (refresh token also expired) — return original 401
    return result;
  }

  // Retry the original request with the new token
  return doFetch(method, path, body, newToken);
}

export const api = {
  post: (path: string, body: Record<string, unknown>, token?: string) =>
    withTokenRefresh("POST", path, body, token),

  put: (path: string, body: Record<string, unknown>, token?: string) =>
    withTokenRefresh("PUT", path, body, token),

  get: (path: string, token?: string) =>
    withTokenRefresh("GET", path, undefined, token),

  delete: (path: string, body?: Record<string, unknown>, token?: string) =>
    withTokenRefresh("DELETE", path, body, token),
};

export const clearAuthStorage = async () => {
  await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
};

export const refreshTokens = async (): Promise<string | null> => {
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  if (!refreshToken) return null;
  try {
    const { response, data } = await doFetch("POST", "/auth/refresh", { refreshToken });
    if (response.ok) {
      const newAccessToken = data?.data?.accessToken ?? data?.accessToken;
      const newRefreshToken = data?.data?.refreshToken ?? data?.refreshToken;
      if (newAccessToken) await AsyncStorage.setItem("accessToken", newAccessToken);
      if (newRefreshToken) await AsyncStorage.setItem("refreshToken", newRefreshToken);
      return newAccessToken ?? null;
    }
  } catch {}
  return null;
};
