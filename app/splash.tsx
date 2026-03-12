import { useAuth } from '@/context/auth-context';
import { Href, router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Image, Text, View } from 'react-native';

const MIN_SPLASH_MS = 2000;

export default function SplashScreen() {
  const { isLoading, isAuthenticated } = useAuth();
  const startTime = useRef(Date.now());
  const navigated = useRef(false);

  useEffect(() => {
    if (isLoading || navigated.current) return;

    const elapsed = Date.now() - startTime.current;
    const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);

    const timer = setTimeout(() => {
      navigated.current = true;
      if (isAuthenticated) {
        router.replace('/(tabs)' as Href);
      } else {
        router.replace('/onboarding' as Href);
      }
    }, remaining);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);

  return (
    <View className="flex-1 bg-[#FF4081] items-center justify-center">
      <Image
        source={require('../assets/images/logo-icon.png')}
        className="w-32 h-32 mb-5"
        resizeMode="contain"
      />

      <Text className="text-white text-lg font-semibold mb-3">
        Satsflow
      </Text>

      <View className="flex-row space-x-2">
        <View className="w-1.5 h-1.5 rounded-full bg-white opacity-90" />
        <View className="w-1.5 h-1.5 rounded-full bg-white opacity-90" />
        <View className="w-1.5 h-1.5 rounded-full bg-white opacity-90" />
      </View>
    </View>
  );
}
