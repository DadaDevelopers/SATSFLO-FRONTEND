import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type GiftTokenType = 'flowers' | 'sweets' | 'cookies' | 'chocolates' | 'others' | null;

interface GiftToken {
  id: GiftTokenType;
  label: string;
  price: string;
}

const giftTokens: GiftToken[] = [
  { id: 'flowers', label: 'Flowers', price: '$10' },
  { id: 'sweets', label: 'Sweets', price: '$10' },
  { id: 'cookies', label: 'Cookies', price: '$10' },
  { id: 'chocolates', label: 'Chocolates', price: '$10' },
  { id: 'others', label: 'Others', price: '$10' },
];

export default function SendGiftTokenScreen() {
  const insets = useSafeAreaInsets();
  const [selectedToken, setSelectedToken] = useState<GiftTokenType>(null);

  const handleBack = () => {
    // Navigate back to gift token wallet screen
    if (router.canGoBack()) {
      router.push('/(tabs)/gift-token-wallet');
    }
  };

  const handleProceed = () => {
    if (!selectedToken) {
      console.log('Please select a gift token');
      return;
    }
    // Navigate to amount input screen
    console.log('Selected token:', selectedToken);
    router.push('/(tabs)/send-gift-amount');
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      
      {/* Main Content */}
      <View className="flex-1 bg-[#FF4081]">
        {/* Header */}
        <View className="flex-row items-center px-5 py-6 gap-[85px]">
          {/* Back Button */}
          <Pressable onPress={handleBack} className="p-1">
            <Feather name="arrow-left" size={24} color="#FAFAFA" />
          </Pressable>

          {/* Title */}
          <Text className="text-xl font-inter font-medium text-white tracking-tight">
            Send Gift token
          </Text>

          {/* Calendar Icon (hidden as per design) */}
          <View className="w-6 h-6 opacity-0">
            <Feather name="calendar" size={24} color="#666666" />
          </View>
        </View>

        {/* Instruction Text */}
        <View className="px-5 mt-6">
          <Text className="text-sm font-inter text-[#FAFAFA] tracking-tight">
            Select the gift token you would like to send.
          </Text>
        </View>

        {/* Gift Token Options */}
        <View className="px-5 mt-4 gap-4">
          {giftTokens.map((token) => (
            <Pressable
              key={token.id}
              onPress={() => setSelectedToken(token.id)}
              className="flex-row justify-between items-center px-4 py-4 border border-[#FF99BC] rounded-lg active:opacity-80"
            >
              {/* Left side: Radio button + Label */}
              <View className="flex-row items-center gap-1">
                {/* Radio Button */}
                <View className="w-4 h-4 rounded-full border-2 border-[#FFB2CD] items-center justify-center">
                  {selectedToken === token.id && (
                    <View className="w-2.5 h-2.5 rounded-full bg-[#FFB2CD]" />
                  )}
                </View>

                {/* Label */}
                <Text className="text-sm font-inter text-[#FAFAFA] ml-1" style={{ fontWeight: '500' }}>
                  {token.label}
                </Text>
              </View>

              {/* Right side: Price */}
              <Text className="text-sm font-inter text-[#FAFAFA]" style={{ fontWeight: '500' }}>
                {token.price}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Bottom Section */}
      <View
        className="items-center pb-0"
        style={{ paddingBottom: insets.bottom }}
      >
        {/* Proceed Button */}
        <Pressable
          onPress={handleProceed}
          className="w-[250px] py-4 bg-[#FF82AD] rounded-full items-center justify-center active:opacity-80 border-[0.5px] border-[#FF669A] mb-5"
        >
          <Text className="text-white font-inter font-medium text-[15px]">
            Proceed
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
