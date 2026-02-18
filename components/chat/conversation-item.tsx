import React from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';

interface ConversationItemProps {
  name: string;
  lastMessage: string;
  timestamp: string;
  isOnline?: boolean;
  avatar?: ImageSourcePropType | null;
  onPress: () => void;
}

export function ConversationItem({
  name,
  lastMessage,
  timestamp,
  isOnline = true,
  avatar,
  onPress,
}: ConversationItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-5 py-3.5"
      activeOpacity={0.7}
    >
      {/* Avatar with online indicator */}
      <View className="relative mr-3">
        {avatar ? (
          <Image
            source={avatar}
            className="w-[46px] h-[46px] rounded-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-[46px] h-[46px] rounded-full bg-[#FFB4CD] items-center justify-center">
            <Text className="text-white text-[18px] font-semibold">
              {name.charAt(0)}
            </Text>
          </View>
        )}
        {isOnline && (
          <View className="absolute bottom-0 right-0 w-[13px] h-[13px] rounded-full bg-[#4CAF50] border-[2.5px] border-[#FF4081]" />
        )}
      </View>

      {/* Message content */}
      <View className="flex-1 mr-3">
        <Text className="text-white text-[15px] font-semibold" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-white text-[12px] mt-0.5 opacity-80" numberOfLines={1}>
          {lastMessage}
        </Text>
      </View>

      {/* Timestamp */}
      <Text className="text-white text-[12px] opacity-70">
        {timestamp}
      </Text>
    </TouchableOpacity>
  );
}
