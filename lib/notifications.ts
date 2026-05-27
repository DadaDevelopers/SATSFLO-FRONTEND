import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { api } from "./api";

/**
 * Request notification permission and register the FCM device token with the backend.
 * Uses @react-native-firebase/messaging directly — no expo-notifications needed.
 */
export async function registerForPushNotifications(authToken: string): Promise<void> {
  if (!Device.isDevice) return; // Push not supported on simulators/emulators

  const authStatus = await messaging().requestPermission();
  const allowed =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (!allowed) return;

  const fcmToken = await messaging().getToken();
  if (!fcmToken) return;

  try {
    await api.post(
      "/users/device-token",
      { token: fcmToken, platform: Platform.OS },
      authToken
    );
  } catch {
    // Best-effort — silently fail
  }
}

/**
 * Set up listeners for:
 * - Foreground FCM messages → calls onForegroundMessage (app shows its own UI)
 * - Background/quit notification tap → calls onTap
 * - FCM token refresh → re-registers with backend
 *
 * Returns a cleanup function. Call it on unmount.
 */
export function setupNotificationListeners(
  onForegroundMessage: (title: string, body: string) => void,
  onTap: () => void
): () => void {
  // Foreground: FCM message received — Firebase does NOT auto-display these
  const unsubForeground = messaging().onMessage(async (msg) => {
    const title = msg.notification?.title ?? "SatsFlo";
    const body = msg.notification?.body ?? "";
    onForegroundMessage(title, body);
  });

  // Background: user tapped a notification → app comes to foreground
  const unsubTap = messaging().onNotificationOpenedApp(() => onTap());

  // Token rotated by FCM → re-register with backend
  const unsubRefresh = messaging().onTokenRefresh(async (newToken) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) return;
    try {
      await api.post(
        "/users/device-token",
        { token: newToken, platform: Platform.OS },
        token
      );
    } catch {}
  });

  return () => {
    unsubForeground();
    unsubTap();
    unsubRefresh();
  };
}

/**
 * Check if the app was opened by tapping a notification (killed state).
 * Returns true if so.
 */
export async function checkInitialNotification(): Promise<boolean> {
  const msg = await messaging().getInitialNotification();
  return !!msg;
}
