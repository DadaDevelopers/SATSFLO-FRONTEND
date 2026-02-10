import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

const MAX_CONTENT_WIDTH = 480;

// Back arrow icon
const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// Green checkmark icon
const CheckIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#4ADE80" />
    <Path
      d="M8 12l3 3 5-6"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// Blink wallet icon - Black circle with orange gradient ring and white Bitcoin symbol
const BlinkIcon = () => (
  <Svg width={32} height={32} viewBox="0 0 32 32">
    <Defs>
      <LinearGradient id="blinkRingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#F7931A" />
        <Stop offset="100%" stopColor="#FB5607" />
      </LinearGradient>
    </Defs>
    {/* Outer gradient ring */}
    <Circle cx="16" cy="16" r="15" fill="none" stroke="url(#blinkRingGradient)" strokeWidth="2" />
    {/* Black inner circle */}
    <Circle cx="16" cy="16" r="13" fill="#1A1A1A" />
    {/* Bitcoin ₿ symbol - simplified */}
    <Path
      d="M13.5 9v2h-1v1h1v8h-1v1h1v2h1.5v-2h1v2h1.5v-2h1c2 0 3.5-1 3.5-2.5 0-1-.5-1.8-1.5-2.2 0.8-0.4 1.3-1.1 1.3-2 0-1.4-1.2-2.3-3-2.3h-1.3v-2h-1.5v2h-1v-2h-1.5zm2.5 4h1.5c0.8 0 1.3 0.4 1.3 1s-0.5 1-1.3 1H16v-2zm0 4h1.8c0.9 0 1.4 0.4 1.4 1s-0.5 1-1.4 1H16v-2z"
      fill="#FFFFFF"
    />
    {/* Vertical lines through B */}
    <Rect x="14.8" y="8" width="1.2" height="3" fill="#FFFFFF" />
    <Rect x="14.8" y="21" width="1.2" height="3" fill="#FFFFFF" />
    <Rect x="17" y="8" width="1.2" height="3" fill="#FFFFFF" />
    <Rect x="17" y="21" width="1.2" height="3" fill="#FFFFFF" />
  </Svg>
);

// Wallet of Satoshi icon - Dark background with yellow lightning bolt
const WalletOfSatoshiIcon = () => (
  <Svg width={32} height={32} viewBox="0 0 32 32">
    <Circle cx="16" cy="16" r="16" fill="#1A1A1A" />
    <Path
      d="M18 7L10 18h6l-2 7L22 14h-6l2-7z"
      fill="#F0C239"
    />
  </Svg>
);

type WalletType = 'blink' | 'walletOfSatoshi' | null;

interface WalletOption {
  id: WalletType;
  label: string;
  icon: JSX.Element;
}

const wallets: WalletOption[] = [
  { id: 'blink', label: 'Blink', icon: <BlinkIcon /> },
  { id: 'walletOfSatoshi', label: 'Wallet of Satoshi', icon: <WalletOfSatoshiIcon /> },
];

export default function SelectWalletScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category: string }>();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;

  const [selectedWallet, setSelectedWallet] = useState<WalletType>('blink');

  const handleProceed = () => {
    if (selectedWallet) {
      router.push({
        pathname: '/gift-token/success',
        params: {
          wallet: selectedWallet,
          category: params.category,
        },
      });
    }
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: '#FF4081',
        paddingTop: insets.top,
      }}
    >
      {/* Desktop wrapper */}
      <View
        className="flex-1"
        style={isDesktop ? {
          maxWidth: MAX_CONTENT_WIDTH,
          width: '100%',
          alignSelf: 'center',
        } : undefined}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <BackIcon />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white text-xl font-semibold mr-8">
            Select Wallet
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-4">
          <Text className="text-white text-base mb-6">
            Select wallet to carry out your transaction.
          </Text>

          {/* Wallet Options */}
          {wallets.map((wallet) => (
            <TouchableOpacity
              key={wallet.id}
              onPress={() => setSelectedWallet(wallet.id)}
              className="rounded-xl mb-4 px-4 py-5 flex-row items-center"
              style={{
                backgroundColor: '#FF6B9D',
              }}
            >
              {wallet.icon}
              <Text className="text-white text-base font-medium ml-3 flex-1">
                {wallet.label}
              </Text>
              {selectedWallet === wallet.id && <CheckIcon />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Proceed Button */}
        <View className="px-4 pb-8" style={{ paddingBottom: insets.bottom + 32 }}>
          <TouchableOpacity
            onPress={handleProceed}
            disabled={!selectedWallet}
            className="py-4 rounded-full items-center"
            style={{
              backgroundColor: selectedWallet ? '#FFB6C1' : '#FF8FAB',
              opacity: selectedWallet ? 1 : 0.7,
            }}
          >
            <Text className="text-white text-base font-semibold">Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
