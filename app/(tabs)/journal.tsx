import { JournalEntry, journalService } from '@/services/journal.service';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
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
  const today = new Date();
  const [searchText, setSearchText] = useState('');
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  // YYYY-MM for API
  const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  useEffect(() => {
    journalService.getByMonth(monthKey).then(setEntries).catch(() => {});
  }, [monthKey]);

  // Dates with entries this month
  const datesWithEntries = new Set(
    entries.map((e) => parseInt(e.entry_date.split('-')[2], 10))
  );

  // Filter by selected date and search
  const visibleEntries = entries.filter((e) => {
    const day = parseInt(e.entry_date.split('-')[2], 10);
    const matchesDate = selectedDate == null || day === selectedDate;
    const matchesSearch = !searchText.trim() ||
      e.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      e.content.toLowerCase().includes(searchText.toLowerCase());
    return matchesDate && matchesSearch;
  });

  // Week strip: 7 days centred on today within current month
  const getWeekDates = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const anchor = currentYear === today.getFullYear() && currentMonth === today.getMonth()
      ? today.getDate()
      : 1;
    const start = Math.max(1, anchor - 3);
    const end = Math.min(daysInMonth, start + 6);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
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
    <View className="flex-1" style={{ paddingTop: insets.top, backgroundColor: '#FF4081' }}>
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
              <Text className="text-sm text-[#090909]">{date}</Text>
              {datesWithEntries.has(date) && (
                <View className="w-1.5 h-1.5 rounded-full bg-[#FF4081] mt-0.5" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Entry List or Empty State */}
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {visibleEntries.length === 0 ? (
          <View className="items-center justify-center pt-16 pb-20">
            <View className="w-20 h-20 items-center justify-center mb-2">
              <Ionicons name="document-outline" size={80} color="#FFFFFF" />
              <View className="absolute">
                <Feather name="x" size={24} color="#FFFFFF" />
              </View>
            </View>
            <Text className="text-[#FAFAFA] text-base font-medium mt-2">
              No entry added
            </Text>
            <TouchableOpacity
              onPress={handleAddEntry}
              className="mt-6 px-4 py-2.5 border border-[#FFB4CD] rounded-full"
              style={{ backgroundColor: '#FF4081' }}
              activeOpacity={0.8}
            >
              <Text className="text-white text-sm font-medium">Add New Entry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {visibleEntries.map((entry) => (
              <View
                key={entry.id}
                className="bg-white/20 rounded-2xl p-4 mb-4"
              >
                <View className="flex-row justify-between items-start mb-1">
                  <Text className="text-white text-sm font-semibold flex-1 mr-2">
                    {entry.title ?? entry.entry_date}
                  </Text>
                  <Text className="text-[#FAFAFA] text-xs opacity-70">
                    {entry.entry_date}
                  </Text>
                </View>
                <Text className="text-white text-sm leading-5" numberOfLines={3}>
                  {entry.content}
                </Text>
                {entry.mood && (
                  <Text className="text-[#FFD6E8] text-xs mt-2">{entry.mood}</Text>
                )}
              </View>
            ))}
            <TouchableOpacity
              onPress={handleAddEntry}
              className="self-center mt-2 mb-8 px-4 py-2.5 border border-[#FFB4CD] rounded-full"
              style={{ backgroundColor: '#FF4081' }}
              activeOpacity={0.8}
            >
              <Text className="text-white text-sm font-medium">Add New Entry</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

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
