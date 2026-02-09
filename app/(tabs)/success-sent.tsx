import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SuccessSentScreen() {
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    // Navigate back to home or main screen
    router.push('/(tabs)');
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Status Bar Area */}
      <View style={{ paddingTop: insets.top }} className="bg-[#FF4081]" />

      {/* Main Content */}
      <View className="flex-1 bg-[#FF4081] items-center justify-center">
        {/* Success Icon - Green Check Circle */}
        <View className="items-center mb-8">
          <Image
            source={require('@/assets/images/CheckCircle.png')}
            className="w-[150px] h-[150px]"
            resizeMode="contain"
          />
        </View>

        {/* Success Message */}
        <View className="px-10 mt-8">
          <Text className="text-2xl font-inter font-medium text-white text-center tracking-tight leading-7">
            Your SATS was sent successfully!!!
          </Text>
        </View>
      </View>

      {/* Bottom Section */}
      <View
        className="items-center pb-0"
        style={{ paddingBottom: insets.bottom }}
      >
        {/* Next Button */}
        <Pressable
          onPress={handleNext}
          className="w-[250px] py-4 bg-[#FF82AD] rounded-full items-center justify-center active:opacity-80 border-[0.5px] border-[#FF669A] mb-5"
        >
          <Text className="text-white font-inter font-medium text-[15px]">
            Next
          </Text>
        </Pressable>

        {/* Home Indicator Area */}
        <View className="w-full h-[34px] bg-[#FF3378] items-center justify-center">
          <View className="w-[134px] h-[5px] bg-[#FF99BC] rounded-full" />
        </View>
      </View>
    </View>
  );
}
