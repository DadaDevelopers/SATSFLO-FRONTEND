import { BottomNavigation } from '@/components/home/bottom-navigation';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabName = 'home' | 'calendar' | 'add' | 'chat' | 'settings';

interface DayData {
  day: number;
  cycleDay: number;
  isPeriod: boolean;
  isFertility: boolean;
  isOvulation: boolean;
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabName>('calendar');
  const [selectedDate, setSelectedDate] = useState(26);

  // Sample cycle data - in a real app this would come from state/storage
  const cycleData = {
    cycleLength: 31,
    periodStart: 12, // Period starts on day 12
    periodLength: 5, // 5 days of period
    ovulationDay: 25, // Ovulation on day 25
    fertilityStart: 20, // Fertility window starts day 20
    fertilityEnd: 26, // Fertility window ends day 26
    currentCycleDay: 15,
  };

  const monthDays = [
    // Week 1 - empty cells for alignment
    { day: 0 }, { day: 0 }, { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 },
    // Week 2
    { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 },
    // Week 3
    { day: 13 }, { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 },
    // Week 4
    { day: 20 }, { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 },
    // Week 5
    { day: 27 }, { day: 28 }, { day: 29 }, { day: 30 }, { day: 31 }, { day: 0 }, { day: 0 },
  ];

  const getDayInfo = (day: number): DayData => {
    if (day === 0) return { day: 0, cycleDay: 0, isPeriod: false, isFertility: false, isOvulation: false };

    // Calculate cycle day (simplified - in real app would be calculated from period start)
    const cycleDay = day <= 11 ? day + 7 : day - 11;

    const isPeriod = day >= cycleData.periodStart && day < cycleData.periodStart + cycleData.periodLength;
    const isFertility = day >= cycleData.fertilityStart && day <= cycleData.fertilityEnd && !isPeriod;
    const isOvulation = day === cycleData.ovulationDay;

    return { day, cycleDay, isPeriod, isFertility, isOvulation };
  };

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    if (tab === 'home') {
      router.push('/');
    }
  };

  const handleEditPeriod = () => {
    // Open edit period modal or navigate to edit screen
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View className="flex-1 bg-[#FF4081] text-[#FAFAFA]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 mt-10">
        {/* Blood Drop Icon */}
        <View className="w-10 h-10 rounded-full border border-dashed border-[#CC0045] items-center justify-center">
          <FontAwesome5 name="tint" size={20} color="#CC0045" />
        </View>

        {/* Month Title */}
        <Text className="text-2xl font-inter font-medium text-white tracking-tight">
          October
        </Text>

        {/* Calendar Icon */}
        <View className="w-10 h-10 rounded-full border border-[#FAFAFA] items-center justify-center">
          <Feather name="calendar" size={20} color="#FAFAFA" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Calendar Grid */}
        <View className="px-0 mt-2">
          {/* Week Days Header */}
          <View className="flex-row justify-between px-2 mb-6">
            {weekDays.map((day, index) => (
              <View key={index} className="flex-1 items-center py-2">
                <Text className="text-sm font-inter text-white">{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Days */}
          <View className="flex-row flex-wrap font-inter text-[#FAFAFA]">
            {monthDays.map((item, index) => {
              const dayInfo = getDayInfo(item.day);
              const isSelected = item.day === selectedDate;

              return (
                <Pressable
                  key={index}
                  onPress={() => item.day > 0 && setSelectedDate(item.day)}
                  className={`w-[14.28%] h-12 items-center justify-center relative ${
                    dayInfo.isPeriod ? 'bg-[#CC0045]' : ''
                  } ${isSelected && !dayInfo.isPeriod ? 'bg-[#FF669A] rounded-lg' : ''}`}
                >
                  {item.day > 0 && (
                    <>
                      {/* Cycle Day Number (small) */}
                      <Text className={`absolute top-0.5 right-1.5 text-[8px] font-inter ${
                        dayInfo.isPeriod ? 'text-[#FFB2CC]' :
                        dayInfo.isFertility ? 'text-[#8027A5]' : 'text-[#FFCCDD]'
                      }`}>
                        {dayInfo.cycleDay}
                      </Text>

                      {/* Day Number */}
                      <Text className={`text-sm font-inter ${
                        dayInfo.isPeriod ? 'text-[#FFB2CC]' : 'text-[#FAFAFA]'
                      }`}>
                        {item.day}
                      </Text>

                      {/* Fertility/Ovulation Indicator */}
                      {dayInfo.isFertility && !dayInfo.isOvulation && (
                        <View className="absolute bottom-1">
                          <MaterialCommunityIcons name="cards-heart" size={10} color="#8027A5" />
                        </View>
                      )}
                      {dayInfo.isOvulation && (
                        <View className="absolute bottom-1">
                          <MaterialCommunityIcons name="cards-heart" size={10} color="#FFD700" />
                        </View>
                      )}
                    </>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Selected Date Info */}
        <View className="flex-row items-center justify-between mt-6 px-5">
          <View>
            <Text className="text-base font-inter text-[#FAFAFA]">
              Oct {selectedDate}
            </Text>
            <Text className="text-sm font-inter text-[#FAFAFA]">
              Cycle day {cycleData.currentCycleDay}
            </Text>
          </View>

          <Pressable
            onPress={handleEditPeriod}
            className="px-3 py-2 border border-[#FFB4CD] rounded-full"
          >
            <Text className="text-xs font-inter font-medium text-[#FFF0F5]">
              Edit Period
            </Text>
          </Pressable>
        </View>
        {/* Divider */}
        <View className="h-[1px] bg-[#FFB2CD] mx-5 my-6" />
        
        {/* Pregnancy Chance */}
        <View className="px-5 mb-4">
          <Text className="text-sm font-inter text-white">
            <Text className="font-medium">Medium</Text> - Chance of getting pregnant
          </Text>
        </View>

        {/* Legend */}
        <View className="flex-row items-center justify-center gap-8 px-5 mb-4">
          {/* Period Days */}
          <View className="items-center gap-2">
            <View className="w-5 h-5 rounded-full bg-[#CC0045]" />
            <Text className="text-xs font-inter text-white">Period days</Text>
          </View>

          {/* Fertility Window */}
          <View className="items-center gap-2">
            <MaterialCommunityIcons name="cards-heart" size={20} color="#8027A5" />
            <Text className="text-xs font-inter text-white">Fertility window</Text>
          </View>

          {/* Ovulation Day */}
          <View className="items-center gap-2">
            <MaterialCommunityIcons name="cards-heart" size={20} color="#FFD700" />
            <Text className="text-xs font-inter text-white">Ovulation Day</Text>
          </View>
        </View>

        {/* Add Note */}
        <View className="items-center mb-8 mt-10">
          <Text className="text-xs font-inter text-[#FFB3CD]">Tap to add note</Text>
          <Feather name="arrow-down" size={20} color="#FFB3CD" style={{ marginTop: 8 }} />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="pt-10">
        <BottomNavigation
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      </View>
    </View>
  );
}
