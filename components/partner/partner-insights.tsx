import { PartnerBottomNavigation } from "@/components/home/partner-bottom-navigation";
import { Feather } from "@expo/vector-icons";
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

export default function PartnerInsightsScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<TabName>("home");

    const handleBack = () => {
        router.back();
    };

    const handleTabPress = (tab: TabName) => {
        setActiveTab(tab);
        switch (tab) {
            case "calendar":
                router.push("/test-partner-calendar" as any);
                break;
            case "settings":
                router.push("/test-partner-settings" as any);
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
                <Text className="flex-1 text-center text-white text-[18px] font-medium mr-6">
                    Babe's Cycle
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 40, // Added padding from Babe's Cycle header
                    paddingBottom: 120, // Leave room for floating navigation
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Ovulation Countdown Status (Hero Section) */}
                <View className="items-center mb-8">
                    <Text className="text-white text-[16px] font-medium tracking-wide mb-3">
                        Next Ovulation
                    </Text>
                    <Text
                        className="text-white font-black mb-3"
                        style={{
                            fontSize: 45,
                            fontFamily: 'Segoe UI',
                            letterSpacing: 1.5 // Adds spacing between letters/words 
                        }}
                    >
                        7 Days Left
                    </Text>
                    <Text className="text-white text-[17px] mt-2">
                        Next period: 15 days left
                    </Text>
                </View>

                {/* Common Card Style: very light pink/purple #F8F1FF, highly rounded */}

                {/* Cycle Phase Card */}
                <View className="bg-[#F8F1FF] rounded-[24px] p-5 shadow-sm">
                    <Text className="text-[#B551E5] text-[18px] font-bold mb-2">
                        Cycle Phase
                    </Text>
                    <Text className="text-[#616161] text-[15px] leading-5 mb-3">
                        Your partner is in the ovulation period. Keep in touch and stay connected .
                    </Text>
                    <Text className="text-[#1E1E1E] font-bold text-[16px]">
                        Cycle Day 12
                    </Text>
                </View>

            </ScrollView>

            {/* Floating Gift Token Button positioned closer to the bottom */}
            <View className="absolute bottom-24 left-0 right-0 items-center">
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
                    <Text className="text-white text-base font-bold ml-2">Gift Token</Text>
                </TouchableOpacity>
            </View>

            {/* Navigation */}
            <PartnerBottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
        </LinearGradient>
    );
}
