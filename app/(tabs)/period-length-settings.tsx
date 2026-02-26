import { DayPicker } from "@/components/signup/day-picker";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PERIOD_LENGTH_OPTIONS = Array.from({ length: 7 }, (_, i) => i + 3); // 3–9 days

export default function PeriodLengthSettingsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedLength, setSelectedLength] = useState(5);

  const handleSave = () => {
    Alert.alert("Saved", `Period length set to ${selectedLength} days.`, [
      { text: "OK", onPress: () => router.push("/(tabs)/settings") },
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
        <TouchableOpacity onPress={() => router.push("/(tabs)/settings")}>
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-white font-inter font-medium text-xl">
          Period Length
        </Text>

        {/* Spacer to keep title centered */}
        <View style={{ width: 24 }} />
      </View>

      {/* Picker */}
      <View className="flex-1 px-5 justify-start mt-10">
        <DayPicker
          values={PERIOD_LENGTH_OPTIONS}
          selectedValue={selectedLength}
          onValueChange={setSelectedLength}
          suffix="days"
        />
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
