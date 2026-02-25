import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ActionType = 'send' | 'receive' | null;

export default function GiftTokenWalletScreen() {
  const insets = useSafeAreaInsets();
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleProceed = () => {
    console.log('Selected action:', selectedAction);

    if (!selectedAction) {
      console.log('Please select an action');
      return;
    }

    if (selectedAction === 'send') {
      console.log('Navigating to send gift token...');
      router.push('/(tabs)/send-gift-token');
    } else if (selectedAction === 'receive') {
      console.log('Navigating to receive gift token...');
      router.push('/(tabs)/receive-gift-token');
    }
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Header */}
      <View className="flex-row items-center px-5 py-6 gap-[85px]">
        {/* Back Button */}
        <Pressable onPress={handleBack} className="p-1">
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </Pressable>

        {/* Title */}
        <Text className="text-xl font-inter font-medium text-white tracking-tight">
          Gift token
        </Text>

        {/* Spacer */}
        <View className="w-6 h-6 opacity-0">
          <Feather name="calendar" size={24} color="#666666" />
        </View>
      </View>

      {/* Instruction Text */}
      <View className="px-5 mt-6">
        <Text className="text-sm font-inter text-[#FAFAFA] tracking-tight">
          Do you want to receive or send gift token?
        </Text>
      </View>

      {/* Action Options */}
      <View className="px-5 mt-4 gap-4">
        {/* Send Gift Token */}
        <Pressable
          onPress={() => setSelectedAction('send')}
          className="flex-row justify-between items-center px-4 py-5 border rounded-lg active:opacity-80"
          style={{
            borderColor: selectedAction === 'send' ? '#FFFFFF' : '#FF99BC',
            borderWidth: selectedAction === 'send' ? 2 : 1,
            backgroundColor: selectedAction === 'send' ? '#FF6B9D' : 'transparent',
          }}
        >
          <Text className="text-base font-inter text-[#FAFAFA]" style={{ fontWeight: '500' }}>
            Send Gift Token
          </Text>
          {selectedAction === 'send' && (
            <Feather name="check-circle" size={20} color="#4DC721" />
          )}
        </Pressable>

        {/* Receive Gift Token */}
        <Pressable
          onPress={() => setSelectedAction('receive')}
          className="flex-row justify-between items-center px-4 py-5 border rounded-lg active:opacity-80"
          style={{
            borderColor: selectedAction === 'receive' ? '#FFFFFF' : '#FF99BC',
            borderWidth: selectedAction === 'receive' ? 2 : 1,
            backgroundColor: selectedAction === 'receive' ? '#FF6B9D' : 'transparent',
          }}
        >
          <Text className="text-base font-inter text-[#FAFAFA]" style={{ fontWeight: '500' }}>
            Receive Gift Token
          </Text>
          {selectedAction === 'receive' && (
            <Feather name="check-circle" size={20} color="#4DC721" />
          )}
        </Pressable>
      </View>

      {/* Bottom Section */}
      <View className="flex-1" />
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
