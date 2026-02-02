import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { useAddLog } from '@/context/add-log-context';
import { useResponsive } from '@/hooks/use-responsive';

type Symptom = 'cramps' | 'fatigue' | 'bloating' | 'headache' | 'bellyAches' | 'acne' | 'soreBreasts' | 'cravings';

const SymptomIcon = ({ type, color }: { type: string; color: string }) => {
  switch (type) {
    case 'cramps':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.5} fill="none" />
          <Path d="M8 12 L16 12" stroke={color} strokeWidth={1.5} />
          <Path d="M12 8 L12 16" stroke={color} strokeWidth={1.5} />
        </Svg>
      );
    case 'fatigue':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} fill="none" />
          <Circle cx="9" cy="10" r="1" fill={color} />
          <Circle cx="15" cy="10" r="1" fill={color} />
          <Path d="M8 15 Q12 13 16 15" stroke={color} strokeWidth={1.5} fill="none" />
        </Svg>
      );
    case 'bloating':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Ellipse cx="12" cy="14" rx="7" ry="6" stroke={color} strokeWidth={1.5} fill="none" />
          <Path d="M9 6 Q12 4 15 6" stroke={color} strokeWidth={1.5} fill="none" />
        </Svg>
      );
    case 'headache':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.5} fill="none" />
          <Path d="M8 8 L10 12 L8 16" stroke={color} strokeWidth={1.5} fill="none" />
          <Path d="M16 8 L14 12 L16 16" stroke={color} strokeWidth={1.5} fill="none" />
        </Svg>
      );
    case 'bellyAches':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.5} fill="none" />
          <Path d="M9 9 L15 15" stroke={color} strokeWidth={1.5} />
          <Path d="M15 9 L9 15" stroke={color} strokeWidth={1.5} />
        </Svg>
      );
    case 'acne':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.5} fill="none" />
          <Circle cx="10" cy="10" r="1.5" fill={color} />
          <Circle cx="14" cy="11" r="1" fill={color} />
          <Circle cx="11" cy="14" r="1.2" fill={color} />
        </Svg>
      );
    case 'soreBreasts':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Path d="M6 10 Q6 18 12 18 Q18 18 18 10" stroke={color} strokeWidth={1.5} fill="none" />
          <Path d="M6 10 Q9 6 12 10 Q15 6 18 10" stroke={color} strokeWidth={1.5} fill="none" />
        </Svg>
      );
    case 'cravings':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Path d="M12 4 L12 8" stroke={color} strokeWidth={1.5} />
          <Path d="M8 20 L16 20 L14 10 L10 10 Z" stroke={color} strokeWidth={1.5} fill="none" />
          <Circle cx="12" cy="14" r="2" fill={color} />
        </Svg>
      );
    default:
      return null;
  }
};

const SYMPTOMS: { id: Symptom; label: string }[] = [
  { id: 'cramps', label: 'Cramps' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'bloating', label: 'Bloating' },
  { id: 'headache', label: 'Headache' },
  { id: 'bellyAches', label: 'Belly aches' },
  { id: 'acne', label: 'Acne' },
  { id: 'soreBreasts', label: 'Sore breasts' },
  { id: 'cravings', label: 'Cravings' },
];

export default function SymptomsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDesktop, containerStyle, outerBackgroundColor } = useResponsive();
  const { getCurrentDayData, toggleSymptom } = useAddLog();
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
            Symptoms
          </Text>
        </View>

        {/* Symptoms Grid */}
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="bg-pink-100 rounded-3xl p-4">
            <View className="flex-row flex-wrap">
              {SYMPTOMS.map((symptom) => {
                const isSelected = dayData.symptoms.includes(symptom.id);
                return (
                  <TouchableOpacity
                    key={symptom.id}
                    onPress={() => toggleSymptom(symptom.id)}
                    className="w-1/4 items-center mb-4"
                  >
                    <View
                      className={`w-14 h-14 rounded-full items-center justify-center ${
                        isSelected ? 'bg-pink-200' : 'bg-white'
                      }`}
                    >
                      <SymptomIcon
                        type={symptom.id}
                        color={isSelected ? '#EC4899' : '#666'}
                      />
                    </View>
                    <Text
                      className={`text-xs mt-1 text-center ${
                        isSelected ? 'text-pink-500 font-semibold' : 'text-gray-600'
                      }`}
                    >
                      {symptom.label}
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
