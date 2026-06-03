import { Platform } from "react-native";

const BASE_URL = "https://satsflo-backend.onrender.com/api/v1";

function fileFromUri(uri: string, name: string) {
  return {
    uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
    type: "image/jpeg",
    name,
  } as any;
}

/**
 * Upload a single image as the user's avatar.
 * Returns the Cloudinary avatar_url on success, null on failure.
 */
export async function uploadAvatar(uri: string, token: string): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", fileFromUri(uri, "avatar.jpg"));

  try {
    const response = await fetch(`${BASE_URL}/users/profile/avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      return data?.data?.avatar_url ?? data?.avatar_url ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Upload up to 5 images for a journal entry.
 * Returns an array of Cloudinary URLs on success, empty array on failure.
 */
export async function uploadJournalImages(uris: string[], token: string): Promise<string[]> {
  const formData = new FormData();
  uris.forEach((uri, i) => {
    formData.append("files", fileFromUri(uri, `journal-${i}.jpg`));
  });

  try {
    const response = await fetch(`${BASE_URL}/journal/media`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      return data?.data?.urls ?? data?.urls ?? [];
    }
    return [];
  } catch {
    return [];
  }
}
