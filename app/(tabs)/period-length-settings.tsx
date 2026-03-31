import { DayPicker } from "@/components/signup/day-picker";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PERIOD_LENGTH_OPTIONS = Array.from({ length: 7 }, (_, i) => i + 3);

export default function PeriodLengthSettingsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedLength, setSelectedLength] = useState(5);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useFocusEffect(
    useCallback(() => {
      setSuccessMsg("");
      const loadProfile = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) return;
        try {
          const { response, data } = await api.get("/cycle-profile", token);
          if (response.ok) {
            const profile = data?.data ?? data;
            if (profile?.period_length) setSelectedLength(profile.period_length);
          }
        } catch {}
      };
      loadProfile();
    }, [])
  );

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg("");
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) { Alert.alert("Error", "Not logged in. Please sign in again."); return; }
      const { response, data } = await api.put("/cycle-profile", { period_length: selectedLength }, token);
      if (!response.ok) {
        Alert.alert("Error", data?.message || data?.error || "Failed to save. Please try again.");
        return;
      }
      setSuccessMsg("Period length saved successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        router.push("/(tabs)/settings" as any);
      }, 1000);
    } catch {
      Alert.alert("Error", "Network error. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      {/* Header */}
      <View className="flex-row items-center px-5" style={{ marginTop: insets.top + 28 }}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/settings" as any)}>
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white font-inter font-medium text-xl">
          Period Length
        </Text>
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

      {/* Save Button + success message */}
      <View style={{ alignItems: "center", paddingBottom: 24, gap: 10 }}>
        {successMsg ? (
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "500" }}>{successMsg}</Text>
        ) : null}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
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
            opacity: saving ? 0.7 : 1,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "500", fontSize: 15 }}>
            {saving ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <HomeIndicatorArea />
    </View>
  );
}
