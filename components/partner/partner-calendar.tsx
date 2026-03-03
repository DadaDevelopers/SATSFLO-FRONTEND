import { PartnerBottomNavigation } from "@/components/home/partner-bottom-navigation";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabName = "home" | "calendar" | "settings";

// Mock data based on the screenshot provided
const PERIOD_START = 12;
const PERIOD_END = 16;
const FERTILITY_DAYS = [20, 21, 22, 23, 24, 26];
const OVULATION_DAY = 25;
const SELECTED_DAY = 26;

// A simple utility to determine the small red cycle number
const getCycleDay = (day: number) => {
    if (day >= 12) {
        return day - 11; // 12 -> 1
    }
    return day + 20; // Simplified cycle wrapping mock
};

export default function PartnerCalendarScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<TabName>("calendar");

    const handleBack = () => {
        router.back();
    };

    const handleTabPress = (tab: TabName) => {
        setActiveTab(tab);
        switch (tab) {
            case "home":
                router.push("/(tabs)/partner-dashboard" as any);
                break;
            case "settings":
                router.push("/(tabs)/partner-settings" as any);
                break;
            case "calendar":
                // Already here
                break;
            default:
                break;
        }
    };

    const handleGiftTokenPress = () => {
        router.push("/(tabs)/send-gift-token");
    };

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // Offset by 2 days (Oct 1 is Tuesday based on screenshot: Sun, Mon, Tue=1)
    const monthDays = [
        { day: 0 }, { day: 0 }, { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 },
        { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 },
        { day: 13 }, { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 },
        { day: 20 }, { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 },
        { day: 27 }, { day: 28 }, { day: 29 }, { day: 30 }, { day: 31 }, { day: 0 }, { day: 0 },
    ];

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
                            <Text className="text-[#1E1E1E] text-[15px] font-medium">October</Text>
                        </View>
                        <View className="px-4 py-1.5 bg-[#FF4081]">
                            <Text className="text-white text-[15px] font-medium">2025</Text>
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

                            const isPeriod = item.day >= PERIOD_START && item.day <= PERIOD_END;
                            const isFertility = FERTILITY_DAYS.includes(item.day);
                            const isOvulation = item.day === OVULATION_DAY;
                            const isSelected = item.day === SELECTED_DAY;
                            const cycleDay = getCycleDay(item.day);

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
                                    <View className="absolute top-1 left-1.5">
                                        <Text className={`text-[8px] font-bold ${isPeriod ? "text-[#FFB2CC]" : "text-[#FF8BB3]"}`}>
                                            {cycleDay}
                                        </Text>
                                    </View>

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
