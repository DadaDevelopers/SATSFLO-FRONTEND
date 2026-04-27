import { AddLogProvider } from "@/context/add-log-context";
import { ThemeProvider } from "@/context/theme-context";
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
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export const unstable_settings = {
  anchor: "(auth)",
};

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

  const fontsLoaded = poppinsLoaded && interLoaded && manropeLoaded;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
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
  );
}
