import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type WalletType = 'blink' | 'wallet-of-satoshi' | null;

interface Wallet {
  id: WalletType;
  name: string;
  logo: any; // Image source
}

const wallets: Wallet[] = [
  {
    id: 'blink',
    name: 'Blink',
    logo: require('@/assets/images/blinklogo.png')
  },
  {
    id: 'wallet-of-satoshi',
    name: 'Wallet of Satoshi',
    logo: require('@/assets/images/walletofsatoshilogo.png')
  },
];

export default function SelectWalletScreen() {
  const insets = useSafeAreaInsets();
  const [selectedWallet, setSelectedWallet] = useState<WalletType>(null);

  const handleBack = () => {
    // Navigate back to send gift amount screen
    if (router.canGoBack()) {
      router.push('/(tabs)/send-gift-amount');
    }
  };

  const handleProceed = () => {
    console.log('Proceed button clicked, selected wallet:', selectedWallet);

    if (!selectedWallet) {
      console.log('Please select a wallet');
      Alert.alert('Wallet Required', 'Please select a wallet to continue');
      return;
    }

    // Navigate to success sent screen
    console.log('Proceeding with wallet:', selectedWallet);
    router.push('/(tabs)/success-sent');
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
            Select Wallet
          </Text>

          {/* Calendar Icon (hidden as per design) */}
          <View className="w-6 h-6 opacity-0">
            <Feather name="calendar" size={24} color="#666666" />
          </View>
        </View>

        {/* Instruction Text */}
        <View className="px-5 mt-6">
          <Text className="text-sm font-inter text-[#FAFAFA] tracking-tight">
            Select wallet to carry out your transaction.
          </Text>
        </View>

        {/* Wallet Options */}
        <View className="px-5 mt-4 gap-4">
          {wallets.map((wallet) => (
            <Pressable
              key={wallet.id}
              onPress={() => setSelectedWallet(wallet.id)}
              className="flex-row justify-between items-center px-4 py-4 border border-[#FF99BC] rounded-lg active:opacity-80"
            >
              {/* Left side: Logo + Name */}
              <View className="flex-row items-center gap-2">
                {/* Wallet Logo */}
                <Image
                  source={wallet.logo}
                  className="w-5 h-5"
                  resizeMode="contain"
                />

                {/* Wallet Name */}
                <Text className="text-sm font-inter text-[#FAFAFA]" style={{ fontWeight: '500' }}>
                  {wallet.name}
                </Text>
              </View>

              {/* Right side: Selected indicator */}
              {selectedWallet === wallet.id && (
                <Feather name="check-circle" size={18} color="#4DC721" />
              )}
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
