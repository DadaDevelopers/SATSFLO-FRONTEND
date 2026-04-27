import { BottomNavigation } from "@/components/home/bottom-navigation";
import { useAddLog } from "@/context/add-log-context";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabName = "home" | "calendar" | "add" | "chat" | "settings";

interface DayData {
  day: number;
  cycleDay: number;
  isPeriod: boolean;
  isFertility: boolean;
  isOvulation: boolean;
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { date: paramDate } = useLocalSearchParams<{ date: string }>();
  const {
    getCurrentDayData,
    setSelectedDate: setContextSelectedDate,
  } = useAddLog();

  const todayDate = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(todayDate);
  const [selectedDate, setSelectedDate] = useState(todayDate.getDate());
  const currentMonthNum = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [activeTab, setActiveTab] = useState<TabName>("calendar");

  // Initialize from param if provided
  useEffect(() => {
    if (paramDate) {
      const d = new Date(paramDate);
      if (!isNaN(d.getTime())) {
        setCurrentDate(d);
        setSelectedDate(d.getDate());
        setContextSelectedDate(d);
      }
    } else {
      setContextSelectedDate(todayDate);
    }
  }, [paramDate, setContextSelectedDate, todayDate]);

  const handleDateSelect = (day: number) => {
    if (day === 0) return;
    setSelectedDate(day);
    const d = new Date(currentYear, currentMonthNum, day);
    setContextSelectedDate(d);
  };

  const dayLogs = getCurrentDayData();

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

  const generateMonthDays = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Padding for first week
    for (let i = 0; i < firstDay; i++) days.push({ day: 0 });

    // Days of month
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i });

    // Padding for last week
    while (days.length % 7 !== 0) days.push({ day: 0 });

    return days;
  };

  const monthDays = generateMonthDays(currentMonthNum, currentYear);
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

  const getDayInfo = (day: number): DayData => {
    if (day === 0)
      return {
        day: 0,
        cycleDay: 0,
        isPeriod: false,
        isFertility: false,
        isOvulation: false,
      };

    // Calculate cycle day (simplified - in real app would be calculated from period start)
    const cycleDay = day <= 11 ? day + 7 : day - 11;

    const isPeriod =
      day >= cycleData.periodStart &&
      day < cycleData.periodStart + cycleData.periodLength;
    const isFertility =
      day >= cycleData.fertilityStart &&
      day <= cycleData.fertilityEnd &&
      !isPeriod;
    const isOvulation = day === cycleData.ovulationDay;

    return { day, cycleDay, isPeriod, isFertility, isOvulation };
  };

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        router.push("/");
        break;
      case "add":
        router.push("/add-log" as any);
        break;
      case "chat":
        router.push("/(tabs)/thread" as any);
        break;
      case "settings":
        router.push("/(tabs)/settings" as any);
        break;
      default:
        break;
    }
  };

  const handleEditPeriod = () => {
    // Open edit period modal or navigate to edit screen
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View
      className="flex-1 bg-[#FF4081] text-[#FAFAFA]"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 mt-6">
        {/* Blood Drop Icon */}
        <View className="w-10 h-10 rounded-full border border-dashed border-[#CC0045] items-center justify-center">
          <FontAwesome5 name="tint" size={20} color="#CC0045" />
        </View>

        {/* Month Title */}
        <View className="items-center">
          <Text className="text-sm font-inter text-white opacity-80 uppercase tracking-widest mb-1">
            {new Date(
              currentYear,
              currentMonthNum,
              selectedDate,
            ).toDateString() === todayDate.toDateString()
              ? "Today's Status"
              : "Log Summary"}
          </Text>
          <Text className="text-2xl font-inter font-bold text-white tracking-tight">
            {MONTHS[currentMonthNum]} {selectedDate}
          </Text>
        </View>

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
                <Text className="text-sm font-inter text-white font-medium">
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar Days */}
          <View className="flex-row flex-wrap font-inter text-[#FAFAFA]">
            {monthDays.map((item, index) => {
              const dayInfo = getDayInfo(item.day);
              const isSelected = item.day === selectedDate;
              const isToday =
                item.day === todayDate.getDate() &&
                currentMonthNum === todayDate.getMonth() &&
                currentYear === todayDate.getFullYear();

              return (
                <Pressable
                  key={index}
                  onPress={() => handleDateSelect(item.day)}
                  className={`w-[14.28%] h-14 items-center justify-center relative ${
                    dayInfo.isPeriod ? "bg-[#CC0045]" : ""
                  } ${isSelected && !dayInfo.isPeriod ? "bg-[#FF669A] rounded-xl" : ""} ${
                    isToday && !isSelected
                      ? "border-2 border-[#FFB2CD] rounded-xl"
                      : ""
                  }`}
                >
                  {item.day > 0 && (
                    <>
                      {/* Cycle Day Number (small) */}
                      <Text
                        className={`absolute top-1 right-2 text-[8px] font-inter ${
                          dayInfo.isPeriod
                            ? "text-[#FFB2CC]"
                            : dayInfo.isFertility
                              ? "text-[#8027A5]"
                              : "text-[#FFCCDD]"
                        }`}
                      >
                        {dayInfo.cycleDay}
                      </Text>

                      {/* Day Number */}
                      <Text
                        className={`text-base font-inter ${
                          dayInfo.isPeriod
                            ? "text-white font-bold"
                            : isToday
                              ? "text-white font-bold"
                              : "text-[#FAFAFA]"
                        }`}
                      >
                        {item.day}
                      </Text>

                      {/* Fertility/Ovulation Indicator */}
                      {dayInfo.isFertility && !dayInfo.isOvulation && (
                        <View className="absolute bottom-1.5">
                          <MaterialCommunityIcons
                            name="cards-heart"
                            size={10}
                            color="#8027A5"
                          />
                        </View>
                      )}
                      {dayInfo.isOvulation && (
                        <View className="absolute bottom-1.5">
                          <MaterialCommunityIcons
                            name="cards-heart"
                            size={10}
                            color="#FFD700"
                          />
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
        <View className="flex-row items-center justify-between mt-8 px-5">
          <View>
            <Text className="text-xl font-bold font-inter text-[#FAFAFA]">
              {MONTHS[currentMonthNum].substring(0, 3)} {selectedDate}
            </Text>
            <Text className="text-sm font-inter text-[#FAFAFA] opacity-90">
              Cycle day {cycleData.currentCycleDay}
            </Text>
          </View>

          <Pressable
            onPress={handleEditPeriod}
            className="px-4 py-2 border border-[#FFB4CD] rounded-full bg-white/10"
          >
            <Text className="text-xs font-inter font-semibold text-white">
              Edit Period
            </Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-[#FFB2CD] mx-5 my-6 opacity-30" />

        {/* Pregnancy Chance */}
        <View className="px-5 mb-4">
          <Text className="text-sm font-inter text-white bg-white/10 self-start px-3 py-1 rounded-full">
            <Text className="font-bold">Medium</Text> chance of getting pregnant
          </Text>
        </View>

        {/* Legend */}
        <View className="flex-row items-center justify-between px-5 mb-6">
          {/* Period Days */}
          <View className="items-center gap-1 flex-1">
            <View className="w-4 h-4 rounded-full bg-[#CC0045]" />
            <Text className="text-[10px] font-inter text-white text-center">
              Period days
            </Text>
          </View>

          {/* Fertility Window */}
          <View className="items-center gap-1 flex-1">
            <MaterialCommunityIcons
              name="cards-heart"
              size={16}
              color="#8027A5"
            />
            <Text className="text-[10px] font-inter text-white text-center">
              Fertility window
            </Text>
          </View>

          {/* Ovulation Day */}
          <View className="items-center gap-1 flex-1">
            <MaterialCommunityIcons
              name="cards-heart"
              size={16}
              color="#FFD700"
            />
            <Text className="text-[10px] font-inter text-white text-center">
              Ovulation Day
            </Text>
          </View>
        </View>

        {/* Health Log Summary Card */}
        <View className="px-5 mb-10">
          <View className="bg-white/15 rounded-3xl p-6 border border-white/20 shadow-xl">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-white font-inter font-bold text-xl">
                Daily Health Log
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/add-log",
                    params: {
                      date: `${currentYear}-${String(currentMonthNum + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`,
                    },
                  } as any)
                }
              >
                <Feather name="edit-3" size={20} color="white" />
              </Pressable>
            </View>

            {dayLogs.flowLevel ||
            dayLogs.note ||
            dayLogs.moods.length > 0 ||
            dayLogs.symptoms.length > 0 ||
            dayLogs.waterIntake > 0 ||
            dayLogs.weight ||
            dayLogs.temperature ? (
              <View className="gap-6">
                {/* 1. Vertical List Style - Now at the Top */}
                <View className="gap-6">
                  {/* Flow */}
                  {dayLogs.flowLevel && (
                    <View className="flex-row items-center gap-4">
                      <FontAwesome5 name="tint" size={22} color="white" />
                      <Text className="text-white text-xl font-bold capitalize">
                        Flow: {dayLogs.flowLevel}
                      </Text>
                    </View>
                  )}

                  {/* Moods */}
                  {dayLogs.moods.length > 0 && (
                    <View className="flex-row items-center gap-4">
                      <MaterialCommunityIcons
                        name="emoticon-outline"
                        size={24}
                        color="white"
                        opacity={0.9}
                      />
                      <View className="flex-row flex-wrap gap-2">
                        {dayLogs.moods.map((m) => (
                          <View
                            key={m}
                            className="bg-[#FF4D4D] px-4 py-1.5 rounded-xl"
                          >
                            <Text className="text-white text-sm font-inter capitalize font-bold">
                              {m}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Symptoms */}
                  {dayLogs.symptoms.length > 0 && (
                    <View className="flex-row items-center gap-4">
                      <MaterialCommunityIcons
                        name="pulse"
                        size={24}
                        color="white"
                        opacity={0.9}
                      />
                      <View className="flex-row flex-wrap gap-2">
                        {dayLogs.symptoms.map((s) => (
                          <View
                            key={s}
                            className="bg-[#8A2BE2] px-4 py-1.5 rounded-xl"
                          >
                            <Text className="text-white text-sm font-inter capitalize font-bold">
                              {s}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Medicine */}
                  {dayLogs.medicine && dayLogs.medicine.length > 0 && (
                    <View className="flex-row items-center gap-4">
                      <Feather
                        name="paperclip"
                        size={22}
                        color="white"
                        opacity={0.9}
                      />
                      <View className="flex-row flex-wrap gap-4">
                        {dayLogs.medicine.map((med) => (
                          <Text
                            key={med}
                            className="text-white text-lg font-bold capitalize"
                          >
                            {med}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                {/* Divider */}
                <View className="h-[1px] bg-white/20" />
                {/* 2. Three Circular Icons Arrangement - Now Below Pill */}
                <View className="flex-row justify-between items-start">
                  {/* Weight */}
                  <View className="items-center flex-1">
                    <View className="w-16 h-16 rounded-full border border-white items-center justify-center mb-2">
                      <Image
                        source={require("@/assets/images/weight-icon.svg")}
                        style={{ width: 45, height: 45 }}
                        resizeMode="contain"
                      />
                    </View>
                    <Text className="text-white text-lg font-bold">
                      {dayLogs.weight ? `${dayLogs.weight}` : "--"}{" "}
                      <Text className="text-[10px] font-normal">
                        {dayLogs.weightUnit}
                      </Text>
                    </Text>
                    <Text className="text-white/70 text-[10px] mt-0.5">
                      Weight
                    </Text>
                  </View>

                  {/* Temperature */}
                  <View className="items-center flex-1">
                    <View className="w-16 h-16 rounded-full border border-white items-center justify-center mb-2">
                      <Image
                        source={require("@/assets/images/temperature-icon.svg")}
                        style={{ width: 45, height: 45 }}
                        resizeMode="contain"
                      />
                    </View>
                    <Text className="text-white text-lg font-bold">
                      {dayLogs.temperature ? `${dayLogs.temperature}` : "--"}{" "}
                      <Text className="text-[10px] font-normal">
                        °{dayLogs.temperatureUnit}
                      </Text>
                    </Text>
                    <Text className="text-white/70 text-[10px] mt-0.5">
                      Temperature
                    </Text>
                  </View>

                  {/* Water */}
                  <View className="items-center flex-1">
                    <View className="w-16 h-16 rounded-full border border-white items-center justify-center mb-2">
                      <Image
                        source={require("@/assets/images/water-icon.svg")}
                        style={{ width: 45, height: 45 }}
                        resizeMode="contain"
                      />
                    </View>
                    <Text className="text-white text-lg font-bold">
                      {dayLogs.waterIntake}{" "}
                      <Text className="text-[10px] font-normal">ml</Text>
                    </Text>
                    <Text className="text-white/70 text-[10px] mt-0.5">
                      Drink Water
                    </Text>
                  </View>
                </View>

                {/* Note */}
                {dayLogs.note && (
                  <View className="mt-2 p-4 bg-white/5 rounded-2xl border-l-2 border-white/30">
                    <Text className="text-white text-sm font-inter italic leading-relaxed opacity-80">
                      {'"'}{dayLogs.note}{'"'}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View className="items-center py-6">
                <View className="w-16 h-16 rounded-full bg-white/10 items-center justify-center mb-3">
                  <Feather
                    name="file-text"
                    size={24}
                    color="white"
                    opacity={0.5}
                  />
                </View>
                <Text className="text-white opacity-60 text-sm font-inter mb-4">
                  No health logs found for this date
                </Text>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/add-log",
                      params: {
                        date: `${currentYear}-${String(currentMonthNum + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`,
                      },
                    } as any)
                  }
                  className="bg-white px-6 py-2 rounded-full"
                >
                  <Text className="text-[#FF4081] text-sm font-bold font-inter">
                    Add Log
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* Scroll Indicator */}
        <View className="items-center mb-8">
          <Text className="text-[10px] font-inter text-[#FFB3CD] uppercase tracking-widest">
            Keep Logging Daily
          </Text>
          <Feather
            name="chevron-down"
            size={20}
            color="#FFB3CD"
            style={{ marginTop: 4 }}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}
