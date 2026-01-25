import React from 'react';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomStatusBar() {
  const insets = useSafeAreaInsets();

  // Only show custom status bar on iOS with notch
  if (Platform.OS !== 'ios' || insets.top < 44) {
    return null;
  }

  return (
    <View
      className="flex-row justify-center items-end h-[59px] bg-white"
      style={{ paddingTop: insets.top - 37 }}
    >
      {/* Left Side - Time */}
      <View className="flex-1 items-center justify-center pl-2.5 pb-[3px]">
        <Text className="text-base font-semibold tracking-[-0.32px] text-[#090909]">
          9:41
        </Text>
      </View>

      {/* Center - Dynamic Island */}
      <View className="flex-1 items-center justify-center">
        <View className="w-[125px] h-[37px] bg-signup-home-indicator rounded-[100px]" />
      </View>

      {/* Right Side - Icons */}
      <View className="flex-1 flex-row justify-center items-center pr-[11px]">
        <View className="flex-row items-center gap-2">
          {/* Signal Bars */}
          <View className="flex-row items-end gap-[1px] h-3">
            <View className="w-[3px] h-1 bg-[#090909] rounded-[1px]" />
            <View className="w-[3px] h-1.5 bg-[#090909] rounded-[1px]" />
            <View className="w-[3px] h-[9px] bg-[#090909] rounded-[1px]" />
            <View className="w-[3px] h-3 bg-[#090909] rounded-[1px]" />
          </View>

          {/* WiFi */}
          <View className="w-[17px] h-3 justify-end items-center">
            <View className="absolute top-0 w-[17px] h-[9px] rounded-tl-[10px] rounded-tr-[10px] border-2 border-b-0 border-[#090909]" />
            <View className="absolute top-1 w-[11px] h-1.5 rounded-tl-[7px] rounded-tr-[7px] border-2 border-b-0 border-[#090909]" />
            <View className="w-1 h-1 rounded-full bg-[#090909]" />
          </View>

          {/* Battery */}
          <View className="flex-row items-center">
            <View className="w-[25px] h-[13px] rounded border border-[rgba(9,9,9,0.35)] p-0.5 justify-center">
              <View className="flex-1 bg-[#090909] rounded-sm" />
            </View>
            <View className="w-[1.4px] h-1 bg-[rgba(9,9,9,0.4)] ml-[1px] rounded-[1px]" />
          </View>
        </View>
      </View>
    </View>
  );
}
