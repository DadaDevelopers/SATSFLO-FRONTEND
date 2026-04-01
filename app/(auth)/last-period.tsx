import { BackButton } from "@/components/signup/back-button";
import { CalendarPicker } from "@/components/signup/calendar-picker";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { PrimaryButton } from "@/components/signup/primary-button";
import { TitleSection } from "@/components/signup/title-section";
import { api } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_CONTENT_WIDTH = 480;

export default function LastPeriodScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;

  const { cycleLength, periodLength, isEdit } = useLocalSearchParams<{
    cycleLength: string;
    periodLength: string;
    isEdit: string;
  }>();
  const editing = isEdit === "true";

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleFinish = async () => {
    // Validation
    if (!selectedDate) {
      setStatusMessage({
        text: "Please select your last period start date.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "Not authenticated. Please log in again.");
        setLoading(false);
        return;
      }
      let response, data;
      if (editing) {
        ({ response, data } = await api.put(
          "/cycle-profile",
          { last_period_start: dateStr },
          token,
        ));
      } else {
        ({ response, data } = await api.post(
          "/cycle-profile",
          {
            last_period_start: dateStr,
            cycle_length: Number(cycleLength) || 28,
            period_length: Number(periodLength) || 5,
            luteal_phase_length: 14,
            ignore_irregular_cycle: false,
          },
          token,
        ));
      }
      if (!response.ok) {
        const msg =
          data?.message ?? data?.error ?? `Server error (${response.status})`;
        Alert.alert("Save failed", msg);
        setLoading(false);
        return;
      }
    } catch (err: any) {
      Alert.alert(
        "Network error",
        err?.message ?? "Could not reach the server.",
      );
      setLoading(false);
      return;
    }
    setLoading(false);
    if (editing) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: isDesktop ? "#f5f5f5" : "#FF4081",
        paddingTop: isDesktop ? 20 : insets.top,
        paddingBottom: isDesktop ? 20 : 0,
      }}
    >
      <View
        className="flex-1"
        style={
          isDesktop
            ? {
                maxWidth: MAX_CONTENT_WIDTH,
                maxHeight: 844,
                width: "100%",
                alignSelf: "center",
                backgroundColor: "#FF4081",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
                elevation: 8,
                borderRadius: 24,
                overflow: "hidden",
              }
            : undefined
        }
      >
        <View className="flex-1">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
            }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Back Button */}
            <View className="pt-4 pb-4">
              <BackButton />
            </View>

            {/* Title Section */}
            <TitleSection
              title={editing ? "Edit Last Period" : "Your last period"}
              subtitle="When did your last period start?"
              stepIndicator={editing ? undefined : "3/3"}
              className="mb-10"
            />

            {/* Calendar Section */}
            <View className="w-full">
              <CalendarPicker
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                periodLength={4}
              />
            </View>

            <View className="flex-1 min-h-4" />
          </ScrollView>

          {/* Bottom Section */}
          <View className="px-5 pb-3 pt-2">
            {/* Status message */}
            {statusMessage && (
              <View
                className="w-full rounded-xl px-4 py-3 mb-3"
                style={{
                  backgroundColor:
                    statusMessage.type === "success"
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(0,0,0,0.25)",
                }}
              >
                <Text className="text-sm text-center font-medium text-white">
                  {statusMessage.text}
                </Text>
              </View>
            )}

            <View className="items-center">
              <PrimaryButton
                title={loading ? "Saving..." : editing ? "Save" : "Finish"}
                onPress={handleFinish}
                disabled={!selectedDate || loading}
              />
            </View>
          </View>
        </View>

        <HomeIndicatorArea />
      </View>
    </View>
  );
}
