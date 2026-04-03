import { PartnerBottomNavigation } from "@/components/home/partner-bottom-navigation";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabName = "home" | "calendar" | "settings";

export default function PartnerSettingsScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<TabName>("settings");
    const [showUnpairModal, setShowUnpairModal] = useState(false);

    const handleBack = () => {
        router.back();
    };

    const handleTabPress = (tab: TabName) => {
        setActiveTab(tab);
        switch (tab) {
            case "home":
                router.push("/partner" as any);
                break;
            case "calendar":
                router.push("/partner/calendar" as any); // Assuming same calendar
                break;
            case "settings":
                // Already here
                break;
            default:
                break;
        }
    };

    const handleGiftTokenPress = () => {
        router.push("/(tabs)/gift-token-wallet");
    };

    const confirmUnpair = () => {
        setShowUnpairModal(false);
        // Add unpair logic here
        router.push("/(tabs)/settings"); // Return to primary settings or auth
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
                <Text className="flex-1 text-center text-white text-[20px] font-bold mr-6">
                    Settings
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 10,
                    paddingBottom: 120, // Leave room for floating button
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <View className="bg-[#FFF0F5] rounded-[24px] p-6 items-center shadow-sm relative">

                    {/* Heart graphics */}
                    <View className="absolute top-8 right-16 z-20" style={{ transform: [{ rotate: '15deg' }] }}>
                        <Feather name="heart" size={32} color="#FF4081" solid />
                    </View>
                    <View className="absolute top-24 left-16 z-20" style={{ transform: [{ rotate: '-15deg' }] }}>
                        <Feather name="heart" size={40} color="#FF4081" solid />
                    </View>

                    {/* Overlapping Avatars */}
                    <View className="flex-row items-center justify-center mb-4 relative h-[100px] w-48 mt-4">
                        <View className="w-[85px] h-[85px] rounded-full bg-gray-200 border-[3px] border-[#FFF0F5] absolute left-6 z-10 overflow-hidden shadow-sm">
                            <Image
                                source={{ uri: "https://i.pravatar.cc/150?img=5" }}
                                className="w-full h-full"
                            />
                        </View>
                        <View className="w-[85px] h-[85px] rounded-full bg-gray-300 border-[3px] border-[#FFF0F5] absolute right-6 top-8 z-0 overflow-hidden shadow-sm">
                            <Image
                                source={{ uri: "https://i.pravatar.cc/150?img=11" }}
                                className="w-full h-full"
                            />
                        </View>
                    </View>

                    <Text className="text-[20px] font-extrabold text-[#1E1E1E] mt-4 mb-1">
                        Sarah Abraham & Babe
                    </Text>
                    <Text className="text-[#616161] text-[15px] mb-8">
                        Paired for 1 day
                    </Text>

                    {/* Action Row 1: Switch to my cycle */}
                    <View className="w-full border-t border-[#F5E6EC] pt-4 mb-2">
                        <TouchableOpacity
                            className="flex-row items-center justify-between"
                            activeOpacity={0.7}
                        >
                            <View className="flex-row items-center">
                                <View className="mr-3">
                                    <Feather name="refresh-cw" size={20} color="#FF4081" />
                                </View>
                                <Text className="text-[#1E1E1E] text-[15px] font-medium">
                                    Switch to my cycle
                                </Text>
                            </View>
                            <Feather name="chevron-right" size={20} color="#C7C7CC" />
                        </TouchableOpacity>
                    </View>

                    {/* Action Row 2: Stop pairing */}
                    <View className="w-full border-[#F5E6EC] pt-4 pb-2">
                        <TouchableOpacity
                            onPress={() => setShowUnpairModal(true)}
                            className="flex-row items-center justify-between"
                            activeOpacity={0.7}
                        >
                            <View className="flex-row items-center">
                                <View className="mr-3">
                                    <Feather name="link-2" size={20} color="#FF4081" />
                                </View>
                                <Text className="text-[#1E1E1E] text-[15px] font-medium">
                                    Stop pairing
                                </Text>
                            </View>
                            <Feather name="chevron-right" size={20} color="#C7C7CC" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Test/Preview Button */}
                <View className="mt-8 items-center">
                    <TouchableOpacity
                        onPress={() => router.push("/(tabs)/partner-dashboard" as any)}
                        className="bg-[#4B0082] py-4 px-8 rounded-full flex-row items-center shadow-sm"
                        style={{ borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.5)" }}
                        activeOpacity={0.8}
                    >
                        <Feather name="eye" size={20} color="#FFFFFF" />
                        <Text className="text-white font-bold ml-2 text-base">Preview Partner View</Text>
                    </TouchableOpacity>
                    <Text className="text-white/70 text-xs mt-3 text-center px-4">
                        (This button is just for testing the new screen)
                    </Text>
                </View>

            </ScrollView>

            {/* Floating Gift Token Button */}
            {/* Notice the button has a Purple background "#7B2CBF" with white text and a white thin border, like the screenshot */}
            <View className="absolute bottom-28 left-0 right-0 items-center">
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

            {/* Bottom Navigation */}
            <PartnerBottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />

            {/* Unpair Confirmation Modal */}
            <Modal
                visible={showUnpairModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowUnpairModal(false)}
            >
                <View className="flex-1 justify-end bg-black/40">
                    <View className="bg-[#FFF0F5] w-full rounded-t-[32px] pt-4 pb-8 px-6 items-center">
                        {/* Handle/Grabber */}
                        <View className="w-12 h-1.5 bg-[#E5E5EA] rounded-full mb-8" />

                        <Text className="text-[22px] font-bold text-[#1E1E1E] mb-3">
                            Unpair with Partner
                        </Text>

                        <Text className="text-center text-[#616161] text-[15px] mb-8 leading-[22px]">
                            Are you sure you want to unpair with your partner?
                        </Text>

                        <View className="w-full flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setShowUnpairModal(false)}
                                className="flex-1 py-[14px] rounded-full border-[1.5px] border-[#FF4081] items-center justify-center bg-white"
                                activeOpacity={0.7}
                            >
                                <Text className="text-[#FF4081] font-semibold text-[16px]">
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={confirmUnpair}
                                className="flex-1 py-[14px] rounded-full bg-[#FF4081] items-center justify-center shadow-sm"
                                activeOpacity={0.7}
                            >
                                <Text className="text-white font-semibold text-[16px]">
                                    Yes, Unpair
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </LinearGradient>
    );
}
