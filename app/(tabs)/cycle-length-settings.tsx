import { DayPicker } from "@/components/signup/day-picker";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// knob travels from left=1 (OFF) to right=1 → left=11 (ON)
const KNOB_OFF = 1;
const KNOB_ON = 11;

function CustomToggle({
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
        style={{
          width: 27,
          height: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Background pill */}
        <View
          style={{
            width: 24,
            height: 14.67,
            backgroundColor: value ? "#FF4081" : "#D9D9D9",
            borderRadius: 100,
          }}
        >
          {/* Animated knob */}
          <Animated.View
            style={{
              width: 12,
              height: 12,
              top: 1.33,
              left: knobPos,
              position: "absolute",
              backgroundColor: "#FFFFFF",
              borderRadius: 100,
              shadowColor: "#FF4081",
              shadowOffset: { width: 0, height: 1.39 },
              shadowOpacity: 0.21,
              shadowRadius: 3.72,
              elevation: 2,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const CYCLE_LENGTH_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 21); // 21–35 days

export default function CycleLengthSettingsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedLength, setSelectedLength] = useState(28);
  const [ignoreIrregular, setIgnoreIrregular] = useState(true);

  const handleSave = () => {
    Alert.alert("Saved", `Cycle length set to ${selectedLength} days.`, [
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
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/settings" as any)}
        >
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-white font-inter font-medium text-xl">
          Cycle Length
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Picker + Ignore irregular cycle toggle */}
      <View className="flex-1 px-5 justify-start mt-10 gap-3">
        <DayPicker
          values={CYCLE_LENGTH_OPTIONS}
          selectedValue={selectedLength}
          onValueChange={setSelectedLength}
          suffix="days"
        />

        {/* Ignore irregular cycle toggle */}
        <View className="bg-[#FFE6EE] rounded-lg flex-row items-center justify-between px-3 py-4 mt-6">
          <Text className="text-sm text-[#1E1E1E]">Ignore irregular cycle</Text>
          <CustomToggle
            value={ignoreIrregular}
            onToggle={() => setIgnoreIrregular((v) => !v)}
          />
        </View>
      </View>

      {/* Save Button */}
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
