const BASE_URL = "https://satsflo-backend.onrender.com/api/v1";

export const api = {
  post: async (path: string, body: Record<string, unknown>) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
};
