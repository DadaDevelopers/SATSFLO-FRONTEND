import { PartnerBottomNavigation } from "@/components/home/partner-bottom-navigation";
import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [loading, setLoading] = useState(true);

  // Cycle data from API
  const [partnerNickname, setPartnerNickname] = useState("Partner");
  const [cyclePhase, setCyclePhase] = useState<string | null>(null);
  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [daysUntilPeriod, setDaysUntilPeriod] = useState<number | null>(null);
  const [daysUntilOvulation, setDaysUntilOvulation] = useState<number | null>(
    null,
  );
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<string | null>(null);
  const [sexDriveLevel, setSexDriveLevel] = useState<string | null>(null);
  const [pregnancyChance, setPregnancyChance] = useState<string | null>(null);

  const loadCycleData = useCallback(async () => {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { response, data } = await api.get("/partner/cycle", token);
      if (response.ok) {
        const d = data?.data ?? data;
        if (d?.partner_nickname) setPartnerNickname(d.partner_nickname);
        if (d?.phase) setCyclePhase(d.phase);
        if (d?.current_day != null) setCycleDay(d.current_day);
        if (d?.days_until_next_period != null)
          setDaysUntilPeriod(d.days_until_next_period);
        if (d?.days_until_ovulation != null)
          setDaysUntilOvulation(d.days_until_ovulation);
        if (Array.isArray(d?.symptoms)) setSymptoms(d.symptoms);
        if (d?.mood) setMood(d.mood);
        if (d?.sex_drive) setSexDriveLevel(d.sex_drive);
        if (d?.pregnancy_chance) setPregnancyChance(d.pregnancy_chance);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCycleData();
  }, [loadCycleData]);

  const isPeriod = cyclePhase === "menstruation" || cyclePhase === "period";

  const handleBack = () => {
    router.back();
  };

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
        // Already on home
        break;
      default:
        break;
    }
  };

  const handleGiftTokenPress = () => {
    router.push("/(tabs)/gift-token-wallet");
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
          {partnerNickname}'s Cycle
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 120, // Leave room for floating button
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Period Status (Hero Section) */}
          <View className="items-center mt-6 mb-8">
            <Text className="text-white text-[16px] font-medium tracking-wide mb-2">
              {isPeriod
                ? "Period"
                : cyclePhase
                  ? cyclePhase.charAt(0).toUpperCase() + cyclePhase.slice(1)
                  : "Cycle"}
            </Text>
            <Text
              className="text-white font-extrabold mb-3 tracking-tight"
              style={{ fontSize: 38, fontFamily: "impact" }}
            >
              {cycleDay != null ? `Day ${cycleDay}` : "—"}
            </Text>
            <Text className="text-white text-[17px]">
              {daysUntilOvulation != null
                ? `Next ovulation: ${daysUntilOvulation} day${daysUntilOvulation !== 1 ? "s" : ""} left`
                : daysUntilPeriod != null
                  ? `Next period: ${daysUntilPeriod} day${daysUntilPeriod !== 1 ? "s" : ""} left`
                  : ""}
            </Text>
          </View>

          {/* Common Card Style: very light pink/purple #F8F1FF, highly rounded */}

          {/* Cycle Phase Card */}
          <View className="bg-[#F8F1FF] rounded-[24px] p-5 mb-4 shadow-sm">
            <Text className="text-[#B551E5] text-[18px] font-bold mb-2">
              Cycle Phase
            </Text>
            <Text className="text-[#616161] text-[15px] leading-5 mb-3">
              {isPeriod
                ? "Your partner is on their period. Keep in touch and stay connected. They need you more now."
                : cyclePhase
                  ? `Your partner is in the ${cyclePhase} phase. Keep in touch and stay connected.`
                  : "Your partner's cycle phase is not available."}
            </Text>
            {cycleDay != null && (
              <Text className="text-[#1E1E1E] font-bold text-[16px]">
                Cycle Day {cycleDay}
              </Text>
            )}
          </View>

          {/* Today's Symptoms Card */}
          <View className="bg-[#F8F1FF] rounded-[24px] p-5 mb-4 shadow-sm">
            <Text className="text-[#B551E5] text-[18px] font-bold mb-2">
              Today's Symptoms
            </Text>

            {symptoms.length > 0 ? (
              <>
                <Text className="text-[#616161] text-[15px] leading-5 mb-4">
                  Here's what your partner is logging. Each of these symptoms
                  matter, please take note.
                </Text>
                <View className="flex-row flex-wrap gap-2 mb-4">
                  {symptoms.map((s) => (
                    <View
                      key={s}
                      className="bg-white border border-[#EBEBEB] flex-row items-center px-3 py-1.5 rounded-full shadow-sm"
                    >
                      <Text className="text-[#B551E5] font-semibold">{s}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text className="text-[#616161] text-[15px] leading-5 mb-4">
                No symptoms logged today, it might be a good day for your
                partner.
              </Text>
            )}

            <Text className="text-[#1E1E1E] text-[15px] font-bold italic">
              Make her happy by sending her some SATS ⚡ (click on the gift
              token button)
            </Text>
          </View>

          {/* Pregnancy Chance Card */}
          <View className="bg-[#F8F1FF] rounded-[24px] p-6 mb-4 flex-row justify-between items-center shadow-sm">
            <View>
              <Text className="text-[#B551E5] text-[18px] font-bold mb-2">
                Pregnancy Chance
              </Text>
              <Text className="text-[#1E1E1E] text-[18px] font-extrabold flex-1 flex-col">
                {pregnancyChance ?? "—"}
              </Text>
            </View>
            <View className="justify-center items-center mt-2">
              <PregnancyCurve />
            </View>
          </View>

          {/* Moods & Sex Drive Cards */}
          <View className="flex-row justify-between mb-4 gap-4">
            <View className="bg-[#F8F1FF] rounded-[24px] p-5 flex-1 items-center shadow-sm">
              <Text className="text-[#B551E5] text-[18px] font-bold mb-4">
                Moods
              </Text>
              <View className="w-[50px] h-[50px] justify-center items-center mb-3">
                <Text style={{ fontSize: 40 }}>{mood ? "🙂" : "💠"}</Text>
              </View>
              <Text className="text-[#1E1E1E] font-bold text-[16px]">
                {mood ?? "No log"}
              </Text>
            </View>

            <View className="bg-[#F8F1FF] rounded-[24px] p-5 flex-1 items-center shadow-sm">
              <Text className="text-[#B551E5] text-[18px] font-bold mb-4">
                Sex Drive
              </Text>
              <View className="w-[50px] h-[50px] justify-center items-center mb-3">
                <Feather name="heart" size={40} color="#FFB3C6" />
              </View>
              <Text className="text-[#1E1E1E] font-bold text-[16px]">
                {sexDriveLevel ?? "No log"}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

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
          <Text className="text-white text-base font-medium ml-2">
            Gift Token
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <PartnerBottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}
