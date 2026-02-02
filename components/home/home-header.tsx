import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface HomeHeaderProps {
  onNotificationPress?: () => void;
  onLogoPress?: () => void;
}

function DropIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.69L17.66 8.35C19.54 10.23 20.55 12.73 20.55 15.35C20.55 17.97 19.54 20.47 17.66 22.35C15.78 24.23 13.28 25.24 10.66 25.24C8.04 25.24 5.54 24.23 3.66 22.35C1.78 20.47 0.77 17.97 0.77 15.35C0.77 12.73 1.78 10.23 3.66 8.35L12 2.69Z"
        fill="#CC0045"
        transform="translate(0, -2) scale(0.9)"
      />
    </Svg>
  );
}

export function HomeHeader({ onNotificationPress, onLogoPress }: HomeHeaderProps) {
  return (
    <View className="flex-row justify-between items-center px-5 py-4">
      {/* Logo with dashed border */}
      <TouchableOpacity
        onPress={onLogoPress}
        className="w-10 h-10 items-center justify-center rounded-full border border-dashed"
        style={{ borderColor: '#CC0045' }}
        activeOpacity={0.7}
      >
        <DropIcon />
      </TouchableOpacity>

      {/* App title */}
      <Text className="text-white text-2xl font-medium tracking-tight">
        SatsFlo
      </Text>

      {/* Notification bell */}
      <TouchableOpacity
        onPress={onNotificationPress}
        className="w-10 h-10 items-center justify-center rounded-full border border-white"
        activeOpacity={0.7}
      >
        <Feather name="bell" size={24} color="#FAFAFA" />
      </TouchableOpacity>
    </View>
  );
}
