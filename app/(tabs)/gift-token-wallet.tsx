import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

type OptionType = 'send' | 'receive' | null;

const CheckmarkIcon = () => (
  <Svg width="19" height="18" viewBox="0 0 19 18" fill="none">
    <Path
      d="M17.641 8.67238V9.35128C17.64 10.9426 17.0961 12.4909 16.0904 13.7654C15.0847 15.0399 13.671 15.9723 12.0603 16.4235C10.4495 16.8747 8.72796 16.8205 7.15236 16.269C5.57676 15.7176 4.23153 14.6984 3.31732 13.3634C2.4031 12.0285 1.96887 10.4494 2.07938 8.86153C2.1899 7.27369 2.83925 5.76224 3.93058 4.55259C5.02191 3.34293 6.49675 2.4999 8.13514 2.14921C9.77353 1.79852 11.4877 1.95896 13.022 2.60662"
      stroke="#4DC721"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.6377 3.44775L9.84849 10.8344L7.51172 8.62063"
      stroke="#4DC721"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function GiftTokenWalletScreen() {
  const insets = useSafeAreaInsets();
  const [selectedOption, setSelectedOption] = useState<OptionType>(null);

  const handleBack = () => {
    // Navigate back to gift token screen
    if (router.canGoBack()) {
      router.push('/(tabs)/gift-token');
    }
  };

  const handleSendGiftToken = () => {
    setSelectedOption('send');
  };

  const handleReceiveGiftToken = () => {
    setSelectedOption('receive');
  };

  const handleNext = () => {
    console.log('Next button clicked, selected option:', selectedOption);

    if (!selectedOption) {
      // Could show an alert or toast that user needs to select an option
      console.log('Please select an option first');
      Alert.alert('Selection Required', 'Please select an option first');
      return;
    }

    // Navigate to next screen based on selection
    if (selectedOption === 'send') {
      console.log('Navigating to send gift token screen');
      router.push('/(tabs)/send-gift-token');
    } else if (selectedOption === 'receive') {
      // Navigate to receive gift token screen (to be created)
      console.log('Navigate to receive gift token');
      Alert.alert('Coming Soon', 'Receive gift token screen coming soon');
    }
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Main Content */}
      <View className="flex-1 bg-[#FF4081]">
        {/* Header */}
        <View className="flex-row items-center px-5 py-6 gap-[102px]">
          {/* Back Button */}
          <Pressable onPress={handleBack} className="p-1">
            <Feather name="arrow-left" size={24} color="#FAFAFA" />
          </Pressable>

          {/* Title */}
          <Text className="text-xl font-inter font-medium text-white tracking-tight">
            Gift token
          </Text>

          {/* Calendar Icon (hidden as per design) */}
          <View className="w-6 h-6 opacity-0">
            <Feather name="calendar" size={24} color="#666666" />
          </View>
        </View>

        {/* Question Text */}
        <View className="px-5 mt-6">
          <Text className="text-sm font-inter text-[#FAFAFA] tracking-tight">
            Do you want to receive or send gift token?
          </Text>
        </View>

        {/* Options */}
        <View className="px-5 mt-4 gap-4">
          {/* Send Gift Token */}
          <Pressable
            onPress={handleSendGiftToken}
            className="flex-row justify-between items-center px-4 py-4 border border-[#FF99BC] rounded-lg active:opacity-80"
          >
            <Text className="text-sm font-inter text-[#FAFAFA]" style={{ fontWeight: '500' }}>
              Send Gift Token
            </Text>
            {selectedOption === 'send' && <CheckmarkIcon />}
          </Pressable>

          {/* Receive Gift Token */}
          <Pressable
            onPress={handleReceiveGiftToken}
            className="flex-row justify-between items-center px-4 py-4 border border-[#FF99BC] rounded-lg active:opacity-80"
          >
            <Text className="text-sm font-inter text-[#FAFAFA]" style={{ fontWeight: '500' }}>
              Receive Gift Token
            </Text>
            {selectedOption === 'receive' && <CheckmarkIcon />}
          </Pressable>
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
