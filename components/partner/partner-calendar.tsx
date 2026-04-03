import { PartnerBottomNavigation } from "@/components/home/partner-bottom-navigation";
import { api } from "@/lib/api";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  default as React,
  default as React,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabName = "home" | "calendar" | "settings";

interface CalendarDay {
  date: string; // "YYYY-MM-DD"
  is_period: boolean;
  is_fertile: boolean;
  is_ovulation: boolean;
  cycle_day?: number;
}

export default function PartnerCalendarScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabName>("calendar");

  // Data state
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [partnerNickname, setPartnerNickname] = useState("Babe");

  // UI state
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async (month: Date) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        setErrorMessage("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      const [partnerRes, calRes] = await Promise.all([
        api.get("/partner", token),
        api.get("/partner/calendar", token),
      ]);

      if (partnerRes.response.ok) {
        const d = partnerRes.data?.data ?? partnerRes.data;
        if (d?.partner_nickname) setPartnerNickname(d.partner_nickname);
      }

      if (calRes.response.ok) {
        const c = calRes.data?.data ?? calRes.data;
        const days: CalendarDay[] = Array.isArray(c) ? c : [];
        setCalendarDays(days);
      } else {
        const msg = calRes.data?.message ?? "";
        if (
          msg.toLowerCase().includes("not shared") ||
          msg.toLowerCase().includes("permission")
        ) {
          setErrorMessage("Your partner hasn't shared their calendar yet.");
        } else {
          setErrorMessage(msg || "Failed to load calendar.");
        }
      }
    } catch {
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentMonth);
  }, [fetchData, currentMonth]);

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        router.push("/partner" as any);
        break;
      case "settings":
        router.push("/partner/settings" as any);
        break;
      case "calendar":
        break;
    }
  };

  const handleGiftTokenPress = () => {
    router.push("/(tabs)/gift-token-wallet");
  };

  // Build a lookup map for quick access
  const dayMap = new Map<number, CalendarDay>();
  calendarDays.forEach((d) => {
    const date = new Date(d.date);
    if (
      date.getFullYear() === currentMonth.getFullYear() &&
      date.getMonth() === currentMonth.getMonth()
    ) {
      dayMap.set(date.getDate(), d);
    }
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Build grid (0 = empty padding)
  const grid: number[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) grid.push(0);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  while (grid.length % 7 !== 0) grid.push(0);

  const navigateMonth = (dir: -1 | 1) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + dir);
      return next;
    });
  };

  return (
    <LinearGradient
      colors={["#4B0082", "#16051E"]}
      className="flex-1"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#4B0082" />

      {/* Header */}
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Month/Year Pill with nav arrows */}
        <View className="flex-1 items-center mr-6">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => navigateMonth(-1)} className="p-1">
              <Feather name="chevron-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View className="flex-row bg-white rounded-full overflow-hidden items-center justify-center">
              <View className="px-4 py-1.5 bg-white">
                <Text className="text-[#1E1E1E] text-[15px] font-medium">
                  {monthName}
                </Text>
              </View>
              <View className="px-4 py-1.5 bg-[#FF4081]">
                <Text className="text-white text-[15px] font-medium">
                  {year}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigateMonth(1)} className="p-1">
              <Feather name="chevron-right" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="items-center justify-center mt-20 py-10">
            <ActivityIndicator size="large" color="#B551E5" />
            <Text className="text-white mt-4 text-base">
              Loading {partnerNickname}'s calendar…
            </Text>
          </View>
        ) : errorMessage ? (
          <View className="items-center justify-center mt-20 px-8">
            <Feather name="lock" size={48} color="rgba(181,81,229,0.6)" />
            <Text className="text-white text-center mt-4 text-base leading-6">
              {errorMessage}
            </Text>
            <TouchableOpacity
              onPress={() => fetchData(currentMonth)}
              className="mt-6 rounded-full px-8 py-3"
              style={{ backgroundColor: "#7B2CBF" }}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Calendar Grid */}
            <View className="bg-[#FAEAF5] pb-6 mt-4 pt-4">
              {/* Weekday headers */}
              <View className="flex-row px-2 mb-4">
                {weekDays.map((d, i) => (
                  <View key={i} className="flex-1 items-center">
                    <Text className="text-[#8e8e93] text-[13px] font-medium">
                      {d}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Day cells */}
              <View className="flex-row flex-wrap px-2">
                {grid.map((day, idx) => {
                  if (day === 0) {
                    return <View key={idx} className="w-[14.28%] h-14" />;
                  }
                  const info = dayMap.get(day);
                  const isPeriod = info?.is_period ?? false;
                  const isFertile = info?.is_fertile ?? false;
                  const isOvulation = info?.is_ovulation ?? false;
                  const cycleDay = info?.cycle_day;

                  return (
                    <View
                      key={idx}
                      className={`w-[14.28%] h-14 items-center justify-center relative ${
                        isPeriod ? "bg-[#FF4081]" : ""
                      }`}
                    >
                      {/* Cycle day number */}
                      {cycleDay != null && (
                        <View className="absolute top-1 left-1.5">
                          <Text
                            className={`text-[8px] font-bold ${
                              isPeriod ? "text-[#FFB2CC]" : "text-[#FF8BB3]"
                            }`}
                          >
                            {cycleDay}
                          </Text>
                        </View>
                      )}

                      {/* Fertility / Ovulation icon */}
                      {isOvulation && (
                        <View className="absolute top-1 right-1.5">
                          <MaterialCommunityIcons
                            name="heart"
                            size={10}
                            color="#FFD700"
                          />
                        </View>
                      )}
                      {isFertile && !isOvulation && (
                        <View className="absolute top-1 right-1.5">
                          <MaterialCommunityIcons
                            name="heart"
                            size={10}
                            color="#8027A5"
                          />
                        </View>
                      )}

                      {/* Day number */}
                      <Text
                        className={`text-[15px] font-medium ${
                          isPeriod ? "text-white font-bold" : "text-[#1E1E1E]"
                        }`}
                      >
                        {day}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Legend */}
            <View className="px-10 mt-8">
              <View className="flex-row justify-between mb-4">
                <View className="flex-row items-center flex-1">
                  <View className="w-5 h-5 rounded-full bg-[#FF4081] mr-3" />
                  <Text className="text-white text-[14px]">Period days</Text>
                </View>
                <View className="flex-row items-center flex-1">
                  <View className="w-5 h-5 items-center justify-center mr-3">
                    <MaterialCommunityIcons
                      name="heart"
                      size={18}
                      color="#8027A5"
                    />
                  </View>
                  <Text className="text-white text-[14px]">
                    Fertility window
                  </Text>
                </View>
              </View>
              <View className="flex-row justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-5 h-5 rounded-full bg-white items-center justify-center mr-3">
                    <Text className="text-[#1E1E1E] text-[8px] font-bold">
                      20
                    </Text>
                  </View>
                  <Text className="text-white text-[14px]">Cycle count</Text>
                </View>
                <View className="flex-row items-center flex-1">
                  <View className="w-5 h-5 items-center justify-center mr-3">
                    <MaterialCommunityIcons
                      name="heart"
                      size={18}
                      color="#FFD700"
                    />
                  </View>
                  <Text className="text-white text-[14px]">Ovulation Day</Text>
                </View>
              </View>
            </View>

            {/* No data notice */}
            {calendarDays.length === 0 && !errorMessage && (
              <View className="items-center mt-6 px-8">
                <Text className="text-white/60 text-sm text-center">
                  No cycle data shared for this month yet.
                </Text>
              </View>
            )}
          </>
        )}

        {/* Gift Token Button */}
        {!loading && (
          <View className="mt-10 items-center">
            <TouchableOpacity
              onPress={handleGiftTokenPress}
              className="flex-row items-center justify-center px-8 py-3.5 rounded-full"
              style={{
                backgroundColor: "#7B2CBF",
                borderWidth: 1.5,
                borderColor: "#D8B4E2",
              }}
              activeOpacity={0.8}
            >
              <Feather name="gift" size={20} color="#FFFFFF" />
              <Text className="text-white text-base font-bold ml-2">
                Gift Token
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <PartnerBottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </LinearGradient>
  );
}
