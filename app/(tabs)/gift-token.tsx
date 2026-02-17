import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GiftTokenScreen() {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  const handleSkip = () => {
    router.back();
  };

  const handleProceed = () => {
    // Navigate to gift token wallet screen
    router.push('/(tabs)/gift-token-wallet');
  };

  return (
    <LinearGradient
      colors={['#CEDFF9', '#F7D5FF']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      className="flex-1"
    >
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-8 mt-8">
          {/* Back Button */}
          <Pressable onPress={handleBack} className="p-1">
            <Feather name="arrow-left" size={24} color="#666666" />
          </Pressable>

          {/* Title */}
          <Text className="text-2xl font-inter font-medium text-[#212121] tracking-tight">
            Gift token
          </Text>

          {/* Skip Button */}
          <Pressable onPress={handleSkip}>
            <Text className="text-xs font-inter font-medium text-[#FF4081] tracking-tight">
              Skip
            </Text>
          </Pressable>
        </View>

        {/* Main Content */}
        <View className="flex-1 items-center gap-8">
          {/* Illustration */}
          <View className="items-center pb-8 pt-16">
            <Image
              source={require('@/assets/images/bitcoingirl.png')}
              className="w-64 h-80"
              resizeMode="contain"
            />
          </View>

          {/* Text Content */}
          <View className="items-center px-5 pt-10">
            {/* Main Title */}
            <Text className="text-2xl font-poppins font-semibold text-[#212121] text-center leading-8 mb-1">
              Sats are tiny pieces of{'\n'}Bitcoin 💛
            </Text>

            {/* Description */}
            <Text className="text-sm font-inter text-[#666666] text-center leading-5 mb-2 px-4">
              They make it easy to send, save, and share value,{'\n'}it is just like gifting small bits of Bitcoin!
            </Text>

            {/* Bitcoin Conversion Info */}
            <Text className="text-xs font-inter italic text-[#7D7D7D] text-center">
              1 Bitcoin = 100,000,000 sats
            </Text>
          </View>

          {/* Bottom Section */}
          <View className="w-full items-center pb-8" style={{ paddingBottom: insets.bottom + 20 }}>
            {/* Proceed Button */}
            <Pressable
              onPress={handleProceed}
              className="w-[200px] mb-10 py-4 bg-[#FF4081] rounded-full items-center justify-center active:opacity-80 border-[0.5px] border-[#FF669A]"
            >
              <Text className="text-white font-inter font-medium text-[15px] text-center">
                Proceed
              </Text>
            </Pressable>

            {/* Home Indicator */}
            <View className="w-[134px] h-[5px] bg-[#090909] rounded-full mt-6" />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
