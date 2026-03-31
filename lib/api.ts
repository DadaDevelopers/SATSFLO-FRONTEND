import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://satsflo-backend.onrender.com/api/v1";

export const api = {
  post: async (path: string, body: Record<string, unknown>, token?: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return { response, data };
  },

  put: async (path: string, body: Record<string, unknown>, token?: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return { response, data };
  },

  get: async (path: string, token?: string) => {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${BASE_URL}${path}`, { headers });
    const data = await response.json();
    return { response, data };
  },

  delete: async (
    path: string,
    body?: Record<string, unknown>,
    token?: string,
  ) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    return { response, data };
  },
};

export const clearAuthStorage = async () => {
  await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
};

export const refreshTokens = async (): Promise<string | null> => {
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  if (!refreshToken) return null;
  try {
    const { response, data } = await api.post("/auth/refresh", {
      refreshToken,
    });
    if (response.ok) {
      const newAccessToken = data?.data?.accessToken ?? data?.accessToken;
      const newRefreshToken = data?.data?.refreshToken ?? data?.refreshToken;
      if (newAccessToken) {
        await AsyncStorage.setItem("accessToken", newAccessToken);
      }
      if (newRefreshToken) {
        await AsyncStorage.setItem("refreshToken", newRefreshToken);
      }
      return newAccessToken ?? null;
    }
  } catch {}
  return null;
};
