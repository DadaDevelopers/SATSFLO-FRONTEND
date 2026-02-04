import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useAddLog } from '@/context/add-log-context';
import { useResponsive } from '@/hooks/use-responsive';

type Medicine = 'condom' | 'pill' | 'patch' | 'iud' | 'implant' | 'vRing' | 'injection' | 'spermicide';

const MedicineIcon = ({ type, color }: { type: string; color: string }) => {
  switch (type) {
    case 'condom':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Rect x="9" y="4" width="6" height="16" rx="3" stroke={color} strokeWidth={1.5} fill="none" />
          <Path d="M9 8 L15 8" stroke={color} strokeWidth={1} />
        </Svg>
      );
    case 'pill':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Rect x="5" y="8" width="14" height="8" rx="4" stroke={color} strokeWidth={1.5} fill="none" />
          <Path d="M12 8 L12 16" stroke={color} strokeWidth={1} strokeDasharray="2 2" />
        </Svg>
      );
    case 'patch':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Rect x="6" y="6" width="12" height="12" rx="2" stroke={color} strokeWidth={1.5} fill="none" />
          <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1} fill="none" />
        </Svg>
      );
    case 'iud':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Path d="M12 4 L12 20" stroke={color} strokeWidth={1.5} />
          <Path d="M8 6 L12 10 L16 6" stroke={color} strokeWidth={1.5} fill="none" />
        </Svg>
      );
    case 'implant':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Rect x="6" y="10" width="12" height="4" rx="2" stroke={color} strokeWidth={1.5} fill="none" />
        </Svg>
      );
    case 'vRing':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="7" stroke={color} strokeWidth={2.5} fill="none" />
        </Svg>
      );
    case 'injection':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Path d="M12 4 L12 6" stroke={color} strokeWidth={1.5} />
          <Rect x="10" y="6" width="4" height="12" rx="1" stroke={color} strokeWidth={1.5} fill="none" />
          <Path d="M12 18 L12 20" stroke={color} strokeWidth={1.5} />
          <Path d="M10 10 L14 10" stroke={color} strokeWidth={1} />
        </Svg>
      );
    case 'spermicide':
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Path d="M8 6 Q8 20 12 20 Q16 20 16 6" stroke={color} strokeWidth={1.5} fill="none" />
          <Path d="M8 6 L16 6" stroke={color} strokeWidth={1.5} />
          <Circle cx="10" cy="4" r="1" fill={color} />
          <Circle cx="14" cy="4" r="1" fill={color} />
        </Svg>
      );
    default:
      return null;
  }
};

const MEDICINES: { id: Medicine; label: string }[] = [
  { id: 'condom', label: 'Condom' },
  { id: 'pill', label: 'Pill' },
  { id: 'patch', label: 'Patch' },
  { id: 'iud', label: 'IUD' },
  { id: 'implant', label: 'Implant' },
  { id: 'vRing', label: 'V-Ring' },
  { id: 'injection', label: 'Injection' },
  { id: 'spermicide', label: 'Spermicide' },
];

export default function MedicineScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDesktop, containerStyle, outerBackgroundColor } = useResponsive();
  const { getCurrentDayData, toggleMedicine } = useAddLog();
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
            Medicine
          </Text>
        </View>

        {/* Medicine Grid */}
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="bg-pink-100 rounded-3xl p-4">
            <View className="flex-row flex-wrap">
              {MEDICINES.map((medicine) => {
                const isSelected = dayData.medicine.includes(medicine.id);
                return (
                  <TouchableOpacity
                    key={medicine.id}
                    onPress={() => toggleMedicine(medicine.id)}
                    className="w-1/4 items-center mb-4"
                  >
                    <View
                      className={`w-14 h-14 rounded-full items-center justify-center ${
                        isSelected ? 'bg-pink-200 border-2 border-pink-400' : 'bg-white'
                      }`}
                    >
                      <MedicineIcon
                        type={medicine.id}
                        color={isSelected ? '#EC4899' : '#666'}
                      />
                    </View>
                    <Text
                      className={`text-xs mt-1 text-center ${
                        isSelected ? 'text-pink-500 font-semibold' : 'text-gray-600'
                      }`}
                    >
                      {medicine.label}
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
