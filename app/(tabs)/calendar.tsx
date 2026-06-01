import { BottomNavigation } from "@/components/home/bottom-navigation";
import { useAddLog } from "@/context/add-log-context";
import { api } from "@/lib/api";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlowDroplet, flowLevelLabel } from "@/components/add-log/flow-droplet";
import { SvgXml } from "react-native-svg";

const SYMPTOM_IMAGES: Record<string, any> = {
  cramps: require("@/assets/images/cramps.png"),
  fatigue: require("@/assets/images/fatigue.png"),
  bloating: require("@/assets/images/bloating.png"),
  headache: require("@/assets/images/headache.png"),
  bellyAches: require("@/assets/images/bellyaches.png"),
  acne: require("@/assets/images/acne.png"),
  soreBreasts: require("@/assets/images/sorebreasts.png"),
  cravings: require("@/assets/images/cravings.png"),
};

const MEDICINE_IMAGES: Record<string, any> = {
  condom: require("@/assets/images/condom.png"),
  pill: require("@/assets/images/pill.png"),
  patch: require("@/assets/images/patch.png"),
  iud: require("@/assets/images/IUD.png"),
  implant: require("@/assets/images/implant.png"),
  vRing: require("@/assets/images/V-ring.png"),
  injection: require("@/assets/images/injection.png"),
  spermicide: require("@/assets/images/spermicide.png"),
};

const weightIconXml = `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.7" y="0.7" width="68.6" height="68.6" rx="34.3" stroke="#FFE4ED" stroke-width="1.4"/>
  <rect x="22" y="25" width="26" height="20" rx="3" fill="#8ECAE6" />
  <circle cx="35" cy="30" r="4" fill="#E9ECEF" />
  <rect x="25" y="28" width="20" height="2" rx="1" fill="#219EBC" />
</svg>`;

const temperatureIconXml = `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.7" y="0.7" width="68.6" height="68.6" rx="34.3" stroke="#FFE4ED" stroke-width="1.4"/>
  <path d="M45 25L30 45C30 45 28 47 25 45C22 43 24 40 24 40L39 20L45 25Z" fill="#E63946" />
  <circle cx="25" cy="45" r="5" fill="#E63946" />
  <rect x="32" y="32" width="8" height="2" transform="rotate(-53 32 32)" fill="white" opacity="0.5" />
</svg>`;

const waterIconXml = `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.7" y="0.7" width="68.6" height="68.6" rx="34.3" stroke="#FFE4ED" stroke-width="1.4"/>
<path d="M22.2817 19.5411C22.2043 18.8251 22.7653 18.2002 23.4855 18.2002H46.5177C47.2379 18.2002 47.7989 18.8251 47.7215 19.5411L44.3508 50.7195C44.2844 51.3343 43.7654 51.8002 43.147 51.8002H26.8561C26.2378 51.8002 25.7188 51.3343 25.6523 50.7195L22.2817 19.5411Z" fill="#BBCAFF"/>
<path d="M23.043 21.8321C23.043 21.8321 28.2156 21.3134 31.5186 21.8323C34.7571 22.341 36.119 23.7193 39.3889 23.9511C42.5966 24.1784 46.9565 21.8321 46.9565 21.8321L44.2322 51.7997H25.7673L23.043 21.8321Z" fill="#4770FD"/>
<circle cx="29.0976" cy="32.7294" r="0.605405" fill="#D9D9D9"/>
<circle cx="40.2987" cy="37.2704" r="0.908108" fill="#D9D9D9"/>
<circle cx="36.0624" cy="41.5077" r="0.605405" fill="#D9D9D9"/>
<circle cx="39.6933" cy="45.746" r="0.908108" fill="#D9D9D9"/>
<circle cx="35.457" cy="34.2431" r="0.605405" fill="#D9D9D9"/>
</svg>`;

const moodEmojis: Record<string, string> = {
  normal: "😐",
  happy: "😊",
  calm: "😌",
  hyped: "🤩",
  inLove: "😍",
  peaceful: "😇",
  lonely: "😢",
  angry: "😠",
  silly: "😜",
  sad: "😔",
  relaxed: "🙂",
};

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
    isDateInPeriod,
    setSelectedDate: setContextSelectedDate,
    dayLogs: allDayLogs,
    selectedDate: contextSelectedDate,
  } = useAddLog();

  const todayDate = new Date();
  const selectedDate = contextSelectedDate.getDate();
  const currentMonthNum = contextSelectedDate.getMonth();
  const currentYear = contextSelectedDate.getFullYear();

  const [activeTab, setActiveTab] = useState<TabName>("calendar");

  // Initialize from param if provided
  useEffect(() => {
    if (paramDate) {
      const parts = paramDate.split("-");
      if (parts.length === 3) {
        const d = new Date(
          parseInt(parts[0]),
          parseInt(parts[1]) - 1,
          parseInt(parts[2]),
        );
        if (!isNaN(d.getTime())) {
          setContextSelectedDate(d);
        }
      }
    }
  }, [paramDate, setContextSelectedDate]);

  const handleDateSelect = (day: number) => {
    if (day === 0) return;
    const cellDate = new Date(currentYear, currentMonthNum, day);
    setContextSelectedDate(cellDate);
  };

  // Memoize current day logs to ensure reactivity when allDayLogs updates
  const dayLogs = React.useMemo(() => {
    const key = `${currentYear}-${String(currentMonthNum + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
    // Merge defaults first so partial/old-format cached entries never leave
    // symptoms/moods/medicine undefined — accessing .length on undefined crashes the render.
    const defaults = {
      flowLevel: null as null,
      periodStart: false,
      periodEnd: false,
      symptoms: [] as string[],
      moods: [] as string[],
      medicine: [] as string[],
      note: "",
      weight: "",
      weightUnit: "kg" as "kg" | "lb",
      temperature: "",
      temperatureUnit: "C" as "C" | "F",
      waterIntake: 0,
    };
    return { ...defaults, ...(allDayLogs[key] || {}) };
  }, [allDayLogs, selectedDate, currentMonthNum, currentYear]);

  const [cycleData, setCycleData] = useState({
    cycleLength: 28,
    periodLength: 5,
    ovulationDay: 14,
    fertilityStart: 9,
    fertilityEnd: 15,
    currentCycleDay: 1,
    lastPeriodDate: todayDate,
  });

  useFocusEffect(
    useCallback(() => {
      const loadCycleData = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) return;
        try {
          const { response: profileRes, data: profileData } = await api.get(
            "/cycle-profile",
            token,
          );
          const { response: currentRes, data: currentData } = await api.get(
            "/cycles/current",
            token,
          );

          let pLength = 5;
          let cLength = 28;
          let lastPDate = new Date();
          let cDay = 1;

          const pd = profileData?.data ?? profileData;
          if (profileRes.ok && pd) {
            pLength = pd.period_length || 5;
            cLength = pd.cycle_length || 28;
            if (pd.last_period_start) {
              const parts = pd.last_period_start.split("-");
              if (parts.length === 3) {
                lastPDate = new Date(
                  parseInt(parts[0]),
                  parseInt(parts[1]) - 1,
                  parseInt(parts[2]),
                );
              }
            }
          }

          if (currentRes.ok && currentData?.data) {
            cDay = currentData.data.current_day || 1;
            if (currentData.data.last_period_start) {
              const parts = currentData.data.last_period_start.split("-");
              if (parts.length === 3) {
                lastPDate = new Date(
                  parseInt(parts[0]),
                  parseInt(parts[1]) - 1,
                  parseInt(parts[2]),
                );
              }
            }
          }

          const ovulation = cLength - 14;
          const fertStart = ovulation - 5;
          const fertEnd = ovulation + 1;

          setCycleData({
            cycleLength: cLength,
            periodLength: pLength,
            ovulationDay: ovulation,
            fertilityStart: fertStart,
            fertilityEnd: fertEnd,
            currentCycleDay: cDay,
            lastPeriodDate: lastPDate,
          });
        } catch (e) {
          console.error(e);
        }
      };
      loadCycleData();
    }, []),
  );

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

    // Calculate cycle day based on difference from last period start
    const cellDate = new Date(currentYear, currentMonthNum, day);
    const utc1 = Date.UTC(
      cellDate.getFullYear(),
      cellDate.getMonth(),
      cellDate.getDate(),
    );
    const utc2 = Date.UTC(
      cycleData.lastPeriodDate.getFullYear(),
      cycleData.lastPeriodDate.getMonth(),
      cycleData.lastPeriodDate.getDate(),
    );
    const diffDays = Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
    // Use positive modulo so dates before lastPeriodDate wrap correctly instead of going negative.
    const cycleDay = ((diffDays % cycleData.cycleLength) + cycleData.cycleLength) % cycleData.cycleLength + 1;

    // Use context's isDateInPeriod for real-time reflection of changes
    const isPeriod = isDateInPeriod(cellDate);
    const isFertility =
      cycleDay >= cycleData.fertilityStart &&
      cycleDay <= cycleData.fertilityEnd &&
      !isPeriod;
    const isOvulation = cycleDay === cycleData.ovulationDay;

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
    router.push({
      pathname: "/(auth)/last-period",
      params: { isEdit: "true" },
    });
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

        {/* Log Summary */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, gap: 24, marginTop: 8 }}>

          {/* Date Header */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ gap: 4 }}>
              <Text style={{ fontWeight: "600", fontSize: 16, color: "#FFFFFF" }}>
                {MONTHS[currentMonthNum].substring(0, 3)} {selectedDate}
              </Text>
              <Text style={{ fontWeight: "400", fontSize: 14, color: "#FAFAFA" }}>
                Cycle day {getDayInfo(selectedDate).cycleDay}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Pressable
                onPress={() => router.push({ pathname: "/add-log", params: { date: `${currentYear}-${String(currentMonthNum + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}` } } as any)}
              >
                <Feather name="edit-3" size={18} color="#FFFFFF" />
              </Pressable>
              <Pressable
                onPress={handleEditPeriod}
                style={{ borderWidth: 1, borderColor: "#FFB4CD", borderRadius: 20, paddingVertical: 10, paddingHorizontal: 12 }}
              >
                <Text style={{ fontWeight: "500", fontSize: 12, color: "#FFFFFF" }}>Edit Period</Text>
              </Pressable>
            </View>
          </View>

          {/* Divider + Pregnancy Chance */}
          <View style={{ gap: 16 }}>
            <View style={{ height: 0.5, backgroundColor: "#FF99BC" }} />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#FF4081" }} />
              <Text style={{ fontWeight: "500", fontSize: 14, color: "#FFFFFF", letterSpacing: -0.14 }}>
                Medium - Chance of getting pregnant
              </Text>
            </View>
          </View>

          {/* Legend */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ alignItems: "center", gap: 4, flex: 1 }}>
              <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#CC0045" }} />
              <Text style={{ fontSize: 10, color: "#FFFFFF", textAlign: "center" }}>Period days</Text>
            </View>
            <View style={{ alignItems: "center", gap: 4, flex: 1 }}>
              <MaterialCommunityIcons name="cards-heart" size={16} color="#8027A5" />
              <Text style={{ fontSize: 10, color: "#FFFFFF", textAlign: "center" }}>Fertility window</Text>
            </View>
            <View style={{ alignItems: "center", gap: 4, flex: 1 }}>
              <MaterialCommunityIcons name="cards-heart" size={16} color="#FFD700" />
              <Text style={{ fontSize: 10, color: "#FFFFFF", textAlign: "center" }}>Ovulation Day</Text>
            </View>
          </View>

          {/* Log Sections */}
          <View style={{ gap: 20 }}>

            {/* Flow — always visible */}
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ fontWeight: "500", fontSize: 14, color: "#FFFFFF", letterSpacing: -0.14 }}>Flow</Text>
                <View style={{ flex: 1, height: 0.5, backgroundColor: "#FF99BC" }} />
              </View>
              {dayLogs.flowLevel ? (
                <View style={{ alignItems: "center", gap: 4, width: 60 }}>
                  <FlowDroplet level={dayLogs.flowLevel} selected={false} fillColor="#FF0057" />
                  <Text style={{ fontWeight: "400", fontSize: 14, color: "#FAFAFA" }}>
                    {flowLevelLabel(dayLogs.flowLevel)}
                  </Text>
                </View>
              ) : (
                <Text style={{ fontWeight: "400", fontSize: 14, color: "rgba(250,250,250,0.4)" }}>--</Text>
              )}
            </View>

            {/* Symptoms */}
            {dayLogs.symptoms.length > 0 && (
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ fontWeight: "500", fontSize: 14, color: "#FFFFFF", letterSpacing: -0.14 }}>Symptoms</Text>
                  <View style={{ flex: 1, height: 0.5, backgroundColor: "#FF99BC" }} />
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 24 }}>
                  {dayLogs.symptoms.map((s) => (
                    <View key={s} style={{ alignItems: "center", gap: 4, width: 50 }}>
                      <View style={{ width: 50, height: 50, borderRadius: 1000, backgroundColor: "#FFE4ED", alignItems: "center", justifyContent: "center" }}>
                        <Image source={SYMPTOM_IMAGES[s]} style={{ width: 24, height: 24 }} resizeMode="contain" />
                      </View>
                      <Text style={{ fontSize: 14, color: "#FFFFFF", textAlign: "center" }} numberOfLines={1}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Moods */}
            {dayLogs.moods.length > 0 && (
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ fontWeight: "500", fontSize: 14, color: "#FFFFFF", letterSpacing: -0.14 }}>Moods</Text>
                  <View style={{ flex: 1, height: 0.5, backgroundColor: "#FF99BC" }} />
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 24 }}>
                  {dayLogs.moods.map((m) => (
                    <View key={m} style={{ alignItems: "center", gap: 4, width: 50 }}>
                      <View style={{ width: 50, height: 50, borderRadius: 1000, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#FFE4ED", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 24 }}>{moodEmojis[m]}</Text>
                      </View>
                      <Text style={{ fontSize: 14, color: "#FFFFFF", textAlign: "center" }} numberOfLines={1}>
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Medicine — always visible */}
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ fontWeight: "500", fontSize: 14, color: "#FFFFFF", letterSpacing: -0.14 }}>Medicine</Text>
                <View style={{ flex: 1, height: 0.5, backgroundColor: "#FF99BC" }} />
              </View>
              {dayLogs.medicine && dayLogs.medicine.length > 0 ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 24 }}>
                  {dayLogs.medicine.map((med) => (
                    <View key={med} style={{ alignItems: "center", gap: 4, width: 60 }}>
                      <View style={{ width: 60, height: 60, borderRadius: 1000, borderWidth: 0.681818, borderColor: "#FFDFEA", alignItems: "center", justifyContent: "center" }}>
                        <Image source={MEDICINE_IMAGES[med]} style={{ width: 32, height: 32 }} resizeMode="contain" />
                      </View>
                      <Text style={{ fontSize: 14, color: "#FAFAFA", textAlign: "center" }} numberOfLines={2}>
                        {med.charAt(0).toUpperCase() + med.slice(1)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={{ fontWeight: "400", fontSize: 14, color: "rgba(250,250,250,0.4)" }}>--</Text>
              )}
            </View>

            {/* Note */}
            {!!dayLogs.note && (
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ fontWeight: "500", fontSize: 14, color: "#FFFFFF", letterSpacing: -0.14 }}>Note</Text>
                  <View style={{ flex: 1, height: 0.5, backgroundColor: "#FF99BC" }} />
                </View>
                <Text style={{ fontWeight: "400", fontSize: 14, color: "#FAFAFA" }}>
                  {dayLogs.note}
                </Text>
              </View>
            )}

            {/* Empty state — shown when no symptoms, moods, or note */}
            {dayLogs.symptoms.length === 0 && dayLogs.moods.length === 0 && !dayLogs.note && (
              <View style={{ alignItems: "center", paddingVertical: 16 }}>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>No health logs for this date</Text>
                <Pressable
                  onPress={() => router.push({ pathname: "/add-log", params: { date: `${currentYear}-${String(currentMonthNum + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}` } } as any)}
                  style={{ marginTop: 12, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 }}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "500" }}>Add Log</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Weight / Temp / Water */}
          <View style={{ gap: 16, alignItems: "center" }}>
            <View style={{ height: 0.5, backgroundColor: "#FF99BC", alignSelf: "stretch" }} />
            <View style={{ flexDirection: "row", gap: 40, alignItems: "flex-start", justifyContent: "center" }}>
              {/* Weight */}
              <View style={{ alignItems: "center", gap: 4 }}>
                <SvgXml xml={weightIconXml} width={70} height={70} />
                <Text style={{ fontWeight: "500", fontSize: 16, color: "#FAFAFA" }}>
                  {dayLogs.weight ? `${dayLogs.weight} ${dayLogs.weightUnit}` : "--"}
                </Text>
                <Text style={{ fontWeight: "400", fontSize: 12, color: "#FAFAFA" }}>Weight</Text>
              </View>
              {/* Temperature */}
              <View style={{ alignItems: "center", gap: 4 }}>
                <SvgXml xml={temperatureIconXml} width={70} height={70} />
                <Text style={{ fontWeight: "500", fontSize: 16, color: "#FAFAFA" }}>
                  {dayLogs.temperature ? `${dayLogs.temperature} °${dayLogs.temperatureUnit}` : "--"}
                </Text>
                <Text style={{ fontWeight: "400", fontSize: 12, color: "#FAFAFA" }}>Temperature</Text>
              </View>
              {/* Water */}
              <View style={{ alignItems: "center", gap: 4 }}>
                <SvgXml xml={waterIconXml} width={70} height={70} />
                <Text style={{ fontWeight: "500", fontSize: 16, color: "#FAFAFA" }}>
                  {dayLogs.waterIntake ? `${dayLogs.waterIntake} ml` : "--"}
                </Text>
                <Text style={{ fontWeight: "400", fontSize: 12, color: "#FAFAFA" }}>Drink Water</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}
