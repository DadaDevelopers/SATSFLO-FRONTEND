import * as Device from "expo-device";
import { Platform } from "react-native";
import { api } from "./api";
// Type-only import — erased at compile time, zero runtime cost
import type * as NotificationsType from "expo-notifications";

const EAS_PROJECT_ID = "53d8d698-98b5-4f29-bd65-a353d1de0e5d";

// expo-notifications requires a custom dev build in SDK 54+ and won't load in
// Expo Go. Use require() inside a guard so a missing native module never
// crashes the app at startup — all functions fall back to no-ops.
function loadN(): typeof NotificationsType | null {
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

export function setupNotificationListeners(
  onForegroundMessage: (title: string, body: string) => void,
  onTap: () => void
): () => void {
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
}
