import { PartnerBottomNavigation } from "@/components/home/partner-bottom-navigation";
import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { default as React, default as React, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

type TabName = "home" | "calendar" | "settings";

interface CycleData {
  phase?: string;
  cycle_day?: number;
  next_period_days?: number;
  next_ovulation_days?: number;
  symptoms?: string[];
  mood?: string;
  sex_drive?: string;
  pregnancy_chance?: string;
  is_period?: boolean;
  period_start_date?: string;
}

function PregnancyCurve() {
  return (
    <Svg width={90} height={40} viewBox="0 0 90 40">
      <Path
        d="M 5 30 L 50 30 C 56 30 60 5 66 5 C 72 5 76 30 82 30 L 85 30"
        stroke="#D1A3FF"
        strokeWidth={2}
        fill="none"
        transform="translate(0, 4)"
      />
      <Path
        d="M 5 30 L 50 30 C 56 30 60 5 66 5 C 72 5 76 30 82 30 L 85 30"
        stroke="#B551E5"
        strokeWidth={3}
        fill="none"
      />
    </Svg>
  );
}

function getSymptomEmoji(symptom: string): string {
  const map: Record<string, string> = {
    headache: "🤕",
    cramps: "😖",
    bloating: "😣",
    fatigue: "😴",
    nausea: "🤢",
    mood_swings: "😤",
    back_pain: "😰",
  };
  return map[symptom.toLowerCase()] ?? "💊";
}

function getMoodEmoji(mood: string): string {
  const map: Record<string, string> = {
    happy: "😊",
    okay: "🙂",
    sad: "😢",
    anxious: "😰",
    irritable: "😤",
    energetic: "⚡",
  };
  return map[mood.toLowerCase()] ?? "😐";
}

export default function PartnerDashboardScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabName>("home");

  // Data state
  const [partnerNickname, setPartnerNickname] = useState<string>("Babe");
  const [cycleData, setCycleData] = useState<CycleData | null>(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

      const [partnerRes, cycleRes] = await Promise.all([
        api.get("/partner", token),
        api.get("/partner/cycle", token),
      ]);

      if (partnerRes.response.ok) {
        const d = partnerRes.data?.data ?? partnerRes.data;
        if (d?.partner_nickname) setPartnerNickname(d.partner_nickname);
      }

      if (cycleRes.response.ok) {
        const c = cycleRes.data?.data ?? cycleRes.data;
        setCycleData(c);
      } else {
        const msg = cycleRes.data?.message ?? "";
        if (
          msg.toLowerCase().includes("not shared") ||
          msg.toLowerCase().includes("permission")
        ) {
          setErrorMessage("Your partner hasn't shared their cycle data yet.");
        } else {
          setErrorMessage(msg || "Failed to load cycle data.");
        }
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

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    switch (tab) {
      case "calendar":
        router.push("/partner/calendar" as any);
        break;
      case "settings":
        router.push("/partner/settings" as any);
        break;
      case "home":
        break;
    }
  };

  const handleGiftTokenPress = () => router.push("/(tabs)/send-gift-token");

  const isPeriod = cycleData?.is_period ?? false;
  const nextOvulation = cycleData?.next_ovulation_days;
  const nextPeriod = cycleData?.next_period_days;

  const heroLabel = isPeriod ? "Period" : "Next Ovulation";
  const heroValue = isPeriod
    ? "Period Day"
    : nextOvulation != null
      ? `${nextOvulation} Days Left`
      : "—";
  const heroSub = isPeriod
    ? nextPeriod != null
      ? `Next period: ${nextPeriod} days left`
      : ""
    : nextPeriod != null
      ? `Next period: ${nextPeriod} days left`
      : "";

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: "#3F0A66" }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#3F0A66" />

      {/* Header */}
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-[18px] font-medium mr-6">
          {partnerNickname}'s Cycle
        </Text>
        {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
      </View>

      {/* Loading state */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#B551E5" />
          <Text className="text-white mt-4 text-base">Loading cycle data…</Text>
        </View>
      ) : errorMessage ? (
        <View className="flex-1 items-center justify-center px-8">
          <Feather name="lock" size={48} color="rgba(181,81,229,0.6)" />
          <Text className="text-white text-center mt-4 text-base leading-6">
            {errorMessage}
          </Text>
          <TouchableOpacity
            onPress={fetchData}
            className="mt-6 rounded-full px-8 py-3"
            style={{ backgroundColor: "#7B2CBF" }}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View className="items-center mt-6 mb-8">
            <Text className="text-white text-[16px] font-medium tracking-wide mb-2">
              {heroLabel}
            </Text>
            <Text
              className="text-white font-extrabold mb-3 tracking-tight"
              style={{ fontSize: 34, fontFamily: "impact" }}
            >
              {heroValue}
            </Text>
            {heroSub ? (
              <Text className="text-white text-[16px]">{heroSub}</Text>
            ) : null}
          </View>

          {/* Cycle Phase Card */}
          <View className="bg-[#F8F1FF] rounded-[24px] p-5 mb-4 shadow-sm">
            <Text className="text-[#B551E5] text-[18px] font-bold mb-2">
              Cycle Phase
            </Text>
            <Text className="text-[#616161] text-[15px] leading-5 mb-3">
              {isPeriod
                ? `${partnerNickname} is on their period. Keep in touch and stay connected. They need you more now.`
                : `${partnerNickname} is in the ${cycleData?.phase ?? "follicular"} phase. Keep in touch and stay connected.`}
            </Text>
            <Text className="text-[#1E1E1E] font-bold text-[16px]">
              Cycle Day {cycleData?.cycle_day ?? "—"}
            </Text>
          </View>

          {/* Today's Symptoms Card */}
          <View className="bg-[#F8F1FF] rounded-[24px] p-5 mb-4 shadow-sm">
            <Text className="text-[#B551E5] text-[18px] font-bold mb-2">
              Today's Symptoms
            </Text>
            {cycleData?.symptoms && cycleData.symptoms.length > 0 ? (
              <>
                <Text className="text-[#616161] text-[15px] leading-5 mb-4">
                  Here's what {partnerNickname} is logging. Each symptom matters
                  — take note.
                </Text>
                <View className="flex-row flex-wrap gap-2 mb-4">
                  {cycleData.symptoms.map((s, i) => (
                    <View
                      key={i}
                      className="bg-white border border-[#EBEBEB] flex-row items-center px-3 py-1.5 rounded-full shadow-sm"
                    >
                      <Text className="text-[14px]">{getSymptomEmoji(s)}</Text>
                      <Text className="text-[#B551E5] ml-2 font-semibold capitalize">
                        {s.replace(/_/g, " ")}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text className="text-[#616161] text-[15px] leading-5 mb-4">
                No symptoms logged today — it might be a good day for{" "}
                {partnerNickname}!
              </Text>
            )}
            <Text className="text-[#1E1E1E] text-[15px] font-bold italic">
              Make them happy by sending some SATS ⚡ (tap Gift Token)
            </Text>
          </View>

          {/* Pregnancy Chance Card */}
          <View className="bg-[#F8F1FF] rounded-[24px] p-6 mb-4 flex-row justify-between items-center shadow-sm">
            <View>
              <Text className="text-[#B551E5] text-[18px] font-bold mb-2">
                Pregnancy Chance
              </Text>
              <Text className="text-[#1E1E1E] text-[18px] font-extrabold capitalize">
                {cycleData?.pregnancy_chance ?? "Low"}
              </Text>
            </View>
            <View className="justify-center items-center mt-2">
              <PregnancyCurve />
            </View>
          </View>

          {/* Moods & Sex Drive */}
          <View className="flex-row justify-between mb-4 gap-4">
            <View className="bg-[#F8F1FF] rounded-[24px] p-5 flex-1 items-center shadow-sm">
              <Text className="text-[#B551E5] text-[18px] font-bold mb-4">
                Mood
              </Text>
              {cycleData?.mood ? (
                <>
                  <View
                    className="w-[50px] h-[50px] rounded-full justify-center items-center mb-3"
                    style={{ backgroundColor: "#FFF3B0" }}
                  >
                    <Text style={{ fontSize: 28, lineHeight: 34 }}>
                      {getMoodEmoji(cycleData.mood)}
                    </Text>
                  </View>
                  <Text className="text-[#1E1E1E] font-bold text-[15px] capitalize">
                    {cycleData.mood}
                  </Text>
                </>
              ) : (
                <>
                  <View className="w-[50px] h-[50px] justify-center items-center mb-3">
                    <Text style={{ fontSize: 36, color: "#B551E5" }}>💠</Text>
                  </View>
                  <Text className="text-[#1E1E1E] font-bold text-[15px]">
                    No log
                  </Text>
                </>
              )}
            </View>

            <View className="bg-[#F8F1FF] rounded-[24px] p-5 flex-1 items-center shadow-sm">
              <Text className="text-[#B551E5] text-[18px] font-bold mb-4">
                Sex Drive
              </Text>
              {cycleData?.sex_drive ? (
                <>
                  <View className="w-[50px] h-[50px] rounded-full justify-center items-center mb-3">
                    <Feather name="heart" size={36} color="#FFB3C6" />
                  </View>
                  <Text className="text-[#1E1E1E] font-bold text-[15px] capitalize">
                    {cycleData.sex_drive}
                  </Text>
                </>
              ) : (
                <>
                  <View className="w-[50px] h-[50px] justify-center items-center mb-3">
                    <Text style={{ fontSize: 36 }}>🌸</Text>
                  </View>
                  <Text className="text-[#1E1E1E] font-bold text-[15px]">
                    No log
                  </Text>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      )}

      {/* Floating Gift Token Button */}
      {!loading && (
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
            <Text className="text-white text-base font-medium ml-2">
              Gift Token
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Navigation */}
      <PartnerBottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}
