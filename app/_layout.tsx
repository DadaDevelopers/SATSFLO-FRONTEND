import { Inter_400Regular, useFonts as useInter } from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_600SemiBold, useFonts as usePoppins } from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

export const unstable_settings = {
  anchor: '(auth)',
};

export default function RootLayout() {
  const [poppinsLoaded] = usePoppins({
    Poppins: Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
  });

  const [interLoaded] = useInter({
    Inter: Inter_400Regular,
  });

  const fontsLoaded = poppinsLoaded && interLoaded;

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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-log" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="gift-token" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
