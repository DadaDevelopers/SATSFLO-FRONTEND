import { DayPicker } from "@/components/signup/day-picker";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Animated,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const KNOB_OFF = 1;
const KNOB_ON = 11;

function CustomToggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  const knobPos = useRef(new Animated.Value(value ? KNOB_ON : KNOB_OFF)).current;

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
      <View style={{ width: 27, height: 16, justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: 24, height: 14.67, backgroundColor: value ? "#FF4081" : "#D9D9D9", borderRadius: 100 }}>
          <Animated.View
            style={{
              width: 12, height: 12, top: 1.33, left: knobPos,
              position: "absolute", backgroundColor: "#FFFFFF", borderRadius: 100,
              shadowColor: "#FF4081", shadowOffset: { width: 0, height: 1.39 },
              shadowOpacity: 0.21, shadowRadius: 3.72, elevation: 2,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const CYCLE_LENGTH_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 21);

export default function CycleLengthSettingsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedLength, setSelectedLength] = useState(28);
  const [ignoreIrregular, setIgnoreIrregular] = useState(true);
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
            if (profile?.cycle_length) setSelectedLength(profile.cycle_length);
            if (profile?.ignore_irregular_cycle !== undefined)
              setIgnoreIrregular(profile.ignore_irregular_cycle);
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
      const { response, data } = await api.put(
        "/cycle-profile",
        { cycle_length: selectedLength, ignore_irregular_cycle: ignoreIrregular },
        token
      );
      if (!response.ok) {
        Alert.alert("Error", data?.message || data?.error || "Failed to save. Please try again.");
        return;
      }
      setSuccessMsg("Cycle length saved successfully!");
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
          Cycle Length
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Picker + toggle */}
      <View className="flex-1 px-5 justify-start mt-10 gap-3">
        <DayPicker
          values={CYCLE_LENGTH_OPTIONS}
          selectedValue={selectedLength}
          onValueChange={setSelectedLength}
          suffix="days"
        />
        <View className="bg-[#FFE6EE] rounded-lg flex-row items-center justify-between px-3 py-4 mt-6">
          <Text className="text-sm text-[#1E1E1E]">Ignore irregular cycle</Text>
          <CustomToggle value={ignoreIrregular} onToggle={() => setIgnoreIrregular((v) => !v)} />
        </View>
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
            width: 250, height: 56, backgroundColor: "#FF82AD",
            borderRadius: 1000, alignItems: "center", justifyContent: "center",
            borderWidth: 0.5, borderColor: "#FF669A", opacity: saving ? 0.7 : 1,
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
