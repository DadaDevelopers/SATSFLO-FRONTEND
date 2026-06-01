import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { api } from "./api";

const EAS_PROJECT_ID = "53d8d698-98b5-4f29-bd65-a353d1de0e5d";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications(authToken: string): Promise<void> {
  if (!Device.isDevice) return;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId: EAS_PROJECT_ID });

  try {
    await api.post(
      "/users/device-token",
      { token: token.data, platform: Platform.OS },
      authToken
    );
  } catch {
    // Best-effort — silently fail
  }
}

export function setupNotificationListeners(
  onForegroundMessage: (title: string, body: string) => void,
  onTap: () => void
): () => void {
  const foregroundSub = Notifications.addNotificationReceivedListener((notification) => {
    const title = notification.request.content.title ?? "SatsFlo";
    const body = notification.request.content.body ?? "";
    onForegroundMessage(title, body);
  });

  const tapSub = Notifications.addNotificationResponseReceivedListener(() => {
    onTap();
  });

  return () => {
    foregroundSub.remove();
    tapSub.remove();
  };
}

export async function checkInitialNotification(): Promise<boolean> {
  const response = await Notifications.getLastNotificationResponseAsync();
  return !!response;
}
