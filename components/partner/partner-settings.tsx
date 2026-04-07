import { PartnerBottomNavigation } from "@/components/home/partner-bottom-navigation";
import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
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

interface PartnerInfo {
    partner: { username: string; avatar?: string } | null;
    my_nickname: string;
    partner_nickname: string;
    partner_mode_enabled: boolean;
    connected_since: string;
}

export default function PartnerSettingsScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<TabName>("settings");

    // Data state
    const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);

    // UI state
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showUnpairModal, setShowUnpairModal] = useState(false);
    const [unpairingLoading, setUnpairingLoading] = useState(false);
    const [switchingMode, setSwitchingMode] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const token = await AsyncStorage.getItem("accessToken");
            if (!token) {
                setErrorMessage("Session expired. Please log in again.");
                setLoading(false);
                return;
            }

            const { response, data } = await api.get("/partner", token);
            if (response.ok) {
                const d = data?.data ?? data;
                setPartnerInfo(d);
            } else {
                setErrorMessage(data?.message ?? "Failed to load partner info.");
            }
        } catch {
            setErrorMessage("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSwitchToCycle = async () => {
        setSwitchingMode(true);
        try {
            const token = await AsyncStorage.getItem("accessToken");
            if (!token) return;
            const { response, data } = await api.put(
                "/partner/mode",
                { partner_mode_enabled: false },
                token
            );
            if (response.ok) {
                router.replace("/(tabs)" as any);
            } else {
                Alert.alert(
                    "Error",
                    data?.message ?? "Could not switch mode. Please try again."
                );
            }
        } catch {
            Alert.alert("Error", "Network error. Please try again.");
        } finally {
            setSwitchingMode(false);
        }
    };

    const confirmUnpair = async () => {
        setShowUnpairModal(false);
        setUnpairingLoading(true);
        try {
            const token = await AsyncStorage.getItem("accessToken");
            if (!token) return;
            const { response, data } = await api.delete("/partner", {}, token);
            if (response.ok) {
                router.replace("/(tabs)/settings");
            } else {
                Alert.alert(
                    "Unpair Failed",
                    data?.message ?? "Could not unpair. Please try again."
                );
            }
        } catch {
            Alert.alert("Error", "Network error. Please try again.");
        } finally {
            setUnpairingLoading(false);
        }
    };

    const handleTabPress = (tab: TabName) => {
        setActiveTab(tab);
        switch (tab) {
            case "home": router.push("/partner" as any); break;
            case "calendar": router.push("/partner/calendar" as any); break;
            case "settings": break;
        }
    };

    const handleGiftTokenPress = () => router.push("/(tabs)/send-gift-token");

    const pairedDuration = () => {
        if (!partnerInfo?.connected_since) return "Paired recently";
        const since = new Date(partnerInfo.connected_since);
        const now = new Date();
        const days = Math.floor(
            (now.getTime() - since.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (days === 0) return "Paired today";
        if (days === 1) return "Paired for 1 day";
        return `Paired for ${days} days`;
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
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-2 -ml-2"
                >
                    <Feather name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-white text-[20px] font-bold mr-6">
                    Settings
                </Text>
                {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
            </View>

            {/* Loading */}
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#B551E5" />
                    <Text className="text-white mt-4 text-base">
                        Loading partner info…
                    </Text>
                </View>
            ) : errorMessage ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Feather
                        name="wifi-off"
                        size={48}
                        color="rgba(181,81,229,0.6)"
                    />
                    <Text className="text-white text-center mt-4 text-base">
                        {errorMessage}
                    </Text>
                    <TouchableOpacity
                        onPress={fetchData}
                        className="mt-6 rounded-full px-8 py-3"
                        style={{ backgroundColor: "#7B2CBF" }}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-semibold text-base">
                            Retry
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingTop: 10,
                        paddingBottom: 120,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Profile Card */}
                    <View className="bg-[#FFF0F5] rounded-[24px] p-6 items-center shadow-sm relative">
                        {/* Decorative hearts */}
                        <View
                            className="absolute top-8 right-16 z-20"
                            style={{ transform: [{ rotate: "15deg" }] }}
                        >
                            <Feather name="heart" size={32} color="#FF4081" />
                        </View>
                        <View
                            className="absolute top-24 left-16 z-20"
                            style={{ transform: [{ rotate: "-15deg" }] }}
                        >
                            <Feather name="heart" size={40} color="#FF4081" />
                        </View>

                        {/* Avatars */}
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
                            {partnerInfo?.my_nickname && partnerInfo?.partner_nickname
                                ? `${partnerInfo.my_nickname} & ${partnerInfo.partner_nickname}`
                                : partnerInfo?.partner?.username
                                ? `You & ${partnerInfo.partner.username}`
                                : "You & Your Partner"}
                        </Text>
                        <Text className="text-[#616161] text-[15px] mb-8">
                            {pairedDuration()}
                        </Text>

                        {/* Switch to my cycle */}
                        <View className="w-full border-t border-[#F5E6EC] pt-4 mb-2">
                            <TouchableOpacity
                                onPress={handleSwitchToCycle}
                                className="flex-row items-center justify-between"
                                activeOpacity={0.7}
                                disabled={switchingMode}
                            >
                                <View className="flex-row items-center">
                                    <View className="mr-3">
                                        {switchingMode ? (
                                            <ActivityIndicator
                                                size="small"
                                                color="#FF4081"
                                            />
                                        ) : (
                                            <Feather
                                                name="refresh-cw"
                                                size={20}
                                                color="#FF4081"
                                            />
                                        )}
                                    </View>
                                    <Text className="text-[#1E1E1E] text-[15px] font-medium">
                                        {switchingMode
                                            ? "Switching..."
                                            : "Switch to my cycle"}
                                    </Text>
                                </View>
                                <Feather name="chevron-right" size={20} color="#C7C7CC" />
                            </TouchableOpacity>
                        </View>

                        {/* Stop pairing */}
                        <View className="w-full border-t border-[#F5E6EC] pt-4 pb-2">
                            <TouchableOpacity
                                onPress={() => setShowUnpairModal(true)}
                                className="flex-row items-center justify-between"
                                activeOpacity={0.7}
                                disabled={unpairingLoading}
                            >
                                <View className="flex-row items-center">
                                    <View className="mr-3">
                                        {unpairingLoading ? (
                                            <ActivityIndicator
                                                size="small"
                                                color="#FF4081"
                                            />
                                        ) : (
                                            <Feather
                                                name="link-2"
                                                size={20}
                                                color="#FF4081"
                                            />
                                        )}
                                    </View>
                                    <Text className="text-[#1E1E1E] text-[15px] font-medium">
                                        {unpairingLoading ? "Unpairing..." : "Stop pairing"}
                                    </Text>
                                </View>
                                <Feather name="chevron-right" size={20} color="#C7C7CC" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Info note */}
                    <View className="mt-6 px-2">
                        <Text className="text-white/60 text-xs text-center leading-5">
                            Switching cycles returns you to your personal dashboard.{"\n"}
                            Unpairing will permanently disconnect you from your partner.
                        </Text>
                    </View>
                </ScrollView>
            )}

            {/* Floating Gift Token Button */}
            {!loading && !errorMessage && (
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
                        <Text className="text-white text-base font-bold ml-2">
                            Gift Token
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Bottom Navigation */}
            <PartnerBottomNavigation
                activeTab={activeTab}
                onTabPress={handleTabPress}
            />

            {/* Unpair Confirmation Modal */}
            <Modal
                visible={showUnpairModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowUnpairModal(false)}
            >
                <View className="flex-1 justify-end bg-black/40">
                    <View className="bg-[#FFF0F5] w-full rounded-t-[32px] pt-4 pb-8 px-6 items-center">
                        <View className="w-12 h-1.5 bg-[#E5E5EA] rounded-full mb-8" />
                        <Text className="text-[22px] font-bold text-[#1E1E1E] mb-3">
                            Unpair with Partner
                        </Text>
                        <Text className="text-center text-[#616161] text-[15px] mb-8 leading-[22px]">
                            Are you sure you want to unpair with your partner? This cannot
                            be undone.
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
