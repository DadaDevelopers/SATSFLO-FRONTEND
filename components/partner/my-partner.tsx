import { BottomNavigation } from "@/components/home/bottom-navigation";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StatusBar,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabName = "home" | "calendar" | "add" | "chat" | "settings";

export default function MyPartnerScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<TabName>("settings");

    // Settings state
    const [periodDates, setPeriodDates] = useState(true);
    const [fertileWindow, setFertileWindow] = useState(true);
    const [symptomsMoods, setSymptomsMoods] = useState(false);
    const [fullInsights, setFullInsights] = useState(false);
    const [sexDrive, setSexDrive] = useState(false);

    // Modal State
    const [showUnpairModal, setShowUnpairModal] = useState(false);

    const handleBack = () => {
        router.back();
    };

    const handleTabPress = (tab: TabName) => {
        setActiveTab(tab);
        switch (tab) {
            case "home":
                router.push("/(tabs)");
                break;
            case "calendar":
                router.push("/calendar");
                break;
            case "add":
                router.push("/add-log");
                break;
            case "chat":
                router.push("/(tabs)/thread");
                break;
            case "settings":
                router.push("/(tabs)/settings");
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
        // Add exact unpair logic here
        router.back(); // Temporary behavior: return to settings after unpairing
    };

    return (
        <View
            className="flex-1"
            style={{ paddingTop: insets.top, backgroundColor: "#FF4081" }}
        >
            <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

            {/* Header */}
            <View className="flex-row items-center px-6 py-4">
                <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
                    <Feather name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-white text-xl font-bold mr-6">
                    My Partner
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 100, // Leave room for floating button
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <View className="bg-white rounded-[24px] p-6 items-center mt-6 shadow-sm">
                    {/* Overlapping Avatars */}
                    <View className="flex-row items-center justify-center mb-4 relative h-16 w-32">
                        <View className="w-[60px] h-[60px] rounded-full bg-gray-200 border-[3px] border-white absolute left-5 z-10 overflow-hidden shadow-sm">
                            <Image
                                source={{ uri: "https://i.pravatar.cc/150?img=5" }}
                                className="w-full h-full"
                            />
                        </View>
                        <View className="w-[60px] h-[60px] rounded-full bg-gray-300 border-[3px] border-white absolute right-5 z-0 overflow-hidden shadow-sm">
                            <Image
                                source={{ uri: "https://i.pravatar.cc/150?img=11" }}
                                className="w-full h-full"
                            />
                        </View>
                        {/* Small floating heart */}
                        <View className="absolute -top-1 right-8 bg-white rounded-full p-1 shadow-sm z-20 border border-gray-100">
                            <Feather name="heart" size={14} color="#FF4081" solid />
                        </View>
                    </View>

                    <Text className="text-[20px] font-bold text-[#1E1E1E] mb-1">
                        Sarah Abraham & My Love
                    </Text>
                    <Text className="text-[#616161] text-[14px] mb-6">
                        Paired for 1 day
                    </Text>

                    {/* Stop Pairing Action */}
                    <View className="w-full border-t border-[#F5F5F5] pt-4">
                        <TouchableOpacity
                            onPress={() => setShowUnpairModal(true)}
                            className="flex-row items-center justify-between"
                            activeOpacity={0.7}
                        >
                            <View className="flex-row items-center">
                                <View className="mr-3">
                                    <Feather name="link-2" size={20} color="#FF3B30" />
                                </View>
                                <Text className="text-[#FF3B30] text-[15px] font-medium">
                                    Stop pairing
                                </Text>
                            </View>
                            <Feather name="chevron-right" size={20} color="#C7C7CC" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Permissions Section */}
                <View className="mt-8 mb-6">
                    <Text className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-3 ml-2">
                        My partner's view
                    </Text>

                    <View className="bg-white rounded-[24px] overflow-hidden shadow-sm">
                        {/* Permission item */}
                        <View className="flex-row items-center justify-between px-5 py-[14px]">
                            <Text className="text-[#1E1E1E] font-medium text-[15px]">
                                Period start and end dates
                            </Text>
                            <Switch
                                value={periodDates}
                                onValueChange={setPeriodDates}
                                trackColor={{ false: "#E5E5EA", true: "#FF4081" }}
                                thumbColor={"#FFFFFF"}
                                ios_backgroundColor="#E5E5EA"
                            />
                        </View>

                        <View className="h-px bg-[#F5F5F5] mx-5" />

                        <View className="flex-row items-center justify-between px-5 py-[14px]">
                            <Text className="text-[#1E1E1E] font-medium text-[15px]">
                                Fertile window and ovulation
                            </Text>
                            <Switch
                                value={fertileWindow}
                                onValueChange={setFertileWindow}
                                trackColor={{ false: "#E5E5EA", true: "#FF4081" }}
                                thumbColor={"#FFFFFF"}
                                ios_backgroundColor="#E5E5EA"
                            />
                        </View>

                        <View className="h-px bg-[#F5F5F5] mx-5" />

                        <View className="flex-row items-center justify-between px-5 py-[14px]">
                            <Text className="text-[#1E1E1E] font-medium text-[15px]">
                                Symptoms and moods
                            </Text>
                            <Switch
                                value={symptomsMoods}
                                onValueChange={setSymptomsMoods}
                                trackColor={{ false: "#E5E5EA", true: "#FF4081" }}
                                thumbColor={"#FFFFFF"}
                                ios_backgroundColor="#E5E5EA"
                            />
                        </View>

                        <View className="h-px bg-[#F5F5F5] mx-5" />

                        <View className="flex-row items-center justify-between px-5 py-[14px]">
                            <Text className="text-[#1E1E1E] font-medium text-[15px]">
                                Full cycle insights
                            </Text>
                            <Switch
                                value={fullInsights}
                                onValueChange={setFullInsights}
                                trackColor={{ false: "#E5E5EA", true: "#FF4081" }}
                                thumbColor={"#FFFFFF"}
                                ios_backgroundColor="#E5E5EA"
                            />
                        </View>

                        <View className="h-px bg-[#F5F5F5] mx-5" />

                        <View className="flex-row items-center justify-between px-5 py-[14px]">
                            <Text className="text-[#1E1E1E] font-medium text-[15px]">
                                Sex drive
                            </Text>
                            <Switch
                                value={sexDrive}
                                onValueChange={setSexDrive}
                                trackColor={{ false: "#E5E5EA", true: "#FF4081" }}
                                thumbColor={"#FFFFFF"}
                                ios_backgroundColor="#E5E5EA"
                            />
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Floating Gift Token Button */}
            <View className="absolute bottom-28 left-0 right-0 items-center">
                <TouchableOpacity
                    onPress={handleGiftTokenPress}
                    className="flex-row items-center justify-center px-6 py-3 rounded-full"
                    style={{
                        backgroundColor: "#FF4081",
                        borderWidth: 1,
                        borderColor: "#FFB4CD",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 8,
                        elevation: 5,
                    }}
                    activeOpacity={0.8}
                >
                    <Feather name="gift" size={20} color="#FFFFFF" />
                    <Text className="text-white text-base font-medium ml-2">Gift Token</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Navigation */}
            <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />

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

        </View>
    );
}
