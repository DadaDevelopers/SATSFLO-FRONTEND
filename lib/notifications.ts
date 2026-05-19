import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { api } from "./api";

// Show notifications when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request permission and register FCM device token with the backend.
 * Safe to call multiple times — idempotent on the backend.
 */
export async function registerForPushNotifications(authToken: string): Promise<void> {
  if (!Device.isDevice) return; // Push not supported on simulators/emulators

  // Request local notification permission (required on iOS + Android 13+)
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return;

  // iOS: also request Firebase Messaging permission
  if (Platform.OS === "ios") {
    const authStatus = await messaging().requestPermission();
    const allowed =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (!allowed) return;
  }

  // Get FCM token and send to backend
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
 * - Foreground FCM messages → display as local notification
 * - Background/quit notification tap → call onTap()
 * - FCM token refresh → re-register with backend
 *
 * Returns a cleanup function. Call it on unmount.
 */
export function setupNotificationListeners(onTap: () => void): () => void {
  // Foreground: FCM message received → show local notification
  const unsubForeground = messaging().onMessage(async (msg) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: msg.notification?.title ?? "SatsFlo",
        body: msg.notification?.body ?? "",
        data: msg.data ?? {},
      },
      trigger: null, // show immediately
    });
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
