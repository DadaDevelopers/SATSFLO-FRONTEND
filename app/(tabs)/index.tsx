import { BottomNavigation } from "@/components/home/bottom-navigation";
import { CycleWheel } from "@/components/home/cycle-wheel";
import { FollicularPhaseModal } from "@/components/home/follicular-phase-modal";
import { HomeHeader } from "@/components/home/home-header";
import { LutealPhaseModal } from "@/components/home/luteal-phase-modal";
import { MenstrualPhaseModal } from "@/components/home/menstrual-phase-modal";
import { OvulationPhaseModal } from "@/components/home/ovulation-phase-modal";
import { PhaseLegend } from "@/components/home/phase-legend";
import { cycleProfileService, CycleProfileWithPredictions } from "@/services/cycle-profile.service";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabName = "home" | "calendar" | "add" | "chat" | "settings";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const [showMenstrualModal, setShowMenstrualModal] = useState(false);
  const [showFollicularModal, setShowFollicularModal] = useState(false);
  const [showLutealModal, setShowLutealModal] = useState(false);
  const [showOvulationModal, setShowOvulationModal] = useState(false);
  const [cycleProfile, setCycleProfile] = useState<CycleProfileWithPredictions | null>(null);

  useEffect(() => {
    cycleProfileService.get().then(setCycleProfile).catch(() => {});
  }, []);

  // Derive display values from API data; fall back to sensible defaults while loading
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", { month: "long", day: "numeric" }) + (
    (() => {
      const d = today.getDate();
      const s = ["th","st","nd","rd"];
      const v = d % 100;
      return s[(v - 20) % 10] ?? s[v] ?? s[0];
    })()
  );
  const cycleData = {
    currentDay: cycleProfile
      ? cycleProfile.cycle_length - cycleProfile.days_until_next_period
      : 1,
    cycleLength: cycleProfile?.cycle_length ?? 28,
    periodLength: cycleProfile?.period_length ?? 5,
    daysUntilPeriod: cycleProfile?.days_until_next_period ?? 0,
    currentDate: formattedDate,
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
    router.push("/edit-period");
  };

  const handleNotificationPress = () => {
    // Navigate to notifications
    router.push("/(tabs)/notifications");
  };

  const handleGiftTokenPress = () => {
    router.push("/(tabs)/gift-token");
  };

  const handleJournalPress = () => {
    router.push("/journal");
  };

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: "#FF4081" }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      {/* Header */}
      <HomeHeader onNotificationPress={handleNotificationPress} />

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cycle Wheel */}
        <View className="items-center mt-4">
          <CycleWheel
            currentDay={cycleData.currentDay}
            cycleLength={cycleData.cycleLength}
            periodLength={cycleData.periodLength}
            daysUntilPeriod={cycleData.daysUntilPeriod}
            currentDate={cycleData.currentDate}
            onEditPeriod={handleEditPeriod}
          />
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
  );
}
