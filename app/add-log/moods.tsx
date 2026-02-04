import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAddLog } from '@/context/add-log-context';
import { useResponsive } from '@/hooks/use-responsive';

type Mood = 'normal' | 'happy' | 'calm' | 'hyped' | 'inLove' | 'peaceful' | 'lonely' | 'angry';

const MOODS: { id: Mood; emoji: string; label: string }[] = [
  { id: 'normal', emoji: '😐', label: 'Normal' },
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'hyped', emoji: '🤩', label: 'Hyped' },
  { id: 'inLove', emoji: '😍', label: 'In love' },
  { id: 'peaceful', emoji: '😇', label: 'Peaceful' },
  { id: 'lonely', emoji: '😢', label: 'Lonely' },
  { id: 'angry', emoji: '😠', label: 'Angry' },
];

export default function MoodsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDesktop, containerStyle, outerBackgroundColor } = useResponsive();
  const { getCurrentDayData, toggleMood } = useAddLog();
  const dayData = getCurrentDayData();

  const handleSave = () => {
    router.back();
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
            Moods
          </Text>
        </View>

        {/* Moods Grid */}
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="bg-pink-100 rounded-3xl p-4">
            <View className="flex-row flex-wrap">
              {MOODS.map((mood) => {
                const isSelected = dayData.moods.includes(mood.id);
                return (
                  <TouchableOpacity
                    key={mood.id}
                    onPress={() => toggleMood(mood.id)}
                    className="w-1/4 items-center mb-4"
                  >
                    <View
                      className={`w-14 h-14 rounded-full items-center justify-center bg-white ${
                        isSelected ? 'border-2 border-pink-400' : ''
                      }`}
                    >
                      <Text className="text-3xl">{mood.emoji}</Text>
                    </View>
                    <Text
                      className={`text-xs mt-1 text-center ${
                        isSelected ? 'text-pink-500 font-semibold' : 'text-gray-600'
                      }`}
                    >
                      {mood.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

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
