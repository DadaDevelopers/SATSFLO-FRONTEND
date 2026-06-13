import { AddLogProvider } from "@/context/add-log-context";
import { ThemeProvider } from "@/context/theme-context";
import {
  checkInitialNotification,
  setupNotificationListeners,
} from "@/lib/notifications";
import {
  Inter_400Regular,
  useFonts as useInter,
} from "@expo-google-fonts/inter";
import {
  Manrope_500Medium,
  Manrope_700Bold,
  useFonts as useManrope,
} from "@expo-google-fonts/manrope";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  useFonts as usePoppins,
} from "@expo-google-fonts/poppins";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

// Configure Google Sign-In once at app startup (no-op in Expo Go)
try {
  const { isRunningInExpoGo } = require("expo");
  if (!isRunningInExpoGo()) {
    const { GoogleSignin } = require("@react-native-google-signin/google-signin");
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true,
    });
  }
} catch {}

export default function RootLayout() {
  const [poppinsLoaded] = usePoppins({
    Poppins: Poppins_400Regular,
    "Poppins-SemiBold": Poppins_600SemiBold,
  });

  const [interLoaded] = useInter({
    Inter: Inter_400Regular,
  });

  const [manropeLoaded] = useManrope({
    Manrope_500Medium,
    Manrope_700Bold,
  });

  const [iconsLoaded] = useFonts({
    ...Feather.font,
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
  });

  const fontsLoaded =
    poppinsLoaded && interLoaded && manropeLoaded && iconsLoaded;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const goToNotifications = () => router.push("/(tabs)/notifications" as any);

    // Handle notification tap while app was in background/foreground
    const cleanup = setupNotificationListeners(
      (title, body) => Alert.alert(title, body),
      goToNotifications,
    );

    // Handle notification tap when app was fully killed
    checkInitialNotification().then((opened) => {
      if (opened) goToNotifications();
    });

    return cleanup;
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AddLogProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="splash" />
              <Stack.Screen name="how-to-use" />
              <Stack.Screen name="partner-welcome" />
              <Stack.Screen name="enter-partner-code" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="add-log" />
              <Stack.Screen name="gift-token" />
              <Stack.Screen name="chat" />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>
          </AddLogProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
