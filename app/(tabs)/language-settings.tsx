import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LANGUAGES = [
  "English",
  "Spanish",
  "Swahili",
  "Arabic",
  "Hindi",
  "French",
  "German",
  "Russian",
  "Mandarin",
  "Portuguese",
  "Indonesia",
  "Urdu",
];

export default function LanguageSettingsScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("English");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        await api.put("/users/profile", { language: selected }, token);
      }
    } catch {}
    setSaving(false);
    router.push("/(tabs)/settings" as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FF4081" }}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          marginTop: insets.top + 20,
          height: 32,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/settings" as any)}
          activeOpacity={0.7}
          style={{ width: 32 }}
        >
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>

        {/* Centered title */}
        <Text
          style={{
            flex: 1,
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: 20,
            lineHeight: 24,
            letterSpacing: -0.3,
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          Language Preference
        </Text>

        {/* Spacer to balance the back arrow */}
        <View style={{ width: 32 }} />
      </View>

      {/* Language list card */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "#FFE6EE",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {LANGUAGES.map((lang, index) => (
            <TouchableOpacity
              key={lang}
              onPress={() => setSelected(lang)}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 12,
                height: 53,
                borderBottomWidth: index < LANGUAGES.length - 1 ? 0.8 : 0,
                borderBottomColor: "#FFD6E4",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter",
                  fontWeight: "400",
                  fontSize: 14,
                  lineHeight: 21,
                  color: "#1E1E1E",
                }}
              >
                {lang}
              </Text>

              {selected === lang && (
                <Feather name="check-circle" size={18} color="#4DC721" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom: Save button + home indicator */}
      <View style={{ alignItems: "center", gap: 20 }}>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
          style={{
            width: 250,
            height: 56,
            backgroundColor: "#FF82AD",
            borderWidth: 0.5,
            borderColor: "#FF669A",
            borderRadius: 1000,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter",
              fontWeight: "500",
              fontSize: 15,
              lineHeight: 18,
              color: "#FFFFFF",
            }}
          >
            {saving ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>

        {/* Home indicator bar */}
        <View
          style={{
            width: "100%",
            height: 34,
            backgroundColor: "#FF3378",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 8,
          }}
        />
      </View>
    </View>
  );
}
