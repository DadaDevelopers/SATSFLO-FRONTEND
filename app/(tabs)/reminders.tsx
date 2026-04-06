import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Knob travel positions inside the 27px-wide pill
const KNOB_OFF = 1.75;
const KNOB_ON = 12.25;

function ReminderToggle({
  value,
  onToggle,
}: {
  value: boolean;
  onToggle: () => void;
}) {
  const knobPos = useRef(
    new Animated.Value(value ? KNOB_ON : KNOB_OFF),
  ).current;

  const handlePress = () => {
    Animated.timing(knobPos, {
      toValue: value ? KNOB_OFF : KNOB_ON,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onToggle();
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <View
        style={{ width: 30, height: 18, justifyContent: "center", alignItems: "center" }}
      >
        {/* Background pill */}
        <View
          style={{
            width: 27,
            height: 16.5,
            backgroundColor: value ? "#FF4081" : "rgba(120,120,128,0.16)",
            borderRadius: 100,
          }}
        >
          {/* Animated knob */}
          <Animated.View
            style={{
              width: 13,
              height: 13,
              top: 1.75,
              left: knobPos,
              position: "absolute",
              backgroundColor: "#FFFFFF",
              borderRadius: 100,
              shadowColor: value ? "#FF4081" : "#000000",
              shadowOffset: { width: 0, height: 1.51 },
              shadowOpacity: value ? 0.21 : 0.15,
              shadowRadius: 4.03,
              elevation: 2,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

type ReminderKey = "periodStarts" | "periodEnds" | "fertility" | "ovulation" | "medicine";

const REMINDER_ROWS: {
  key: ReminderKey;
  title: string;
  subtitle: string;
  defaultOn: boolean;
}[] = [
  {
    key: "periodStarts",
    title: "Period starts",
    subtitle: "Next period - 20 days left",
    defaultOn: true,
  },
  {
    key: "periodEnds",
    title: "Period ends",
    subtitle: "Remind me to log period end",
    defaultOn: true,
  },
  {
    key: "fertility",
    title: "Fertility",
    subtitle: "Remind me before fertile days",
    defaultOn: false,
  },
  {
    key: "ovulation",
    title: "Ovulation",
    subtitle: "Remind me when my ovulation starts",
    defaultOn: false,
  },
  {
    key: "medicine",
    title: "Medicine",
    subtitle: "Remind me to take my pills",
    defaultOn: false,
  },
];

export default function RemindersScreen() {
  const insets = useSafeAreaInsets();

  const [toggles, setToggles] = useState<Record<ReminderKey, boolean>>(
    Object.fromEntries(REMINDER_ROWS.map((r) => [r.key, r.defaultOn])) as Record<
      ReminderKey,
      boolean
    >,
  );

  const flipToggle = (key: ReminderKey) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  // Load saved preferences on mount
  useEffect(() => {
    const load = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;
      try {
        const { response, data } = await api.get("/users/preferences", token);
        if (response.ok) {
          const prefs = data?.data?.reminders ?? data?.reminders;
          if (prefs) setToggles((prev) => ({ ...prev, ...prefs }));
        }
      } catch {}
    };
    load();
  }, []);

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      try {
        await api.put("/users/preferences", { reminders: toggles }, token);
      } catch {}
    }
    Alert.alert("Saved", "Your reminder preferences have been updated.", [
      { text: "OK", onPress: () => router.push("/(tabs)/settings" as any) },
    ]);
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      {/* Header */}
      <View
        className="flex-row items-center px-5"
        style={{ marginTop: insets.top + 28 }}
      >
        <TouchableOpacity onPress={() => router.push("/(tabs)/settings" as any)}>
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-white font-inter font-medium text-xl tracking-tight">
          Reminders
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Reminder rows card */}
      <View className="flex-1 px-5 mt-10">
        <View className="bg-[#FFE6EE] rounded-xl overflow-hidden">
          {REMINDER_ROWS.map((row, index) => {
            const isLast = index === REMINDER_ROWS.length - 1;
            return (
              <View key={row.key}>
                <View className="flex-row justify-between items-center px-3 py-4">
                  {/* Text stack */}
                  <View className="flex-col gap-1">
                    <Text className="text-sm text-[#1E1E1E] leading-[21px]">
                      {row.title}
                    </Text>
                    <Text
                      className="text-xs text-[#333333] tracking-tight"
                      style={{ opacity: 0.8 }}
                    >
                      {row.subtitle}
                    </Text>
                  </View>

                  {/* Toggle */}
                  <ReminderToggle
                    value={toggles[row.key]}
                    onToggle={() => flipToggle(row.key)}
                  />
                </View>

                {/* Divider */}
                {!isLast && (
                  <View
                    style={{ height: 0.8, backgroundColor: "#DBE2E8", marginHorizontal: 12 }}
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Save button */}
      <View style={{ alignItems: "center", paddingBottom: 24 }}>
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.8}
          style={{
            width: 250,
            height: 56,
            backgroundColor: "#FF82AD",
            borderRadius: 1000,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 0.5,
            borderColor: "#FF669A",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "500", fontSize: 15 }}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <HomeIndicatorArea />
    </View>
  );
}
