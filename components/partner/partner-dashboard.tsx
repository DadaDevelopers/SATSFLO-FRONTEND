import { PartnerBottomNavigation } from "@/components/home/partner-bottom-navigation";
import { Feather } from "@expo/vector-icons";
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
import Svg, { Path } from "react-native-svg";

type TabName = "home" | "calendar" | "settings";

function PregnancyCurve() {
    return (
        <Svg width={90} height={40} viewBox="0 0 90 40">
            {/* Lighter shadow line */}
            <Path
                d="M 5 30 L 50 30 C 56 30 60 5 66 5 C 72 5 76 30 82 30 L 85 30"
                stroke="#D1A3FF"
                strokeWidth={2}
                fill="none"
                transform="translate(0, 4)"
            />
            {/* Solid main line */}
            <Path
                d="M 5 30 L 50 30 C 56 30 60 5 66 5 C 72 5 76 30 82 30 L 85 30"
                stroke="#B551E5"
                strokeWidth={3}
                fill="none"
            />
        </Svg>
    );
}

export default function PartnerDashboardScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<TabName>("home");
    // Toggle between the two mockups
    const [isPeriod, setIsPeriod] = useState(true);

    const handleBack = () => {
        router.back();
    };

    const handleTabPress = (tab: TabName) => {
        setActiveTab(tab);
        switch (tab) {
            case "calendar":
                router.push("/calendar");
                break;
            case "settings":
                router.push("/(tabs)/partner-settings");
                break;
            case "home":
                // Already on home
                break;
            default:
                break;
        }
    };

    const handleGiftTokenPress = () => {
        router.push("/(tabs)/send-gift-token");
    };

    return (
        <View
            className="flex-1"
            style={{ paddingTop: insets.top, backgroundColor: "#3F0A66" }}
        >
            <StatusBar barStyle="light-content" backgroundColor="#3F0A66" />

            {/* Header */}
            <View className="flex-row items-center px-6 py-4">
                <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
                    <Feather name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-white text-[18px] font-medium mr-6">
                    Babe's Cycle
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 120, // Leave room for floating button
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Period Status (Hero Section) */}
                <TouchableOpacity activeOpacity={0.9} onPress={() => setIsPeriod(!isPeriod)}>
                    <View className="items-center mt-6 mb-8">
                        <Text className="text-white text-[16px] font-medium tracking-wide mb-2">
                            {isPeriod ? "Period" : "Next Ovulation"}
                        </Text>
                        <Text
                            className="text-white font-extrabold mb-3 tracking-tight"
                            style={{ fontSize: 38, fontFamily: 'impact' }}
                        >
                            {isPeriod ? "1st Day of Period" : "7 Days Left"}
                        </Text>
                        <Text className="text-white text-[17px]">
                            {isPeriod ? "Next ovulation: 14 days left" : "Next period: 15 days left"}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Common Card Style: very light pink/purple #F8F1FF, highly rounded */}

                {/* Cycle Phase Card */}
                <View className="bg-[#F8F1FF] rounded-[24px] p-5 mb-4 shadow-sm">
                    <Text className="text-[#B551E5] text-[18px] font-bold mb-2">
                        Cycle Phase
                    </Text>
                    <Text className="text-[#616161] text-[15px] leading-5 mb-3">
                        {isPeriod
                            ? "Your partner is on their first day of period. Keep in touch and stay connected. They need you more now"
                            : "Your partner is in the ovulation period. Keep in touch and stay connected ."}
                    </Text>
                    <Text className="text-[#1E1E1E] font-bold text-[16px]">
                        Cycle Day 12
                    </Text>
                </View>

                {/* Today's Symptoms Card */}
                <View className="bg-[#F8F1FF] rounded-[24px] p-5 mb-4 shadow-sm">
                    <Text className="text-[#B551E5] text-[18px] font-bold mb-2">
                        Today's Symptoms
                    </Text>

                    {isPeriod ? (
                        <>
                            <Text className="text-[#616161] text-[15px] leading-5 mb-4">
                                Here's what your partner is logging. Each of these symptoms matter, please take note.
                            </Text>

                            <View className="flex-row flex-wrap gap-2 mb-4">
                                <View className="bg-white border border-[#EBEBEB] flex-row items-center px-3 py-1.5 rounded-full shadow-sm">
                                    <Text className="text-[14px]">🤕</Text>
                                    <Text className="text-[#B551E5] ml-2 font-semibold">Headache</Text>
                                </View>
                                <View className="bg-white border border-[#EBEBEB] flex-row items-center px-3 py-1.5 rounded-full shadow-sm">
                                    <Text className="text-[14px]">😖</Text>
                                    <Text className="text-[#B551E5] ml-2 font-semibold">Cramps</Text>
                                </View>
                            </View>
                        </>
                    ) : (
                        <Text className="text-[#616161] text-[15px] leading-5 mb-4">
                            No symptoms logged today, it might be a good day for your partner.
                        </Text>
                    )}

                    <Text className="text-[#1E1E1E] text-[15px] font-bold italic">
                        Make her happy by sending her some SATS ⚡ (click on the gift token button)
                    </Text>
                </View>

                {/* Pregnancy Chance Card */}
                <View className="bg-[#F8F1FF] rounded-[24px] p-6 mb-4 flex-row justify-between items-center shadow-sm">
                    <View>
                        <Text className="text-[#B551E5] text-[18px] font-bold mb-2">
                            Pregnancy Chance
                        </Text>
                        <Text className="text-[#1E1E1E] text-[18px] font-extrabold flex-1 flex-col">Low</Text>
                    </View>
                    <View className="justify-center items-center mt-2">
                        <PregnancyCurve />
                    </View>
                </View>

                {/* Moods & Sex Drive Cards */}
                <View className="flex-row justify-between mb-4 gap-4">
                    <View className="bg-[#F8F1FF] rounded-[24px] p-5 flex-1 items-center shadow-sm">
                        <Text className="text-[#B551E5] text-[18px] font-bold mb-4">Moods</Text>
                        {isPeriod ? (
                            <View className="w-[50px] h-[50px] rounded-full justify-center items-center mb-3" style={{ backgroundColor: '#FFD700', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 }}>
                                <Text style={{ fontSize: 32, lineHeight: 38 }}>🙂</Text>
                            </View>
                        ) : (
                            <View className="w-[50px] h-[50px] justify-center items-center mb-3">
                                <Text style={{ fontSize: 40, color: '#B551E5' }}>💠</Text>
                            </View>
                        )}
                        <Text className="text-[#1E1E1E] font-bold text-[16px]">{isPeriod ? "Okay" : "No log"}</Text>
                    </View>

                    <View className="bg-[#F8F1FF] rounded-[24px] p-5 flex-1 items-center shadow-sm">
                        <Text className="text-[#B551E5] text-[18px] font-bold mb-4">Sex Drive</Text>
                        {isPeriod ? (
                            <View className="w-[50px] h-[50px] rounded-full justify-center items-center mb-3">
                                <Feather name="heart" size={40} color="#FFB3C6" solid />
                            </View>
                        ) : (
                            <View className="w-[50px] h-[50px] justify-center items-center mb-3">
                                <Text style={{ fontSize: 40, color: '#FFB3C6' }}>🌸</Text>
                            </View>
                        )}
                        <Text className="text-[#1E1E1E] font-bold text-[16px]">{isPeriod ? "Low" : "No log"}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Floating Gift Token Button */}
            <View className="absolute bottom-[90px] left-0 right-0 items-center">
                <TouchableOpacity
                    onPress={handleGiftTokenPress}
                    className="flex-row items-center justify-center px-8 py-3.5 rounded-full"
                    style={{
                        backgroundColor: "#7B2CBF",
                        borderWidth: 1.5,
                        borderColor: "#D8B4E2",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                        elevation: 5,
                    }}
                    activeOpacity={0.8}
                >
                    <Feather name="gift" size={20} color="#FFFFFF" />
                    <Text className="text-white text-base font-medium ml-2">Gift Token</Text>
                </TouchableOpacity>
            </View>

            {/* Navigation */}
            <PartnerBottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
        </View>
    );
}
