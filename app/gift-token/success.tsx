import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';

const MAX_CONTENT_WIDTH = 480;

// Large green checkmark icon
const SuccessCheckIcon = () => (
  <Svg width={100} height={100} viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="48" fill="#4ADE80" />
    <Path
      d="M30 50l15 15 25-30"
      stroke="#FF4081"
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ wallet: string; category: string }>();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;

  // Get wallet name for display
  const walletName = params.wallet === 'blink' ? 'Blink' : 'Wallet of Satoshi';

  // Fixed amount for demo - in real app this would come from actual transaction
  const satsAmount = '10,009';

  const handleGoHome = () => {
    // Navigate to home and reset the gift token stack
    router.replace('/(tabs)');
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
        {/* Content - Centered */}
        <View className="flex-1 items-center justify-center px-4">
          {/* Success Icon */}
          <View className="mb-8">
            <SuccessCheckIcon />
          </View>

          {/* Success Message */}
          <Text className="text-white text-xl font-semibold text-center px-8">
            Your {walletName} wallet was credited with {satsAmount} SATS
          </Text>
        </View>

        {/* Go to Homepage Button */}
        <View className="px-4 pb-8" style={{ paddingBottom: insets.bottom + 32 }}>
          <TouchableOpacity
            onPress={handleGoHome}
            className="py-4 rounded-full items-center"
            style={{ backgroundColor: '#FFB6C1' }}
          >
            <Text className="text-white text-base font-semibold">Go to Homepage</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
