import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';

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

// Radio button icons
const RadioSelected = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20">
    <Circle cx="10" cy="10" r="9" stroke="#FFFFFF" strokeWidth={2} fill="none" />
    <Circle cx="10" cy="10" r="5" fill="#FFFFFF" />
  </Svg>
);

const RadioUnselected = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20">
    <Circle cx="10" cy="10" r="9" stroke="#FFFFFF" strokeWidth={2} fill="none" />
  </Svg>
);

type GiftCategory = 'flowers' | 'sweets' | 'cookies' | 'chocolates' | 'others' | null;

interface CategoryOption {
  id: GiftCategory;
  label: string;
  price: string;
}

const categories: CategoryOption[] = [
  { id: 'flowers', label: 'Flowers', price: '$10' },
  { id: 'sweets', label: 'Sweets', price: '$10' },
  { id: 'cookies', label: 'Cookies', price: '$10' },
  { id: 'chocolates', label: 'Chocolates', price: '$10' },
  { id: 'others', label: 'Others', price: '$10' },
];

export default function ReceiveGiftTokenScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;

  const [selectedCategory, setSelectedCategory] = useState<GiftCategory>('flowers');

  const handleProceed = () => {
    if (selectedCategory) {
      router.push({
        pathname: '/gift-token/select-wallet',
        params: { category: selectedCategory },
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
            Receive Gift token
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-4">
          <Text className="text-white text-base mb-6">
            Select the gift token you would like to receive.
          </Text>

          {/* Category Options */}
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className="rounded-xl mb-4 px-4 py-5 flex-row items-center"
              style={{
                backgroundColor: '#FF6B9D',
              }}
            >
              {selectedCategory === category.id ? <RadioSelected /> : <RadioUnselected />}
              <Text className="text-white text-base font-medium ml-3 flex-1">
                {category.label}
              </Text>
              <Text className="text-white text-base font-medium">
                {category.price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Proceed Button */}
        <View className="px-4 pb-8" style={{ paddingBottom: insets.bottom + 32 }}>
          <TouchableOpacity
            onPress={handleProceed}
            disabled={!selectedCategory}
            className="py-4 rounded-full items-center"
            style={{
              backgroundColor: selectedCategory ? '#FFB6C1' : '#FF8FAB',
              opacity: selectedCategory ? 1 : 0.7,
            }}
          >
            <Text className="text-white text-base font-semibold">Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
