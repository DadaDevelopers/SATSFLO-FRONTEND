import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function EditPeriodScreen() {
  const insets = useSafeAreaInsets();

  // October days (1-31)
  const octoberDays = Array.from({ length: 35 }, (_, i) => {
    const day = i < 2 ? 0 : i < 33 ? i - 1 : 0; // Start from Wed (index 2)
    return day;
  });

  // November days (1-30)
  const novemberDays = Array.from({ length: 35 }, (_, i) => {
    const day = i < 2 ? 0 : i < 32 ? i - 1 : 0; // Start from Wed (index 2)
    return day;
  });

  // State for selected period days (12-16 in October as shown in design)
  const [selectedOctober, setSelectedOctober] = useState<number[]>([12, 13, 14, 15, 16]);
  const [selectedNovember, setSelectedNovember] = useState<number[]>([]);

  const toggleDate = (month: 'october' | 'november', day: number) => {
    if (day === 0) return;

    if (month === 'october') {
      setSelectedOctober(prev =>
        prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
      );
    } else {
      setSelectedNovember(prev =>
        prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
      );
    }
  };

  const handleSave = () => {
    // Save the selected period days
    router.back();
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View className="flex-1 bg-[#FF4081]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-center px-5 py-4 relative">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-5"
        >
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>

        <Text className="text-xl font-inter font-medium text-white">
          Edit Period
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Week Days Header */}
        <View className="flex-row justify-between mb-2 mt-4">
          {weekDays.map((day, index) => (
            <View key={index} className="flex-1 items-center py-2">
              <Text className="text-sm font-inter text-white">{day}</Text>
            </View>
          ))}
        </View>

        {/* October Calendar */}
        <View className="mb-6">
          <Text className="text-2xl font-inter text-white text-center mb-4">
            October
          </Text>

          <View className="flex-row flex-wrap">
            {octoberDays.map((day, index) => {
              const isSelected = selectedOctober.includes(day);

              return (
                <Pressable
                  key={index}
                  onPress={() => toggleDate('october', day)}
                  className="w-[14.28%] items-center py-3"
                >
                  {day > 0 && (
                    <View className="items-center gap-1">
                      <Text
                        className={`text-sm font-inter ${
                          isSelected ? 'text-[#FFB2CC]' : 'text-[#FAFAFA]'
                        }`}
                      >
                        {day}
                      </Text>

                      {/* Checkmark Circle */}
                      <View
                        className={`w-4 h-4 rounded-full border items-center justify-center ${
                          isSelected
                            ? 'bg-[#CC0045] border-[#CC0045]'
                            : 'bg-transparent border-[#DCDCDC]'
                        }`}
                      >
                        {isSelected && (
                          <Feather name="check" size={10} color="#FFB2CC" />
                        )}
                      </View>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Divider */}
        <View className="h-[0.5px] bg-[#FF99BC] mb-6" />

        {/* November Calendar */}
        <View className="mb-8">
          <Text className="text-2xl font-inter text-white text-center mb-4">
            November
          </Text>

          <View className="flex-row flex-wrap">
            {novemberDays.map((day, index) => {
              const isSelected = selectedNovember.includes(day);

              return (
                <Pressable
                  key={index}
                  onPress={() => toggleDate('november', day)}
                  className="w-[14.28%] items-center py-3"
                >
                  {day > 0 && (
                    <View className="items-center gap-1">
                      <Text
                        className={`text-sm font-inter ${
                          isSelected ? 'text-[#FFB2CC]' : 'text-[#FAFAFA]'
                        }`}
                      >
                        {day}
                      </Text>

                      {/* Checkmark Circle */}
                      <View
                        className={`w-4 h-4 rounded-full border items-center justify-center ${
                          isSelected
                            ? 'bg-[#CC0045] border-[#CC0045]'
                            : 'bg-transparent border-[#DCDCDC]'
                        }`}
                      >
                        {isSelected && (
                          <Feather name="check" size={10} color="#FFB2CC" />
                        )}
                      </View>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-[#FFB3CC] rounded-full py-4 items-center mx-8 mb-6"
          activeOpacity={0.8}
        >
          <Text className="text-[#FF4081] text-base font-inter font-medium">
            Save
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
