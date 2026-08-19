import { BottomNavigation } from "@/components/home/bottom-navigation";
import { CycleTracker } from "@/components/home/cycle-tracker";
import { FollicularPhaseModal } from "@/components/home/follicular-phase-modal";
import { HomeHeader } from "@/components/home/home-header";
import { LutealPhaseModal } from "@/components/home/luteal-phase-modal";
import { MenstrualPhaseModal } from "@/components/home/menstrual-phase-modal";
import { OvulationPhaseModal } from "@/components/home/ovulation-phase-modal";
import { PhaseLegend } from "@/components/home/phase-legend";
import { ResponsiveScreen } from "@/components/ui/responsive-container";
import { api } from "@/lib/api";
import { registerForPushNotifications } from "@/lib/notifications";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabName = "home" | "calendar" | "add" | "chat" | "settings";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function formatCurrentDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}${getOrdinalSuffix(date.getDate())}`;
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const trackerSize = Math.min(windowWidth - 40, 320);
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const [emailVerified, setEmailVerified] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [resending, setResending] = useState(false);
  const pushRegistered = useRef(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMenstrualModal, setShowMenstrualModal] = useState(false);
  const [showFollicularModal, setShowFollicularModal] = useState(false);
  const [showLutealModal, setShowLutealModal] = useState(false);
  const [showOvulationModal, setShowOvulationModal] = useState(false);

  const today = new Date();
  const [cycleData, setCycleData] = useState({
    currentDay: 1,
    cycleLength: 28,
    periodLength: 5,
    ovulationDay: 14,
    daysUntilPeriod: 0,
    currentDate: formatCurrentDate(today),
    cycleStartDate: today,
  });

  useFocusEffect(useCallback(() => {
    const loadCycleData = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;

      // Register FCM device token once per session
      if (!pushRegistered.current) {
        pushRegistered.current = true;
        registerForPushNotifications(token).catch(() => {});
      }

      try {
        // Load cycle-profile (source of truth for user settings), current cycle, and predictions in parallel
        const [profileRes, currentRes, predictionsRes, meRes, notifRes] = await Promise.all([
          api.get("/cycle-profile", token),
          api.get("/cycles/current", token),
          api.get("/cycles/predictions", token),
          api.get("/auth/me", token),
          api.get("/notifications", token),
        ]);

        if (notifRes.response.ok) {
          const list: Array<{ is_read?: boolean }> = notifRes.data?.data ?? notifRes.data ?? [];
          setUnreadCount(Array.isArray(list) ? list.filter((n) => !n.is_read).length : 0);
        }

        if (meRes.response.ok) {
          const me = meRes.data?.data ?? meRes.data;
          setEmailVerified(me?.emailVerified ?? true);
          setUserEmail(me?.email ?? "");
        }

        const profile = profileRes.response.ok ? (profileRes.data?.data ?? profileRes.data) : null;
        const cycleD = currentRes.response.ok ? (currentRes.data?.data ?? null) : null;
        const predD = predictionsRes.response.ok ? (predictionsRes.data?.data ?? null) : null;

        // cycle_length and period_length always come from the user's saved profile.
        // Guard against 0/negative/non-numeric values (e.g. an unfinished profile) —
        // `??` only falls back on null/undefined, so an explicit 0 from the API would
        // otherwise reach CycleTracker and divide-by-zero into NaN SVG path data,
        // which crashes on Android.
        const toPositiveNumber = (n: unknown, fallback: number): number =>
          typeof n === "number" && Number.isFinite(n) && n > 0 ? n : fallback;
        const cycleLength = toPositiveNumber(
          profile?.cycle_length,
          toPositiveNumber(cycleD?.cycle_length, 28)
        );
        const periodLength = toPositiveNumber(
          profile?.period_length,
          toPositiveNumber(cycleD?.period_length, 5)
        );

        // Days until next period — predictions first, then current cycle
        const daysUntilPeriod =
          predD?.days_until_next_period ??
          predD?.next_period?.days_until ??
          cycleD?.days_until_next_period ??
          cycleD?.days_until_period ??
          profile?.days_until_period ??
          0;

        const buildCycleStart = (currentDay: number): Date => {
          const d = new Date(today);
          d.setDate(today.getDate() - (currentDay - 1));
          return d;
        };

        const cd = cycleD?.current_day ?? profile?.current_day ?? 1;
        setCycleData({
          currentDay: cd,
          cycleLength,
          periodLength,
          ovulationDay: cycleD?.ovulation_day ?? Math.round(cycleLength / 2),
          daysUntilPeriod,
          currentDate: formatCurrentDate(today),
          cycleStartDate: buildCycleStart(cd),
        });
      } catch {}
    };
    loadCycleData();
  }, []));

  const handleResendVerification = async () => {
    setResending(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;
      await api.post("/auth/resend-verification", {}, token);
    } catch {}
    setResending(false);
  };

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    // Navigate to respective screens
    switch (tab) {
      case "calendar":
        router.push("/calendar");
        break;
      case "add":
        router.push("/add-log");
        break;
      case "chat":
        router.push("/(tabs)/thread" as any);
        break;
      case "settings":
        router.push("/(tabs)/settings" as any);
        break;
      default:
        break;
    }
  };

  const handleEditPeriod = () => {
    router.push({
      pathname: "/(auth)/last-period",
      params: { isEdit: "true" },
    });
  };

  const handleNotificationPress = () => {
    setUnreadCount(0);
    router.push("/(tabs)/notifications");
  };

  const handleGiftTokenPress = () => {
    router.push("/(tabs)/gift-token");
  };

  const handleJournalPress = () => {
    router.push("/journal");
  };

  return (
    <ResponsiveScreen>
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: "#FF4081" }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      {/* Header */}
      <HomeHeader onNotificationPress={handleNotificationPress} unreadCount={unreadCount} />

      {/* Email Verification Banner */}
      {!emailVerified && !bannerDismissed && (
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 8,
            borderRadius: 12,
            padding: 14,
            backgroundColor: "#FF82AD",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 14 }}>
            Please verify your email
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 2 }}>
            {userEmail
              ? `Check your inbox (${userEmail}) for a verification link.`
              : "Check your inbox for a verification link."}
          </Text>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <TouchableOpacity
              onPress={handleResendVerification}
              disabled={resending}
              style={{
                backgroundColor: "#FF82AD",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.5)",
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 7,
              }}
              activeOpacity={0.7}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "500" }}>
                {resending ? "Sending..." : "Resend email"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBannerDismissed(true)}
              style={{ backgroundColor: "#FF82AD", borderWidth: 1, borderColor: "rgba(255,255,255,0.5)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 }}
              activeOpacity={0.7}
            >
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cycle Tracker */}
        <View style={{ width: '100%', alignItems: 'center', marginTop: 16 }}>
        <View style={{ width: trackerSize, height: trackerSize }}>
          <CycleTracker
            currentDay={cycleData.currentDay}
            cycleLength={cycleData.cycleLength}
            periodLength={cycleData.periodLength}
            cycleStartDate={cycleData.cycleStartDate}
            size={trackerSize}
          />
          {/* Center overlay: date, countdown, edit button */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontFamily: "Inter", fontSize: 12, color: "#FAFAFA", marginBottom: 6 }}>
              Today: {cycleData.currentDate}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 20,
                color: "#FFFFFF",
                textAlign: "center",
                lineHeight: 30,
              }}
            >
              {cycleData.daysUntilPeriod} days until your{"\n"}next period
            </Text>
            <TouchableOpacity
              onPress={handleEditPeriod}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#FAFAFA",
                gap: 5,
                marginTop: 12,
              }}
            >
              <Feather name="edit-2" size={10} color="#FFFFFF" />
              <Text style={{ fontFamily: "Inter", fontSize: 12, color: "#FFFFFF" }}>
                Edit Period
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>

        {/* Phase Legend */}
        <PhaseLegend
          onMenstrualPhasePress={() => setShowMenstrualModal(true)}
          onFollicularPhasePress={() => setShowFollicularModal(true)}
          onLutealPhasePress={() => setShowLutealModal(true)}
          onOvulationPhasePress={() => setShowOvulationModal(true)}
        />

        {/* Gift Token Button */}
        <View className="items-center pt-20 pb-10">
          <TouchableOpacity
            onPress={handleGiftTokenPress}
            className="flex-row items-center justify-center px-4 py-3 rounded-full"
            style={{
              backgroundColor: "#FF4081",
              borderWidth: 1,
              borderColor: "#FFB4CD",
            }}
            activeOpacity={0.8}
          >
            <Feather name="gift" size={24} color="#FFFFFF" />
            <Text className="text-white text-md ml-2">Gift Token</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="h-[1.5px] bg-home-card-border my-6" />

        {/* My SatsFlow Journal Section */}
        <View className="items-center mt-10">
          <Image
            source={require("@/assets/images/Group 48.png")}
            className="w-64 h-64"
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={handleJournalPress}
            className="mt-4 px-5 py-4 rounded-full"
            style={{
              backgroundColor: "#FF4081",
              borderWidth: 1,
              borderColor: "#FFB4CD",
            }}
            activeOpacity={0.8}
          >
            <Text className="text-white text-sm">My SatsFlow Journal</Text>
          </TouchableOpacity>
        </View>

        {/* Extra spacing for scroll */}
        <View className="h-20" />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />

      {/* Menstrual Phase Modal */}
      <MenstrualPhaseModal
        visible={showMenstrualModal}
        onClose={() => setShowMenstrualModal(false)}
      />

      {/* Follicular Phase Modal */}
      <FollicularPhaseModal
        visible={showFollicularModal}
        onClose={() => setShowFollicularModal(false)}
      />

      {/* Luteal Phase Modal */}
      <LutealPhaseModal
        visible={showLutealModal}
        onClose={() => setShowLutealModal(false)}
      />

      {/* Ovulation Phase Modal */}
      <OvulationPhaseModal
        visible={showOvulationModal}
        onClose={() => setShowOvulationModal(false)}
      />
    </View>
    </ResponsiveScreen>
  );
}
