import { api } from '@/lib/api';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type WalletType = 'blink' | 'walletOfSatoshi' | null;

interface Wallet {
  id: WalletType;
  label: string;
  logo: any;
}

const wallets: Wallet[] = [
  {
    id: 'blink',
    label: 'Blink',
    logo: require('@/assets/images/blinklogo.png'),
  },
  {
    id: 'walletOfSatoshi',
    label: 'Wallet of Satoshi',
    logo: require('@/assets/images/walletofsatoshilogo.png'),
  },
];

export default function ReceiveWalletScreen() {
  const insets = useSafeAreaInsets();
  const [selectedWallet, setSelectedWallet] = useState<WalletType>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    if (!selectedWallet) {
      Alert.alert('Select Wallet', 'Please select a wallet to continue.');
      return;
    }
    setLoading(true);
    let balance = '';
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        const { response, data } = await api.get('/lightning/wallet', token);
        if (response.ok) {
          const d = data?.data ?? data;
          balance = String(d?.balance_sats ?? d?.balance ?? '');
        }
      }
    } catch {}
    setLoading(false);
    router.push({
      pathname: '/(tabs)/success-received' as any,
      params: { balance },
    });
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Header */}
      <View className="flex-row items-center px-5 py-6 gap-[85px]">
        <Pressable onPress={handleBack} className="p-1">
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </Pressable>
        <Text className="text-xl font-inter font-medium text-white tracking-tight">
          Select Wallet
        </Text>
        <View className="w-6 h-6 opacity-0">
          <Feather name="calendar" size={24} color="#666666" />
        </View>
      </View>

      {/* Instruction Text */}
      <View className="px-5 mt-6">
        <Text className="text-sm font-inter text-[#FAFAFA] tracking-tight">
          Select wallet to receive your gift token.
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
            <View className="flex-row items-center gap-3">
              <Image
                source={wallet.logo}
                style={{ width: 32, height: 32 }}
                resizeMode="contain"
              />
              <Text className="text-sm font-inter text-[#FAFAFA]" style={{ fontWeight: '500' }}>
                {wallet.label}
              </Text>
            </View>
            {selectedWallet === wallet.id && (
              <Feather name="check-circle" size={20} color="#4DC721" />
            )}
          </Pressable>
        ))}
      </View>

      {/* Bottom Section */}
      <View className="flex-1" />
      <View className="items-center pb-0" style={{ paddingBottom: insets.bottom }}>
        <Pressable
          onPress={handleProceed}
          disabled={loading}
          className="w-[250px] py-4 bg-[#FF82AD] rounded-full items-center justify-center active:opacity-80 border-[0.5px] border-[#FF669A] mb-5"
        >
          <Text className="text-white font-inter font-medium text-[15px]">
            {loading ? 'Loading...' : 'Proceed'}
          </Text>
        </Pressable>
        <View className="w-full h-[34px] bg-[#FF3378] items-center justify-center" />
      </View>
    </View>
  );
}
