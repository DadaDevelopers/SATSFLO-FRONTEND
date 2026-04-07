import { api } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Custom toggle matching the Figma spec (27×16.5 background, 13×13 knob)
function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
      <View
        style={{
          width: 27,
          height: 16.5,
          borderRadius: 8.25,
          backgroundColor: value ? "#FF4081" : "rgba(120,120,128,0.16)",
          justifyContent: "center",
          paddingHorizontal: 1.75,
        }}
      >
        <View
          style={{
            width: 13,
            height: 13,
            borderRadius: 6.5,
            backgroundColor: "#FFFFFF",
            alignSelf: value ? "flex-end" : "flex-start",
            shadowColor: value ? "#FF4081" : "#000000",
            shadowOffset: { width: 0, height: 1.51 },
            shadowOpacity: value ? 0.15 : 0.15,
            shadowRadius: 2,
            elevation: 2,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}

const SHARE_OPTIONS = [
  { id: "period", label: "Period start and end dates", defaultOn: true },
  { id: "fertile", label: "Fertile window and ovulation", defaultOn: true },
  { id: "symptoms", label: "Symptoms and moods", defaultOn: false },
  { id: "insights", label: "Full cycle insights", defaultOn: false },
  { id: "sex", label: "Sex drive", defaultOn: false },
];

export default function SharingInviteScreen() {
  const insets = useSafeAreaInsets();

  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(SHARE_OPTIONS.map((o) => [o.id, o.defaultOn]))
  );
  // Load existing partner sharing settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;
      try {
        const { response, data } = await api.get("/partner/settings", token);
        if (response.ok) {
          const s = data?.data ?? data;
          if (s) {
            setToggles({
              period: s.share_period_dates ?? true,
              fertile: s.share_fertile_window ?? true,
              symptoms: s.share_symptoms_moods ?? false,
              insights: s.share_cycle_insights ?? false,
              sex: s.share_sex_drive ?? false,
            });
          }
        }
      } catch {}
    };
    loadSettings();
  }, []);

  const handleToggle = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNext = () => {
    router.push({
      pathname: "/(tabs)/generate-invite",
      params: {
        share_period_dates: String(toggles.period),
        share_fertile_window: String(toggles.fertile),
        share_symptoms_moods: String(toggles.symptoms),
        share_cycle_insights: String(toggles.insights),
        share_sex_drive: String(toggles.sex),
      },
    } as any);
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Header — back arrow | Sharing Options | Skip */}
      <View
        className="flex-row items-center justify-between px-5"
        style={{ marginTop: insets.top + 28, height: 24 }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/invite-partner" as any)}
          activeOpacity={0.7}
          style={{ width: 24 }}
        >
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>

        <Text className="font-inter font-medium text-xl text-white tracking-[-0.3px]">
          Sharing Options
        </Text>

        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text className="font-inter font-medium text-sm text-[#FAFAFA] tracking-[-0.3px]">
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Subtitle */}
      <Text
        className="font-inter text-sm text-white tracking-[-0.01em]"
        style={{ marginTop: 15, marginHorizontal: 20 }}
      >
        What do you want to share?
      </Text>

      {/* Options card */}
      <View
        style={{
          marginTop: 20,
          marginHorizontal: 20,
          backgroundColor: "#FFE6EE",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {SHARE_OPTIONS.map((option, index) => (
          <View
            key={option.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 16,
              paddingHorizontal: 12,
              height: 50,
              borderBottomWidth: index < SHARE_OPTIONS.length - 1 ? 0.8 : 0,
              borderBottomColor: "#FFD6E4",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter",
                fontSize: 14,
                lineHeight: 18,
                color: "#1E1E1E",
              }}
            >
              {option.label}
            </Text>
            <Toggle
              value={toggles[option.id]}
              onToggle={() => handleToggle(option.id)}
            />
          </View>
        ))}
      </View>

      {/* Push button to bottom */}
      <View className="flex-1" />

      {/* Next button */}
      <View className="items-center" style={{ paddingBottom: 20 }}>
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.8}
          className="w-[250px] h-14 bg-[#FF82AD] rounded-full items-center justify-center"
        >
          <Text className="font-inter font-medium text-[15px] text-white">
            Next
          </Text>
        </TouchableOpacity>
      </View>

      {/* Home indicator */}
      <View
        className="bg-[#FF3378] items-center justify-end"
        style={{ paddingBottom: Math.max(insets.bottom, 8) + 3, paddingTop: 8 }}
      >
        <View className="w-[134px] h-[5px] bg-[#FF99BC] rounded-full" />
      </View>
    </View>
  );
}
