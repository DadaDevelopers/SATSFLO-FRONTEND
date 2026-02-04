import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [currentMonth, setCurrentMonth] = useState(9); // October (0-indexed)
  const [currentYear, setCurrentYear] = useState(2024);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Get dates for the current week view (sample: showing 6-12)
  const getWeekDates = () => {
    return [6, 7, 8, 9, 10, 11, 12];
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddEntry = () => {
    router.push('/add-entry');
  };

  const handleDateSelect = (date: number) => {
    setSelectedDate(date);
  };

  return (
    <View className="flex-1 bg-home-bg" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      {/* Header */}
      <View className="flex-row items-center px-6 py-10">
        <TouchableOpacity onPress={handleBack} className="p-1">
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-white text-xl font-medium tracking-tight">
            My SatsFlo Journal
          </Text>
        </View>
        {/* Empty view for centering the title */}
        <View className="w-6" />
      </View>

      {/* Search Bar */}
      <View className="px-5 mt-2">
        <View className="flex-row items-center px-4 py-3 border border-[#FFB3CD] rounded-lg">
          <Feather name="search" size={16} color="#FAFAFA" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search here"
            placeholderTextColor="#FAFAFA"
            className="flex-1 ml-2 text-white text-xs"
          />
        </View>
      </View>

      {/* Calendar Section */}
      <View className="px-4 mt-4">
        {/* Month Navigation */}
        <View className="flex-row justify-between items-center py-2 px-2">
          <TouchableOpacity onPress={handlePreviousMonth} className="p-2">
            <Feather name="chevron-left" size={16} color="#FAFAFA" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-normal">
            {MONTHS[currentMonth]}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} className="p-2">
            <Feather name="chevron-right" size={16} color="#FAFAFA" />
          </TouchableOpacity>
        </View>

        {/* Week Days Row */}
        <View className="flex-row justify-between px-2 mt-2">
          {WEEK_DAYS.map((day) => (
            <View key={day} className="w-10 items-center">
              <Text className="text-[#FAFAFA] text-sm">{day}</Text>
            </View>
          ))}
        </View>

        {/* Date Circles Row */}
        <View className="flex-row justify-between px-2 mt-3">
          {getWeekDates().map((date) => (
            <TouchableOpacity
              key={date}
              onPress={() => handleDateSelect(date)}
              className={`w-10 h-10 rounded-full items-center justify-center border border-[#FFDFEA] ${
                selectedDate === date ? 'bg-white' : ''
              }`}
            >
              <Text
                className={`text-sm ${
                  selectedDate === date ? 'text-[#090909]' : 'text-[#090909]'
                }`}
              >
                {date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Empty State */}
      <View className="flex-1 items-center justify-center pb-20 mb-10">
        {/* Empty Document Icon */}
        <View className="w-20 h-20 items-center justify-center mb-2">
          <Ionicons name="document-outline" size={80} color="#FFFFFF" />
          <View className="absolute">
            <Feather name="x" size={24} color="#FFFFFF" />
          </View>
        </View>

        <Text className="text-[#FAFAFA] text-base font-medium mt-2">
          No entry added
        </Text>

        {/* Add New Entry Button */}
        <TouchableOpacity
          onPress={handleAddEntry}
          className="mt-6 px-4 py-2.5 bg-home-bg border border-[#FFB4CD] rounded-full"
          activeOpacity={0.8}
        >
          <Text className="text-white text-sm font-medium">Add New Entry</Text>
        </TouchableOpacity>
      </View>

      {/* Home Indicator Area */}
      <View
        className="h-8 bg-[#FF3378] items-center justify-end pb-2"
        style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }}
      >
        <View className="w-32 h-1.5 bg-[#FF99BC] rounded-full" />
      </View>
    </View>
  );
}
