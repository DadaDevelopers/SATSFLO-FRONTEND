<<<<<<< HEAD
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
=======
import * as Device from "expo-device";
import { isRunningInExpoGo } from "expo";
import { Platform } from "react-native";
import { api } from "./api";
import type * as NotificationsType from "expo-notifications";

const EAS_PROJECT_ID = "53d8d698-98b5-4f29-bd65-a353d1de0e5d";

// expo-notifications requires a custom dev build in SDK 53+.
// Skip entirely in Expo Go — loading it throws a console.error even inside
// try/catch because the module calls console.error before throwing.
function loadN(): typeof NotificationsType | null {
  if (isRunningInExpoGo()) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("expo-notifications");
  } catch {
    return null;
  }
}

const N = loadN();

try {
  N?.setNotificationHandler?.({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
} catch {}

export async function registerForPushNotifications(authToken: string): Promise<void> {
  if (!N || !Device.isDevice) return;

  try {
    const { status: existingStatus } = await N.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await N.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") return;

    if (Platform.OS === "android") {
      await N.setNotificationChannelAsync("default", {
        name: "default",
        importance: N.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const token = await N.getExpoPushTokenAsync({ projectId: EAS_PROJECT_ID });
    await api.post(
      "/users/device-token",
      { token: token.data, platform: Platform.OS },
      authToken
    );
  } catch {
    // Silently fail — push not available in this environment
  }
}

>>>>>>> origin/devbranch
export function setupNotificationListeners(
  onForegroundMessage: (title: string, body: string) => void,
  onTap: () => void
): () => void {
<<<<<<< HEAD
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
=======
  if (!N) return () => {};

  try {
    const foregroundSub = N.addNotificationReceivedListener((notification) => {
      const title = notification.request.content.title ?? "SatsFlo";
      const body = notification.request.content.body ?? "";
      onForegroundMessage(title, body);
    });

    const tapSub = N.addNotificationResponseReceivedListener(() => onTap());

    return () => {
      foregroundSub.remove();
      tapSub.remove();
    };
  } catch {
    return () => {};
  }
}

export async function checkInitialNotification(): Promise<boolean> {
  if (!N) return false;
  try {
    // @ts-ignore — no-arg overload deprecated in SDK 54; still functional
    const response = await N.getLastNotificationResponseAsync();
    return !!response;
  } catch {
    return false;
  }
>>>>>>> origin/devbranch
}
