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
    router.push("/add-entry");
  };

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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            height: 48,
            borderWidth: 0.5,
            borderColor: "#FFB3CD",
            borderRadius: 8,
          }}
        >
          <Feather name="search" size={16} color="#FAFAFA" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search here"
            placeholderTextColor="#FAFAFA"
            style={{ flex: 1, marginLeft: 8, color: "#FFFFFF", fontSize: 12 }}
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
            <Svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              style={{ transform: [{ scaleX: -1 }] }}
            >
              <Path
                d="M11.354 8.35403L6.35403 13.354C6.30757 13.4005 6.25242 13.4373 6.19173 13.4625C6.13103 13.4876 6.06598 13.5006 6.00028 13.5006C5.93458 13.5006 5.86953 13.4876 5.80883 13.4625C5.74813 13.4373 5.69298 13.4005 5.64653 13.354C5.60007 13.3076 5.56322 13.2524 5.53808 13.1917C5.51294 13.131 5.5 13.066 5.5 13.0003C5.5 12.9346 5.51294 12.8695 5.53808 12.8088C5.56322 12.7481 5.60007 12.693 5.64653 12.6465L10.2934 8.00028L5.64653 3.35403C5.55271 3.26021 5.5 3.13296 5.5 3.00028C5.5 2.8676 5.55271 2.74035 5.64653 2.64653C5.74035 2.55271 5.8676 2.5 6.00028 2.5C6.13296 2.5 6.26021 2.55271 6.35403 2.64653L11.354 7.64653C11.4005 7.69296 11.4374 7.74811 11.4626 7.80881C11.4877 7.86951 11.5007 7.93457 11.5007 8.00028C11.5007 8.06599 11.4877 8.13105 11.4626 8.19175C11.4374 8.25245 11.4005 8.30759 11.354 8.35403Z"
                fill="#FAFAFA"
              />
            </Svg>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-normal">
            {MONTHS[currentMonth]}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} className="p-2">
            <Svg width={16} height={16} viewBox="0 0 16 16">
              <Path
                d="M11.354 8.35403L6.35403 13.354C6.30757 13.4005 6.25242 13.4373 6.19173 13.4625C6.13103 13.4876 6.06598 13.5006 6.00028 13.5006C5.93458 13.5006 5.86953 13.4876 5.80883 13.4625C5.74813 13.4373 5.69298 13.4005 5.64653 13.354C5.60007 13.3076 5.56322 13.2524 5.53808 13.1917C5.51294 13.131 5.5 13.066 5.5 13.0003C5.5 12.9346 5.51294 12.8695 5.53808 12.8088C5.56322 12.7481 5.60007 12.693 5.64653 12.6465L10.2934 8.00028L5.64653 3.35403C5.55271 3.26021 5.5 3.13296 5.5 3.00028C5.5 2.8676 5.55271 2.74035 5.64653 2.64653C5.74035 2.55271 5.8676 2.5 6.00028 2.5C6.13296 2.5 6.26021 2.55271 6.35403 2.64653L11.354 7.64653C11.4005 7.69296 11.4374 7.74811 11.4626 7.80881C11.4877 7.86951 11.5007 7.93457 11.5007 8.00028C11.5007 8.06599 11.4877 8.13105 11.4626 8.19175C11.4374 8.25245 11.4005 8.30759 11.354 8.35403Z"
                fill="#FAFAFA"
              />
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
                  borderColor: "#FFDFEA",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "transparent",
                }}
              >
                <Text style={{ fontSize: 14, color: "#090909" }}>
                  {d.getDate()}
                </Text>
                {isSelected && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: 4,
                      width: 5,
                      height: 5,
                      borderRadius: 2.5,
                      backgroundColor: "#FAFAFA",
                    }}
                  />
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
          {/* Recent Entries header */}
          <View className="flex-row items-center justify-between mb-4">
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text
                style={{
                  fontFamily: "Inter",
                  fontWeight: "500",
                  fontSize: 16,
                  lineHeight: 24,
                  color: "#FFFFFF",
                }}
              >
                Recent Entries
              </Text>
              <Text
                style={{
                  fontFamily: "Inter",
                  fontWeight: "400",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {filteredEntries.length}/{totalCount}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(tabs)/all-entries-journal' as any)}>
              <Text
                style={{
                  fontFamily: "Inter",
                  fontWeight: "500",
                  fontSize: 14,
                  lineHeight: 20,
                  color: "#FFFFFF",
                }}
              >
                View all
              </Text>
            </TouchableOpacity>
          </View>

          {filteredEntries.map((entry) => {
            const dateStr = (entry.date ?? "").split("T")[0];
            const entryDate = dateStr ? new Date(dateStr + "T00:00:00") : null;
            const monthName = entryDate ? MONTHS[entryDate.getMonth()] : "";
            const dayNum = entryDate ? entryDate.getDate() : "";
            const dateLabel =
              monthName && dayNum
                ? `Date: ${monthName} ${dayNum}${entry.cycle_day ? `, Cycle Day ${entry.cycle_day}` : ""}`
                : "";
            const moodLabel = entry.mood
              ? (MOOD_LABEL[entry.mood] ?? entry.mood)
              : "";

            return (
              <TouchableOpacity
                key={entry.id}
                className="mb-4"
                style={{
                  backgroundColor: "#FFE6EE",
                  borderRadius: 12,
                  paddingVertical: 16,
                  paddingHorizontal: 12,
                }}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/view-entry",
                    params: { id: entry.id },
                  } as any)
                }
              >
                <View style={{ gap: 10 }}>
                  {/* Title row with chevron at top-right */}
                  <View className="flex-row items-start">
                    <Text
                      style={{
                        fontFamily: "Inter",
                        fontWeight: "600",
                        fontSize: 16,
                        lineHeight: 24,
                        color: "#1E1E1E",
                        flex: 1,
                      }}
                      numberOfLines={1}
                    >
                      {entry.title || entry.content?.slice(0, 40) || "Untitled"}
                    </Text>
                    <Feather
                      name="chevron-right"
                      size={18}
                      color="#888888"
                      style={{ marginTop: 3 }}
                    />
                  </View>

                  {/* Info rows */}
                  <View style={{ gap: 8 }}>
                    {/* Date row */}
                    {dateLabel ? (
                      <View
                        className="flex-row items-center"
                        style={{ gap: 8, minHeight: 20 }}
                      >
                        <Svg
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <Path
                            d="M13 2H11.5V1.5C11.5 1.36739 11.4473 1.24021 11.3536 1.14645C11.2598 1.05268 11.1326 1 11 1C10.8674 1 10.7402 1.05268 10.6464 1.14645C10.5527 1.24021 10.5 1.36739 10.5 1.5V2H5.5V1.5C5.5 1.36739 5.44732 1.24021 5.35355 1.14645C5.25979 1.05268 5.13261 1 5 1C4.86739 1 4.74021 1.05268 4.64645 1.14645C4.55268 1.24021 4.5 1.36739 4.5 1.5V2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V13C2 13.2652 2.10536 13.5196 2.29289 13.7071C2.48043 13.8946 2.73478 14 3 14H13C13.2652 14 13.5196 13.8946 13.7071 13.7071C13.8946 13.5196 14 13.2652 14 13V3C14 2.73478 13.8946 2.48043 13.7071 2.29289C13.5196 2.10536 13.2652 2 13 2ZM4.5 3V3.5C4.5 3.63261 4.55268 3.75979 4.64645 3.85355C4.74021 3.94732 4.86739 4 5 4C5.13261 4 5.25979 3.94732 5.35355 3.85355C5.44732 3.75979 5.5 3.63261 5.5 3.5V3H10.5V3.5C10.5 3.63261 10.5527 3.75979 10.6464 3.85355C10.7402 3.94732 10.8674 4 11 4C11.1326 4 11.2598 3.94732 11.3536 3.85355C11.4473 3.75979 11.5 3.63261 11.5 3.5V3H13V5H3V3H4.5ZM13 13H3V6H13V13ZM8.75 8.25C8.75 8.39834 8.70601 8.54334 8.6236 8.66668C8.54119 8.79001 8.42406 8.88614 8.28701 8.94291C8.14997 8.99967 7.99917 9.01453 7.85368 8.98559C7.7082 8.95665 7.57456 8.88522 7.46967 8.78033C7.36478 8.67544 7.29335 8.5418 7.26441 8.39632C7.23547 8.25083 7.25032 8.10003 7.30709 7.96299C7.36386 7.82594 7.45999 7.70881 7.58332 7.6264C7.70666 7.54399 7.85166 7.5 8 7.5C8.19891 7.5 8.38968 7.57902 8.53033 7.71967C8.67098 7.86032 8.75 8.05109 8.75 8.25ZM11.5 8.25C11.5 8.39834 11.456 8.54334 11.3736 8.66668C11.2912 8.79001 11.1741 8.88614 11.037 8.94291C10.9 8.99967 10.7492 9.01453 10.6037 8.98559C10.4582 8.95665 10.3246 8.88522 10.2197 8.78033C10.1148 8.67544 10.0434 8.5418 10.0144 8.39632C9.98547 8.25083 10.0003 8.10003 10.0571 7.96299C10.1139 7.82594 10.21 7.70881 10.3333 7.6264C10.4567 7.54399 10.6017 7.5 10.75 7.5C10.9489 7.5 11.1397 7.57902 11.2803 7.71967C11.421 7.86032 11.5 8.05109 11.5 8.25ZM6 10.75C6 10.8983 5.95601 11.0433 5.8736 11.1667C5.79119 11.29 5.67406 11.3861 5.53701 11.4429C5.39997 11.4997 5.24917 11.5145 5.10368 11.4856C4.9582 11.4566 4.82456 11.3852 4.71967 11.2803C4.61478 11.1754 4.54335 11.0418 4.51441 10.8963C4.48547 10.7508 4.50032 10.6 4.55709 10.463C4.61386 10.3259 4.70999 10.2088 4.83332 10.1264C4.95666 10.044 5.10166 10 5.25 10C5.44891 10 5.63968 10.079 5.78033 10.2197C5.92098 10.3603 6 10.5511 6 10.75ZM8.75 10.75C8.75 10.8983 8.70601 11.0433 8.6236 11.1667C8.54119 11.29 8.42406 11.3861 8.28701 11.4429C8.14997 11.4997 7.99917 11.5145 7.85368 11.4856C7.7082 11.4566 7.57456 11.3852 7.46967 11.2803C7.36478 11.1754 7.29335 11.0418 7.26441 10.8963C7.23547 10.7508 7.25032 10.6 7.30709 10.463C7.36386 10.3259 7.45999 10.2088 7.58332 10.1264C7.70666 10.044 7.85166 10 8 10C8.19891 10 8.38968 10.079 8.53033 10.2197C8.67098 10.3603 8.75 10.5511 8.75 10.75ZM11.5 10.75C11.5 10.8983 11.456 11.0433 11.3736 11.1667C11.2912 11.29 11.1741 11.3861 11.037 11.4429C10.9 11.4997 10.7492 11.5145 10.6037 11.4856C10.4582 11.4566 10.3246 11.3852 10.2197 11.2803C10.1148 11.1754 10.0434 11.0418 10.0144 10.8963C9.98547 10.7508 10.0003 10.6 10.0571 10.463C10.1139 10.3259 10.21 10.2088 10.3333 10.1264C10.4567 10.044 10.6017 10 10.75 10C10.9489 10 11.1397 10.079 11.2803 10.2197C11.421 10.3603 11.5 10.5511 11.5 10.75Z"
                            fill="#0134E4"
                          />
                        </Svg>
                        <Text
                          style={{
                            fontWeight: "500",
                            fontSize: 14,
                            lineHeight: 20,
                            color: "#1E1E1E",
                            flex: 1,
                          }}
                        >
                          {dateLabel}
                        </Text>
                      </View>
                    ) : null}

                    {/* Mood row */}
                    {moodLabel ? (
                      <View
                        className="flex-row items-center"
                        style={{ gap: 8, minHeight: 20 }}
                      >
                        <Feather name="smile" size={16} color="#FFBA00" />
                        <Text
                          style={{
                            fontWeight: "500",
                            fontSize: 14,
                            lineHeight: 20,
                            color: "#1E1E1E",
                          }}
                        >
                          Mood: {moodLabel}
                        </Text>
                      </View>
                    ) : null}

                    {/* Tags row */}
                    {entry.symptoms && entry.symptoms.length > 0 ? (
                      <View
                        className="flex-row items-center flex-wrap"
                        style={{ gap: 8, minHeight: 26 }}
                      >
                        <Feather name="tag" size={16} color="#F43B3B" />
                        <Text
                          style={{
                            fontWeight: "500",
                            fontSize: 14,
                            lineHeight: 20,
                            color: "#1E1E1E",
                          }}
                        >
                          Tags:
                        </Text>
                        {entry.symptoms.map((tag, i) => (
                          <View
                            key={i}
                            className="items-center justify-center"
                            style={{
                              backgroundColor: "#FFCCDD",
                              borderWidth: 0.5,
                              borderColor: "#FFE6EE",
                              borderRadius: 1000,
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                            }}
                          >
                            <Text
                              style={{
                                fontWeight: "400",
                                fontSize: 12,
                                lineHeight: 18,
                                color: "#090909",
                              }}
                            >
                              {tag}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null}

                    {/* Notes row */}
                    {entry.content ? (
                      <View className="flex-row items-start" style={{ gap: 8 }}>
                        <Svg
                          width={13}
                          height={13}
                          viewBox="0 0 13 13"
                          fill="none"
                          style={{ marginTop: 3 }}
                        >
                          <Path
                            d="M12.3537 2.14664L10.3537 0.146643C10.3073 0.100155 10.2522 0.0632755 10.1915 0.0381134C10.1308 0.0129512 10.0657 0 10 0C9.93429 0 9.86923 0.0129512 9.80853 0.0381134C9.74783 0.0632755 9.69269 0.100155 9.64625 0.146643L3.64625 6.14664C3.59983 6.19311 3.56303 6.24827 3.53793 6.30897C3.51284 6.36967 3.49995 6.43471 3.5 6.50039V8.50039C3.5 8.633 3.55268 8.76018 3.64645 8.85395C3.74021 8.94771 3.86739 9.00039 4 9.00039H6C6.06568 9.00044 6.13073 8.98755 6.19142 8.96246C6.25212 8.93737 6.30728 8.90056 6.35375 8.85414L12.3537 2.85414C12.4002 2.80771 12.4371 2.75256 12.4623 2.69186C12.4874 2.63116 12.5004 2.5661 12.5004 2.50039C12.5004 2.43469 12.4874 2.36962 12.4623 2.30892C12.4371 2.24822 12.4002 2.19308 12.3537 2.14664ZM5.79312 8.00039H4.5V6.70727L8.5 2.70727L9.79312 4.00039L5.79312 8.00039ZM10.5 3.29352L9.20687 2.00039L10 1.20727L11.2931 2.50039L10.5 3.29352ZM12 6.50039V11.5004C12 11.7656 11.8946 12.02 11.7071 12.2075C11.5196 12.395 11.2652 12.5004 11 12.5004H1C0.734783 12.5004 0.48043 12.395 0.292893 12.2075C0.105357 12.02 0 11.7656 0 11.5004V1.50039C0 1.23518 0.105357 0.980823 0.292893 0.793286C0.48043 0.60575 0.734783 0.500393 1 0.500393H6C6.13261 0.500393 6.25979 0.553072 6.35355 0.64684C6.44732 0.740608 6.5 0.867785 6.5 1.00039C6.5 1.133 6.44732 1.26018 6.35355 1.35395C6.25979 1.44771 6.13261 1.50039 6 1.50039H1V11.5004H11V6.50039C11 6.36778 11.0527 6.24061 11.1464 6.14684C11.2402 6.05307 11.3674 6.00039 11.5 6.00039C11.6326 6.00039 11.7598 6.05307 11.8536 6.14684C11.9473 6.24061 12 6.36778 12 6.50039Z"
                            fill="#A63ED1"
                          />
                        </Svg>
                        <Text
                          style={{
                            fontWeight: "500",
                            fontSize: 14,
                            lineHeight: 20,
                            color: "#1E1E1E",
                            flex: 1,
                          }}
                          numberOfLines={2}
                        >
                          Notes (preview): {entry.content}
                        </Text>
                      </View>
                    ) : null}
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
