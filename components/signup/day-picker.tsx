import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { cn } from '@/lib/utils';

type DayPickerProps = {
  values: number[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  suffix?: string;
};

const VISIBLE_ITEMS = 3;

export function DayPicker({
  values,
  selectedValue,
  onValueChange,
  suffix = 'days',
}: DayPickerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const selectedIndex = values.indexOf(selectedValue);
  const { height } = useWindowDimensions();

  // Adjust item height based on screen size
  const itemHeight = height < 700 ? 50 : 60;

  useEffect(() => {
    if (scrollViewRef.current && selectedIndex >= 0) {
      scrollViewRef.current.scrollTo({
        y: selectedIndex * itemHeight,
        animated: false,
      });
    }
  }, [selectedIndex, itemHeight]);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / itemHeight);
    if (index >= 0 && index < values.length && values[index] !== selectedValue) {
      onValueChange(values[index]);
    }
  };

  const handleItemPress = (value: number) => {
    const index = values.indexOf(value);
    if (scrollViewRef.current && index >= 0) {
      scrollViewRef.current.scrollTo({
        y: index * itemHeight,
        animated: true,
      });
    }
    onValueChange(value);
  };

  return (
    <View
      className="bg-signup-picker-bg border-[0.5px] border-signup-picker-border rounded-xl overflow-hidden w-full"
      style={{ height: itemHeight * VISIBLE_ITEMS }}
    >
      {/* Selection highlight */}
      <View
        className="absolute left-0 right-0 bg-signup-selected-bg z-0"
        style={{ top: itemHeight, height: itemHeight }}
      />

      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
      >
        {/* Top padding */}
        <View style={{ height: itemHeight }} />

        {values.map((value) => {
          const isSelected = value === selectedValue;
          return (
            <TouchableOpacity
              key={value}
              className="w-full flex-row justify-center items-center px-6"
              style={{ height: itemHeight }}
              onPress={() => handleItemPress(value)}
              activeOpacity={0.7}
            >
              <Text
                className={cn(
                  'text-base font-normal text-signup-placeholder',
                  isSelected && 'text-lg font-semibold text-[#333333]'
                )}
              >
                {value} {suffix}
              </Text>
              {isSelected && (
                <View className="absolute right-6">
                  <CheckmarkIcon />
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Bottom padding */}
        <View style={{ height: itemHeight }} />
      </ScrollView>
    </View>
  );
}

function CheckmarkIcon() {
  return (
    <View className="w-6 h-6 justify-center items-center">
      <View className="w-[22px] h-[22px] rounded-full border-2 border-[#4CAF50] justify-center items-center">
        <View className="w-3 h-[9px] relative">
          <View
            className="absolute w-[5px] h-0.5 bg-[#4CAF50] bottom-0.5 left-0"
            style={{ transform: [{ rotate: '45deg' }] }}
          />
          <View
            className="absolute w-[9px] h-0.5 bg-[#4CAF50] bottom-[3px] left-0.5"
            style={{ transform: [{ rotate: '-45deg' }] }}
          />
        </View>
      </View>
    </View>
  );
}
