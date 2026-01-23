import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';

export default function SplashScreen() {
  useEffect(() => {
    const checkFirstLaunch = async () => {
      // Clear for testing - remove this line later
      await AsyncStorage.removeItem('hasLaunched');

      const hasLaunched = await AsyncStorage.getItem('hasLaunched');

      setTimeout(async () => {
        if (!hasLaunched) {
          await AsyncStorage.setItem('hasLaunched', 'true');
          router.replace('/onboarding');
        } else {
          router.replace('/(tabs)');
        }
      }, 2000);
    };

    checkFirstLaunch();
  }, []);

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
