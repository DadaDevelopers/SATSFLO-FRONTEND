import { api } from '@/lib/api';
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

interface JournalEntry {
  id: string;
  date: string;
  title?: string;
  content?: string;
  mood?: string;
}

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const loadEntries = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
      const mm = String(currentMonth + 1).padStart(2, '0');
      try {
        const { response, data } = await api.get(`/journal?month=${currentYear}-${mm}`, token);
        if (response.ok) {
          const list = data?.data ?? data ?? [];
          setEntries(Array.isArray(list) ? list : []);
        }
      } catch {}
    };
    loadEntries();
  }, [currentMonth, currentYear]);

  // Get dates for the current week containing selectedDate
  const getWeekDates = (): number[] => {
    const ref = selectedDate ?? today.getDate();
    const refDate = new Date(currentYear, currentMonth, ref);
    const dayOfWeek = refDate.getDay();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentYear, currentMonth, ref - dayOfWeek + i);
      return d.getMonth() === currentMonth ? d.getDate() : 0;
    }).filter((d) => d > 0);
  };

  const filteredEntries = entries.filter((e) => {
    const matchesSearch = !searchText ||
      e.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      e.content?.toLowerCase().includes(searchText.toLowerCase());
    const matchesDate = !selectedDate ||
      parseInt((e.date ?? '').split('T')[0].split('-')[2] ?? '0', 10) === selectedDate;
    return matchesSearch && matchesDate;
  });

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

      {/* Entries or Empty State */}
      {filteredEntries.length > 0 ? (
        <ScrollView
          className="flex-1 px-5 mt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {filteredEntries.map((entry) => (
            <View
              key={entry.id}
              className="bg-[#FFE6EE] rounded-xl px-4 py-3 mb-3"
            >
              {entry.title ? (
                <Text className="text-[#1E1E1E] font-medium text-sm mb-1">{entry.title}</Text>
              ) : null}
              {entry.content ? (
                <Text className="text-[#4D4D4D] text-xs" numberOfLines={3}>{entry.content}</Text>
              ) : null}
              <Text className="text-[#999] text-xs mt-1">{new Date(entry.date).toDateString()}</Text>
            </View>
          ))}
          <TouchableOpacity
            onPress={handleAddEntry}
            className="mt-2 px-4 py-2.5 border border-[#FFB4CD] rounded-full self-center"
            style={{ backgroundColor: '#FF4081' }}
            activeOpacity={0.8}
          >
            <Text className="text-white text-sm font-medium">Add New Entry</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
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
            className="mt-6 px-4 py-2.5 border border-[#FFB4CD] rounded-full"
            style={{ backgroundColor: '#FF4081' }}
            activeOpacity={0.8}
          >
            <Text className="text-white text-sm font-medium">Add New Entry</Text>
          </TouchableOpacity>
        </View>
      )}

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
