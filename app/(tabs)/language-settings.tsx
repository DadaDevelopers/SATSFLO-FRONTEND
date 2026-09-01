import { useLanguage, SupportedLanguage } from "@/context/language-context";
import { Feather } from "@expo/vector-icons";
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

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["English", "Swahili"];

const OTHER_LANGUAGES = [
  "Spanish",
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
  const { language, setLanguage, t } = useLanguage();
  const [selected, setSelected] = useState<SupportedLanguage>(language);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setLanguage(selected);
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
          {t("language.title")}
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
          {/* Active / Supported languages */}
          {SUPPORTED_LANGUAGES.map((lang, index) => (
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
                borderBottomWidth: 0.8,
                borderBottomColor: "#FFD6E4",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter",
                  fontWeight: selected === lang ? "600" : "400",
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

          {/* Languages coming soon */}
          {OTHER_LANGUAGES.map((lang, index) => (
            <View
              key={lang}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 12,
                height: 53,
                borderBottomWidth: index < OTHER_LANGUAGES.length - 1 ? 0.8 : 0,
                borderBottomColor: "#FFD6E4",
                opacity: 0.5,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter",
                  fontWeight: "400",
                  fontSize: 14,
                  lineHeight: 21,
                  color: "#616161",
                }}
              >
                {lang}
              </Text>

              <View
                style={{
                  backgroundColor: "rgba(255,64,129,0.15)",
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontSize: 11,
                    fontWeight: "500",
                    color: "#FF4081",
                  }}
                >
                  {t("common.coming_soon")}
                </Text>
              </View>
            </View>
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
            {saving ? t("common.saving") : t("language.save_changes")}
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
