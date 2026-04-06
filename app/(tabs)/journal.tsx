import { api } from '@/lib/api';
import { Feather } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const MOOD_EMOJI: Record<string, string> = {
  inlove: '😍', peaceful: '😌', lonely: '😢', angry: '😠',
  normal: '🙂', happy: '😄', calm: '😊', hyped: '🤩',
};

interface JournalEntry {
  id: string;
  date: string;
  title?: string;
  content?: string;
  mood?: string;
  symptoms?: string[];
  images?: string[];
  cycle_day?: number;
}

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDate(today));
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchResults, setSearchResults] = useState<JournalEntry[]>([]);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadEntries = useCallback(async () => {
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
  }, [currentMonth, currentYear]);

  // Reload when screen comes back into focus (e.g. after add-entry)
  useFocusEffect(useCallback(() => {
    loadEntries();
  }, [loadEntries]));

  // Debounced server-side search
  useEffect(() => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
      const mm = String(currentMonth + 1).padStart(2, '0');
      try {
        const { response, data } = await api.get(
          `/journal/search?q=${encodeURIComponent(searchText.trim())}&month=${currentYear}-${mm}`,
          token
        );
        if (response.ok) {
          const list = data?.data ?? data ?? [];
          setSearchResults(Array.isArray(list) ? list : []);
        }
      } catch {}
    }, 400);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [searchText, currentMonth, currentYear]);

  // Get all 7 dates for the week containing selectedDate
  const getWeekDates = (): Date[] => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const refDate = new Date(y, m - 1, d);
    const dayOfWeek = refDate.getDay();
    return Array.from({ length: 7 }, (_, i) => new Date(y, m - 1, d - dayOfWeek + i));
  };

  // When searching: show server results; when not: show entries for selected date
  const filteredEntries = searchText.trim()
    ? searchResults
    : entries.filter(e => !selectedDate || (e.date ?? '').split('T')[0] === selectedDate);

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
    router.push("/add-entry");
  };

  const handleDateSelect = (d: Date) => {
    setSelectedDate(formatDate(d));
    if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) {
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
    }
  const handleDateSelect = (d: Date) => {
    setSelectedDate(formatDate(d));
    if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) {
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
    }
  };

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: "#FF4081" }}
    >
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
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderWidth: 0.5, borderColor: '#FFB3CD', borderRadius: 8 }}>
          <Feather name="search" size={16} color="#FAFAFA" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search here"
            placeholderTextColor="#FAFAFA"
            style={{ flex: 1, marginLeft: 8, color: '#FFFFFF', fontSize: 12 }}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Calendar Section */}
      <View className="px-4 mt-4">
        {/* Month Navigation */}
        <View className="flex-row justify-between items-center py-2 px-2">
          <TouchableOpacity onPress={handlePreviousMonth} className="p-2">
            <Svg width={16} height={16} viewBox="0 0 16 16" style={{ transform: [{ scaleX: -1 }] }}>
              <Path d="M11.354 8.35403L6.35403 13.354C6.30757 13.4005 6.25242 13.4373 6.19173 13.4625C6.13103 13.4876 6.06598 13.5006 6.00028 13.5006C5.93458 13.5006 5.86953 13.4876 5.80883 13.4625C5.74813 13.4373 5.69298 13.4005 5.64653 13.354C5.60007 13.3076 5.56322 13.2524 5.53808 13.1917C5.51294 13.131 5.5 13.066 5.5 13.0003C5.5 12.9346 5.51294 12.8695 5.53808 12.8088C5.56322 12.7481 5.60007 12.693 5.64653 12.6465L10.2934 8.00028L5.64653 3.35403C5.55271 3.26021 5.5 3.13296 5.5 3.00028C5.5 2.8676 5.55271 2.74035 5.64653 2.64653C5.74035 2.55271 5.8676 2.5 6.00028 2.5C6.13296 2.5 6.26021 2.55271 6.35403 2.64653L11.354 7.64653C11.4005 7.69296 11.4374 7.74811 11.4626 7.80881C11.4877 7.86951 11.5007 7.93457 11.5007 8.00028C11.5007 8.06599 11.4877 8.13105 11.4626 8.19175C11.4374 8.25245 11.4005 8.30759 11.354 8.35403Z" fill="#FAFAFA" />
            </Svg>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-normal">
            {MONTHS[currentMonth]}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} className="p-2">
            <Svg width={16} height={16} viewBox="0 0 16 16">
              <Path d="M11.354 8.35403L6.35403 13.354C6.30757 13.4005 6.25242 13.4373 6.19173 13.4625C6.13103 13.4876 6.06598 13.5006 6.00028 13.5006C5.93458 13.5006 5.86953 13.4876 5.80883 13.4625C5.74813 13.4373 5.69298 13.4005 5.64653 13.354C5.60007 13.3076 5.56322 13.2524 5.53808 13.1917C5.51294 13.131 5.5 13.066 5.5 13.0003C5.5 12.9346 5.51294 12.8695 5.53808 12.8088C5.56322 12.7481 5.60007 12.693 5.64653 12.6465L10.2934 8.00028L5.64653 3.35403C5.55271 3.26021 5.5 3.13296 5.5 3.00028C5.5 2.8676 5.55271 2.74035 5.64653 2.64653C5.74035 2.55271 5.8676 2.5 6.00028 2.5C6.13296 2.5 6.26021 2.55271 6.35403 2.64653L11.354 7.64653C11.4005 7.69296 11.4374 7.74811 11.4626 7.80881C11.4877 7.86951 11.5007 7.93457 11.5007 8.00028C11.5007 8.06599 11.4877 8.13105 11.4626 8.19175C11.4374 8.25245 11.4005 8.30759 11.354 8.35403Z" fill="#FAFAFA" />
            </Svg>
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
          {getWeekDates().map((d) => {
            const key = formatDate(d);
            const isSelected = key === selectedDate;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => handleDateSelect(d)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  borderWidth: 0.5,
                  borderColor: '#FFDFEA',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                }}
              >
                <Text style={{ fontSize: 14, color: '#090909' }}>
                  {d.getDate()}
                </Text>
                {isSelected && (
                  <View style={{
                    position: 'absolute',
                    bottom: 4,
                    width: 5,
                    height: 5,
                    borderRadius: 2.5,
                    backgroundColor: '#FAFAFA',
                  }} />
                )}
              </TouchableOpacity>
            );
          })}
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
            <View key={entry.id} className="bg-[#FFE6EE] rounded-xl px-4 py-3 mb-3">
              {/* Title + mood */}
              <View className="flex-row items-center justify-between mb-1">
                {entry.title ? (
                  <Text className="text-[#1E1E1E] font-medium text-sm flex-1 mr-2">{entry.title}</Text>
                ) : <View className="flex-1" />}
                {entry.mood ? <Text className="text-lg">{MOOD_EMOJI[entry.mood] ?? ''}</Text> : null}
              </View>
              {/* Content preview */}
              {entry.content ? (
                <Text className="text-[#4D4D4D] text-xs" numberOfLines={2}>{entry.content}</Text>
              ) : null}
              {/* Symptom tags */}
              {entry.symptoms && entry.symptoms.length > 0 ? (
                <View className="flex-row flex-wrap gap-1 mt-2">
                  {entry.symptoms.map((tag, i) => (
                    <View key={i} className="px-2 py-0.5 bg-[#FFCCDD] rounded-full">
                      <Text className="text-[#090909] text-[10px]">{tag}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
              {/* Date + cycle day */}
              <View className="flex-row justify-between mt-2">
                <Text className="text-[#999] text-xs">{(entry.date ?? '').split('T')[0]}</Text>
                {entry.cycle_day ? (
                  <Text className="text-[#999] text-xs">Cycle day {entry.cycle_day}</Text>
                ) : null}
              </View>
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
          <Svg width={55} height={65} viewBox="0 0 55 65" fill="none">
            <Path d="M54.2688 18.2313L36.7688 0.731251C36.5364 0.499165 36.2606 0.31513 35.9571 0.18966C35.6536 0.0641895 35.3284 -0.000257465 35 7.72996e-07H5C3.67392 7.72996e-07 2.40215 0.526785 1.46447 1.46447C0.526784 2.40215 0 3.67392 0 5V60C0 61.3261 0.526784 62.5979 1.46447 63.5355C2.40215 64.4732 3.67392 65 5 65H50C51.3261 65 52.5979 64.4732 53.5355 63.5355C54.4732 62.5979 55 61.3261 55 60V20C55.0003 19.6716 54.9358 19.3464 54.8103 19.0429C54.6849 18.7394 54.5008 18.4636 54.2688 18.2313ZM37.5 8.53438L46.4656 17.5H37.5V8.53438ZM50 60H5V5H32.5V20C32.5 20.663 32.7634 21.2989 33.2322 21.7678C33.7011 22.2366 34.337 22.5 35 22.5H50V60ZM36.7688 34.2688L31.0344 40L36.7688 45.7312C37.001 45.9635 37.1853 46.2393 37.311 46.5428C37.4367 46.8462 37.5014 47.1715 37.5014 47.5C37.5014 47.8285 37.4367 48.1538 37.311 48.4572C37.1853 48.7607 37.001 49.0365 36.7688 49.2688C36.5365 49.501 36.2607 49.6853 35.9572 49.811C35.6538 49.9367 35.3285 50.0014 35 50.0014C34.6715 50.0014 34.3462 49.9367 34.0428 49.811C33.7393 49.6853 33.4635 49.501 33.2312 49.2688L27.5 43.5344L21.7688 49.2688C21.5365 49.501 21.2607 49.6853 20.9572 49.811C20.6538 49.9367 20.3285 50.0014 20 50.0014C19.6715 50.0014 19.3462 49.9367 19.0428 49.811C18.7393 49.6853 18.4635 49.501 18.2312 49.2688C17.999 49.0365 17.8147 48.7607 17.689 48.4572C17.5633 48.1538 17.4986 47.8285 17.4986 47.5C17.4986 47.1715 17.5633 46.8462 17.689 46.5428C17.8147 46.2393 17.999 45.9635 18.2312 45.7312L23.9656 40L18.2312 34.2688C17.7621 33.7996 17.4986 33.1634 17.4986 32.5C17.4986 31.8366 17.7621 31.2003 18.2312 30.7312C18.7003 30.2621 19.3366 29.9986 20 29.9986C20.6634 29.9986 21.2997 30.2621 21.7688 30.7312L27.5 36.4656L33.2312 30.7312C33.4635 30.499 33.7393 30.3147 34.0428 30.189C34.3462 30.0633 34.6715 29.9986 35 29.9986C35.3285 29.9986 35.6538 30.0633 35.9572 30.189C36.2607 30.3147 36.5365 30.499 36.7688 30.7312C37.001 30.9635 37.1853 31.2393 37.311 31.5428C37.4367 31.8462 37.5014 32.1715 37.5014 32.5C37.5014 32.8285 37.4367 33.1538 37.311 33.4572C37.1853 33.7607 37.001 34.0365 36.7688 34.2688Z" fill="white" />
          </Svg>

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
