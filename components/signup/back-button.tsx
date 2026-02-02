import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

type BackButtonProps = {
  onPress?: () => void;
  color?: string;
};

export function BackButton({ onPress, color = '#FFFFFF' }: BackButtonProps) {
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
      <Feather name="arrow-left" size={24} color={color} />
    </TouchableOpacity>
  );
}
