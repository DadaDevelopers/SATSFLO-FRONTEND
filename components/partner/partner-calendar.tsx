import { PartnerBottomNavigation } from "@/components/home/partner-bottom-navigation";
import { api } from "@/lib/api";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabName = "home" | "calendar" | "settings";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

export default function PartnerCalendarScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<TabName>("calendar");

    // Calendar data from API
    const [periodDays, setPeriodDays] = useState<number[]>([]);
    const [fertilityDays, setFertilityDays] = useState<number[]>([]);
    const [ovulationDay, setOvulationDay] = useState<number | null>(null);
    const [currentDay, setCurrentDay] = useState<number | null>(null);
    const [displayMonth, setDisplayMonth] = useState(new Date().getMonth());
    const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
    const [cycleStartDay, setCycleStartDay] = useState<number | null>(null);

    const loadCalendar = useCallback(async () => {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) return;
        try {
            const { response, data } = await api.get("/partner/calendar", token);
            if (response.ok) {
                const d = data?.data ?? data;
                if (Array.isArray(d?.period_days)) setPeriodDays(d.period_days);
                else if (d?.period_start != null && d?.period_end != null) {
                    const days: number[] = [];
                    for (let i = d.period_start; i <= d.period_end; i++) days.push(i);
                    setPeriodDays(days);
                }
                if (Array.isArray(d?.fertile_days)) setFertilityDays(d.fertile_days);
                if (d?.ovulation_day != null) setOvulationDay(d.ovulation_day);
                if (d?.current_day != null) setCurrentDay(d.current_day);
                if (d?.cycle_start_day != null) setCycleStartDay(d.cycle_start_day);
                if (d?.month != null) setDisplayMonth(d.month - 1);
                if (d?.year != null) setDisplayYear(d.year);
            }
        } catch {}
    }, []);

    useEffect(() => { loadCalendar(); }, [loadCalendar]);

    const handleBack = () => {
        router.back();
    };

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
                // Already here
                break;
            default:
                break;
        }
    };

    const handleGiftTokenPress = () => {
        router.push("/(tabs)/gift-token-wallet");
    };

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(displayYear, displayMonth, 1).getDay();
    const monthDays: { day: number }[] = [
        ...Array(firstDayOfWeek).fill({ day: 0 }),
        ...Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1 })),
    ];
    const remainder = monthDays.length % 7;
    if (remainder !== 0) {
        for (let i = 0; i < 7 - remainder; i++) monthDays.push({ day: 0 });
    }

    const getCycleDay = (day: number) => {
        if (cycleStartDay == null) return null;
        const cd = day - cycleStartDay + 1;
        return cd > 0 ? cd : null;
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
                <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
                    <Feather name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Month/Year Pill Switcher */}
                <View className="flex-1 items-center mr-6">
                    <View className="flex-row bg-[#FFFFFF] rounded-full overflow-hidden items-center justify-center">
                        <View className="px-4 py-1.5 bg-[#FFFFFF]">
                            <Text className="text-[#1E1E1E] text-[15px] font-medium">{MONTH_NAMES[displayMonth]}</Text>
                        </View>
                        <View className="px-4 py-1.5 bg-[#FF4081]">
                            <Text className="text-white text-[15px] font-medium">{displayYear}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Calendar View Container */}
                <View className="bg-[#FAEAF5] pb-6 mt-4 pt-4">

                    {/* Weekdays Row */}
                    <View className="flex-row px-2 mb-4">
                        {weekDays.map((day, idx) => (
                            <View key={idx} className="flex-1 items-center">
                                <Text className="text-[#8e8e93] text-[13px] font-medium">{day}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Days Grid */}
                    <View className="flex-row flex-wrap px-2">
                        {monthDays.map((item, index) => {
                            if (item.day === 0) {
                                return <View key={index} className="w-[14.28%] h-14" />;
                            }

                            const isPeriod = periodDays.includes(item.day);
                            const isFertility = fertilityDays.includes(item.day);
                            const isOvulation = item.day === ovulationDay;
                            const isSelected = item.day === currentDay;
                            const dayNum = getCycleDay(item.day);

                            return (
                                <View
                                    key={index}
                                    className={`w-[14.28%] h-14 items-center justify-center relative ${isPeriod ? "bg-[#FF4081]" : ""
                                        }`}
                                >
                                    {/* Selection Border (for active day, in this case 26) */}
                                    {isSelected && !isPeriod && (
                                        <View className="absolute inset-x-1 inset-y-0.5 border border-[#FF4081] pointer-events-none bg-[#FFF8FB]" />
                                    )}

                                    {/* Cycle Tiny Number */}
                                    {dayNum != null && (
                                        <View className="absolute top-1 left-1.5">
                                            <Text className={`text-[8px] font-bold ${isPeriod ? "text-[#FFB2CC]" : "text-[#FF8BB3]"}`}>
                                                {dayNum}
                                            </Text>
                                        </View>
                                    )}

                                    {/* Icon Placement (Fertility / Ovulation) */}
                                    {isFertility && !isPeriod && (
                                        <View className="absolute top-1 right-1.5">
                                            <MaterialCommunityIcons name="heart" size={10} color="#8027A5" />
                                        </View>
                                    )}
                                    {isOvulation && (
                                        <View className="absolute top-1 right-1.5">
                                            <MaterialCommunityIcons name="heart" size={10} color="#FFD700" />
                                        </View>
                                    )}

                                    {/* Main Day Text */}
                                    <Text
                                        className={`text-[15px] font-medium ${isPeriod ? "text-white font-bold" : "text-[#1E1E1E]"
                                            }`}
                                    >
                                        {item.day}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Legend */}
                <View className="px-10 mt-8">
                    <View className="flex-row justify-between mb-4">
                        {/* Period days */}
                        <View className="flex-row items-center flex-1">
                            <View className="w-5 h-5 rounded-full bg-[#FF4081] items-center justify-center mr-3" />
                            <Text className="text-white text-[14px]">Period days</Text>
                        </View>
                        {/* Fertility window */}
                        <View className="flex-row items-center flex-1">
                            <View className="w-5 h-5 items-center justify-center mr-3">
                                <MaterialCommunityIcons name="heart" size={18} color="#8027A5" />
                            </View>
                            <Text className="text-white text-[14px]">Fertility window</Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between">
                        {/* Cycle count */}
                        <View className="flex-row items-center flex-1">
                            <View className="w-5 h-5 rounded-full bg-white items-center justify-center mr-3">
                                <Text className="text-[#1E1E1E] text-[8px] font-bold">20</Text>
                            </View>
                            <Text className="text-white text-[14px]">Cycle count</Text>
                        </View>
                        {/* Ovulation Day */}
                        <View className="flex-row items-center flex-1">
                            <View className="w-5 h-5 items-center justify-center mr-3">
                                <MaterialCommunityIcons name="heart" size={18} color="#FFD700" />
                            </View>
                            <Text className="text-white text-[14px]">Ovulation Day</Text>
                        </View>
                    </View>
                </View>

                {/* Gift Token Button */}
                <View className="mt-14 items-center">
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
                        <Text className="text-white text-base font-bold ml-2">Gift Token</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            <PartnerBottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
        </LinearGradient>
    );
}
