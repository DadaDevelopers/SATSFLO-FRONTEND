import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

type BackButtonProps = {
  onPress?: () => void;
};

export function BackButton({ onPress }: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      className="w-10 h-10 justify-center items-center -ml-2"
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View className="w-6 h-6 justify-center items-center">
        {/* Arrow shaft */}
        <View className="absolute w-4 h-[3px] bg-white rounded-sm" />
        {/* Arrow head - top part */}
        <View
          className="absolute w-[10px] h-[3px] bg-white rounded-sm"
          style={{
            transform: [{ rotate: '-45deg' }],
            left: 0,
            top: 6,
          }}
        />
        {/* Arrow head - bottom part */}
        <View
          className="absolute w-[10px] h-[3px] bg-white rounded-sm"
          style={{
            transform: [{ rotate: '45deg' }],
            left: 0,
            bottom: 6,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
