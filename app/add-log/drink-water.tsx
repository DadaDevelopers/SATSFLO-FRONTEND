import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { useAddLog } from '@/context/add-log-context';
import { useResponsive } from '@/hooks/use-responsive';

type CupStyle = 'classic' | 'tumbler' | 'tall' | 'mug';

// Different cup style icons
const CupIcon = ({ style, selected, size = 32 }: { style: CupStyle; selected: boolean; size?: number }) => {
  const color = selected ? '#2196F3' : '#90CAF9';

  switch (style) {
    case 'classic':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M7 4 L8 20 L16 20 L17 4 Z"
            stroke={color}
            strokeWidth={2}
            fill={selected ? color : 'none'}
            opacity={selected ? 0.3 : 1}
          />
          {selected && <Path d="M8 12 L8 20 L16 20 L16 12 Z" fill={color} />}
        </Svg>
      );
    case 'tumbler':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M8 4 L7 20 L17 20 L16 4 Z"
            stroke={color}
            strokeWidth={2}
            fill={selected ? color : 'none'}
            opacity={selected ? 0.3 : 1}
          />
          <Path d="M8 4 L16 4" stroke={color} strokeWidth={2} />
          {selected && <Path d="M7.5 12 L7 20 L17 20 L16.5 12 Z" fill={color} />}
        </Svg>
      );
    case 'tall':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect
            x="8"
            y="3"
            width="8"
            height="18"
            rx="1"
            stroke={color}
            strokeWidth={2}
            fill={selected ? color : 'none'}
            opacity={selected ? 0.3 : 1}
          />
          {selected && <Rect x="8" y="10" width="8" height="11" rx="1" fill={color} />}
        </Svg>
      );
    case 'mug':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M6 6 L6 18 L16 18 L16 6 Z"
            stroke={color}
            strokeWidth={2}
            fill={selected ? color : 'none'}
            opacity={selected ? 0.3 : 1}
          />
          <Path d="M16 8 Q20 8 20 12 Q20 16 16 16" stroke={color} strokeWidth={2} fill="none" />
          {selected && <Path d="M6 11 L6 18 L16 18 L16 11 Z" fill={color} />}
        </Svg>
      );
  }
};

export default function DrinkWaterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDesktop, containerStyle, outerBackgroundColor } = useResponsive();
  const { waterTarget, setWaterTarget, cupCapacity, setCupCapacity, cupStyle, setCupStyle } = useAddLog();

  const [localTarget, setLocalTarget] = useState(waterTarget);
  const [localCupCapacity, setLocalCupCapacity] = useState(cupCapacity);
  const [localCupStyle, setLocalCupStyle] = useState(cupStyle);

  useEffect(() => {
    setLocalTarget(waterTarget);
    setLocalCupCapacity(cupCapacity);
    setLocalCupStyle(cupStyle);
  }, [waterTarget, cupCapacity, cupStyle]);

  const handleSave = () => {
    setWaterTarget(localTarget);
    setCupCapacity(localCupCapacity);
    setCupStyle(localCupStyle);
    router.back();
  };

  const cupStyles: CupStyle[] = ['classic', 'tumbler', 'tall', 'mug'];

  const targetOptions = [2000, 2500, 3000, 3500];
  const capacityOptions = [200, 250, 300, 500];

  const cycleTarget = () => {
    const currentIndex = targetOptions.indexOf(localTarget);
    const nextIndex = (currentIndex + 1) % targetOptions.length;
    setLocalTarget(targetOptions[nextIndex]);
  };

  const cycleCapacity = () => {
    const currentIndex = capacityOptions.indexOf(localCupCapacity);
    const nextIndex = (currentIndex + 1) % capacityOptions.length;
    setLocalCupCapacity(capacityOptions[nextIndex]);
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: outerBackgroundColor,
        paddingTop: isDesktop ? 20 : insets.top,
        paddingBottom: isDesktop ? 20 : 0,
      }}
    >
      <View className="flex-1" style={containerStyle}>
        {/* Header */}
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Text className="text-white text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white text-xl font-semibold mr-10">
            Drink Water
          </Text>
        </View>

        {/* Settings Card */}
        <View className="px-4 mb-4">
          <View className="bg-pink-100 rounded-3xl p-4">
            {/* Capacity Units */}
            <View className="flex-row justify-between items-center py-3 border-b border-pink-200">
              <Text className="text-gray-700 text-base">Capacity units</Text>
              <Text className="text-pink-500 font-medium">ml</Text>
            </View>

            {/* Target */}
            <TouchableOpacity
              className="flex-row justify-between items-center py-3 border-b border-pink-200"
              onPress={cycleTarget}
            >
              <Text className="text-gray-700 text-base">Target</Text>
              <Text className="text-pink-500 font-medium">{localTarget.toLocaleString()} ml</Text>
            </TouchableOpacity>

            {/* Cup Capacity */}
            <TouchableOpacity
              className="flex-row justify-between items-center py-3"
              onPress={cycleCapacity}
            >
              <Text className="text-gray-700 text-base">Cup capacity</Text>
              <Text className="text-pink-500 font-medium">{localCupCapacity} ml</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cup Style Selection */}
        <View className="px-4">
          <View className="bg-pink-100 rounded-3xl p-4">
            <Text className="text-gray-800 font-medium mb-4">Select cup style</Text>
            <View className="flex-row justify-around">
              {cupStyles.map((style) => (
                <TouchableOpacity
                  key={style}
                  onPress={() => setLocalCupStyle(style)}
                  className={`w-14 h-14 rounded-full items-center justify-center ${
                    localCupStyle === style ? 'border-2 border-pink-400 bg-white' : 'bg-white'
                  }`}
                >
                  <CupIcon style={style} selected={localCupStyle === style} size={28} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View
          className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-signup-bg"
          style={{ paddingBottom: insets.bottom + 20 }}
        >
          <TouchableOpacity
            onPress={handleSave}
            className="bg-pink-300 py-4 rounded-full items-center"
          >
            <Text className="text-white font-semibold text-base">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
