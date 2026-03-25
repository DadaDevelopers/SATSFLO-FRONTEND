import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

interface HomeHeaderProps {
  onNotificationPress?: () => void;
  onLogoPress?: () => void;
}

export function HomeHeader({ onNotificationPress, onLogoPress, unreadCount = 0 }: HomeHeaderProps) {

  return (
    <View className="flex-row justify-between items-center px-5 py-4 pt-8">
      {/* Logo with dashed border */}
      <TouchableOpacity onPress={onLogoPress} activeOpacity={0.7}>
        <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
          <Rect x={0.5} y={0.5} width={39} height={39} rx={19.5} stroke="#CC0045" strokeDasharray="2 2" />
          <Path
            d="M24.3125 12.4764C23.1545 11.1389 21.8511 9.93465 20.4266 8.88573C20.3005 8.79739 20.1502 8.75 19.9963 8.75C19.8423 8.75 19.692 8.79739 19.5659 8.88573C18.144 9.93509 16.8432 11.1394 15.6875 12.4764C13.1103 15.436 11.75 18.556 11.75 21.4998C11.75 23.6878 12.6192 25.7862 14.1664 27.3334C15.7135 28.8806 17.812 29.7498 20 29.7498C22.188 29.7498 24.2865 28.8806 25.8336 27.3334C27.3808 25.7862 28.25 23.6878 28.25 21.4998C28.25 18.556 26.8897 15.436 24.3125 12.4764Z"
            fill="#CC0045"
          />
        </Svg>
      <TouchableOpacity onPress={onLogoPress} activeOpacity={0.7}>
        <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
          <Rect x={0.5} y={0.5} width={39} height={39} rx={19.5} stroke="#CC0045" strokeDasharray="2 2" />
          <Path
            d="M24.3125 12.4764C23.1545 11.1389 21.8511 9.93465 20.4266 8.88573C20.3005 8.79739 20.1502 8.75 19.9963 8.75C19.8423 8.75 19.692 8.79739 19.5659 8.88573C18.144 9.93509 16.8432 11.1394 15.6875 12.4764C13.1103 15.436 11.75 18.556 11.75 21.4998C11.75 23.6878 12.6192 25.7862 14.1664 27.3334C15.7135 28.8806 17.812 29.7498 20 29.7498C22.188 29.7498 24.2865 28.8806 25.8336 27.3334C27.3808 25.7862 28.25 23.6878 28.25 21.4998C28.25 18.556 26.8897 15.436 24.3125 12.4764Z"
            fill="#CC0045"
          />
        </Svg>
      </TouchableOpacity>

      {/* App title */}
      <Text className="text-white text-2xl font-medium font-inter tracking-tight">
        SatsFlo
      </Text>

      {/* Notification bell with unread badge */}
      <TouchableOpacity
        onPress={onNotificationPress}
        className="w-10 h-10 items-center justify-center rounded-full border border-white"
        activeOpacity={0.7}
      >
        <Feather name="bell" size={24} color="#FAFAFA" />
        {unreadCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: '#CC0045',
              borderRadius: 8,
              minWidth: 16,
              height: 16,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 3,
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 9, fontWeight: '700' }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
