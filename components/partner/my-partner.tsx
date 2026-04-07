import { BottomNavigation } from "@/components/home/bottom-navigation";
import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
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

    // Partner info
    const [partnerName, setPartnerName] = useState("");
    const [myNickname, setMyNickname] = useState("");
    const [pairedDays, setPairedDays] = useState<number | null>(null);

    // Settings state
    const [periodDates, setPeriodDates] = useState(true);
    const [fertileWindow, setFertileWindow] = useState(true);
    const [symptomsMoods, setSymptomsMoods] = useState(false);
    const [fullInsights, setFullInsights] = useState(false);
    const [sexDrive, setSexDrive] = useState(false);

    // Modal State
    const [showUnpairModal, setShowUnpairModal] = useState(false);

    const loadData = useCallback(async () => {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) return;
        try {
            const [partnerRes, settingsRes] = await Promise.all([
                api.get("/partner", token),
                api.get("/partner/settings", token),
            ]);
            if (partnerRes.response.ok) {
                const p = partnerRes.data?.data ?? partnerRes.data;
                if (p?.partner_nickname) setPartnerName(p.partner_nickname);
                else if (p?.partner?.name) setPartnerName(p.partner.name);
                if (p?.my_nickname) setMyNickname(p.my_nickname);
                if (p?.paired_days != null) setPairedDays(p.paired_days);
                else if (p?.days_paired != null) setPairedDays(p.days_paired);
            }
            if (settingsRes.response.ok) {
                const s = settingsRes.data?.data ?? settingsRes.data;
                if (s) {
                    if (s.share_period_dates != null) setPeriodDates(s.share_period_dates);
                    if (s.share_fertile_window != null) setFertileWindow(s.share_fertile_window);
                    if (s.share_symptoms_moods != null) setSymptomsMoods(s.share_symptoms_moods);
                    if (s.share_cycle_insights != null) setFullInsights(s.share_cycle_insights);
                    if (s.share_sex_drive != null) setSexDrive(s.share_sex_drive);
                }
            }
        } catch {}
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const saveSettings = async (updates: Record<string, boolean>) => {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) return;
        try {
            await api.put("/partner/settings", updates, token);
        } catch {}
    };

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

    const confirmUnpair = async () => {
        setShowUnpairModal(false);
        try {
            const token = await AsyncStorage.getItem("accessToken");
            if (token) await api.delete("/partner", undefined, token);
        } catch {}
        router.back();
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
                        {partnerName || myNickname
                            ? [partnerName, myNickname].filter(Boolean).join(" & ")
                            : "Partner"}
                    </Text>
                    <Text className="text-[#616161] text-[14px] mb-6">
                        {pairedDays != null
                            ? `Paired for ${pairedDays} day${pairedDays !== 1 ? "s" : ""}`
                            : ""}
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
                                onValueChange={(v) => { setPeriodDates(v); saveSettings({ share_period_dates: v }); }}
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
                                onValueChange={(v) => { setFertileWindow(v); saveSettings({ share_fertile_window: v }); }}
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
                                onValueChange={(v) => { setSymptomsMoods(v); saveSettings({ share_symptoms_moods: v }); }}
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
                                onValueChange={(v) => { setFullInsights(v); saveSettings({ share_cycle_insights: v }); }}
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
                                onValueChange={(v) => { setSexDrive(v); saveSettings({ share_sex_drive: v }); }}
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
