import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useAddLog } from '@/context/add-log-context';
import { useResponsive } from '@/hooks/use-responsive';

export default function WeightScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDesktop, containerStyle, outerBackgroundColor } = useResponsive();
  const { getCurrentDayData, setWeight, setWeightUnit } = useAddLog();
  const dayData = getCurrentDayData();

  const [localWeight, setLocalWeight] = useState(dayData.weight || '');
  const [localUnit, setLocalUnit] = useState(dayData.weightUnit);

  useEffect(() => {
    setLocalWeight(dayData.weight || '');
    setLocalUnit(dayData.weightUnit);
  }, [dayData.weight, dayData.weightUnit]);

  const increment = () => {
    const currentValue = parseFloat(localWeight) || 0;
    const newValue = Math.round((currentValue + 0.1) * 10) / 10;
    setLocalWeight(newValue.toString());
  };

  const decrement = () => {
    const currentValue = parseFloat(localWeight) || 0;
    const newValue = Math.max(0, Math.round((currentValue - 0.1) * 10) / 10);
    setLocalWeight(newValue > 0 ? newValue.toString() : '');
  };

  const clearValue = () => {
    setLocalWeight('');
  };

  const handleSave = () => {
    setWeight(localWeight);
    setWeightUnit(localUnit);
    router.back();
  };

  const handleInputChange = (text: string) => {
    // Allow only numbers and decimal point
    const filtered = text.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = filtered.split('.');
    if (parts.length > 2) {
      return;
    }
    setLocalWeight(filtered);
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
            Weight
          </Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Weight Input Card */}
          <View className="px-4">
            <View className="bg-pink-100 rounded-3xl p-4">
              {/* Unit Toggle */}
              <View className="flex-row bg-white rounded-full overflow-hidden mb-6">
                <TouchableOpacity
                  onPress={() => setLocalUnit('kg')}
                  className={`flex-1 py-3 items-center ${
                    localUnit === 'kg' ? 'bg-gray-100' : 'bg-white'
                  }`}
                >
                  <Text className={`font-medium ${localUnit === 'kg' ? 'text-gray-800' : 'text-gray-400'}`}>
                    kg
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setLocalUnit('lb')}
                  className={`flex-1 py-3 items-center ${
                    localUnit === 'lb' ? 'bg-gray-100' : 'bg-white'
                  }`}
                >
                  <Text className={`font-medium ${localUnit === 'lb' ? 'text-gray-800' : 'text-gray-400'}`}>
                    lb
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Value Display with Input */}
              <View className="flex-row items-center justify-between px-2">
                {/* Minus Button */}
                <TouchableOpacity
                  onPress={decrement}
                  className="w-10 h-10 rounded-full border-2 border-pink-300 items-center justify-center"
                >
                  <Text className="text-pink-400 text-2xl font-light">−</Text>
                </TouchableOpacity>

                {/* Value Input */}
                <View className="flex-1 items-center mx-4">
                  <TextInput
                    className="text-4xl font-light text-gray-800 text-center"
                    value={localWeight}
                    onChangeText={handleInputChange}
                    placeholder="0.0"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    style={{ minWidth: 100 }}
                  />
                  <Text className="text-gray-500 text-sm mt-1">{localUnit}</Text>
                </View>

                {/* Trash and Plus */}
                <View className="flex-row items-center gap-3">
                  <TouchableOpacity onPress={clearValue} className="p-2">
                    <Svg width={24} height={24} viewBox="0 0 24 24">
                      <Path
                        d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
                        stroke="#999"
                        strokeWidth={1.5}
                        fill="none"
                      />
                      <Path d="M10 11v6M14 11v6" stroke="#999" strokeWidth={1.5} />
                    </Svg>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={increment}
                    className="w-10 h-10 rounded-full border-2 border-pink-300 items-center justify-center"
                  >
                    <Text className="text-pink-400 text-2xl font-light">+</Text>
                  </TouchableOpacity>
                </View>
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
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
