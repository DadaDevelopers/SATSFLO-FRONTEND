import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SuccessReceivedScreen() {
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      <View
        className="flex-1"
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {/* Content - Centered */}
        <View className="flex-1 items-center justify-center px-8">
          {/* Success Icon */}
          <View className="mb-8">
            <Image
              source={require('@/assets/images/CheckCircle.png')}
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
            />
          </View>

          {/* Success Message */}
          <Text className="text-white text-2xl font-semibold text-center">
            Your wallet was credited with 10,009 SATS
          </Text>
        </View>

        {/* Next Button */}
        <View className="px-5 pb-8">
          <Pressable
            onPress={handleNext}
            className="w-full py-4 bg-[#FF82AD] rounded-full items-center justify-center active:opacity-80 border-[0.5px] border-[#FF669A]"
          >
            <Text className="text-white font-inter font-medium text-[15px]">
              Next
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
