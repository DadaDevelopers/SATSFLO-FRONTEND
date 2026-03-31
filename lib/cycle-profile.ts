import { api } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Upsert cycle profile: tries PUT first; if the server says no profile exists
 * (404 or a "not found" message) it falls back to POST with safe defaults for
 * any fields not supplied by the caller.
 */
export async function upsertCycleProfile(
  fields: Partial<{
    cycle_length: number;
    period_length: number;
    last_period_start: string;
    luteal_phase_length: number;
    ignore_irregular_cycle: boolean;
  }>
): Promise<{ ok: boolean; message: string }> {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) return { ok: false, message: "Not logged in. Please sign in again." };

  // --- attempt PUT ---
  try {
    const { response, data } = await api.put("/cycle-profile", fields, token);

    // If PUT succeeded, we're done.
    if (response.ok) return { ok: true, message: "Saved successfully." };

    const serverMsg: string = data?.message || data?.error || "";
    const isNotFound =
      response.status === 404 ||
      serverMsg.toLowerCase().includes("not found") ||
      serverMsg.toLowerCase().includes("no cycle profile");

    // Any other PUT error — surface it directly.
    if (!isNotFound) return { ok: false, message: serverMsg || "Failed to save. Please try again." };
  } catch {
    return { ok: false, message: "Network error. Please check your connection." };
  }

  // --- fallback: fetch existing profile for defaults, then POST ---
  let existingProfile: Record<string, unknown> = {};
  try {
    const { response: getRes, data: getData } = await api.get("/cycle-profile", token);
    if (getRes.ok) existingProfile = getData?.data ?? getData ?? {};
  } catch {}

  const today = new Date().toISOString().split("T")[0];

  const body = {
    cycle_length: Number(existingProfile.cycle_length) || 28,
    period_length: Number(existingProfile.period_length) || 5,
    last_period_start: (existingProfile.last_period_start as string) || today,
    luteal_phase_length: Number(existingProfile.luteal_phase_length) || 14,
    ignore_irregular_cycle:
      existingProfile.ignore_irregular_cycle !== undefined
        ? Boolean(existingProfile.ignore_irregular_cycle)
        : false,
    // Caller's fields override any defaults.
    ...fields,
  };

  try {
    const { response, data } = await api.post("/cycle-profile", body, token);
    if (response.ok) return { ok: true, message: "Saved successfully." };
    const msg = data?.message || data?.error || "Failed to save. Please try again.";
    return { ok: false, message: msg };
  } catch {
    return { ok: false, message: "Network error. Please check your connection." };
  }
}
