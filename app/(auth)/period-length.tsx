import { BackButton } from "@/components/signup/back-button";
import { DayPicker } from "@/components/signup/day-picker";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { PrimaryButton } from "@/components/signup/primary-button";
import { TitleSection } from "@/components/signup/title-section";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PERIOD_LENGTH_OPTIONS = Array.from({ length: 7 }, (_, i) => i + 3); // 3-9 days
const MAX_CONTENT_WIDTH = 480;

export default function PeriodLengthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;
  const { cycleLength } = useLocalSearchParams<{ cycleLength: string }>();
  const [selectedLength, setSelectedLength] = useState(5);

  const handleNext = () => {
    router.push({
      pathname: "/(auth)/last-period",
      params: { cycleLength, periodLength: selectedLength },
    });
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
        <View className="flex-1 px-6">
          {/* Back Button - positioned at top */}
          <View className="pt-4 pb-2">
            <BackButton />
          </View>

          {/* Title Section */}
          <TitleSection
            title="Tell us about your period"
            subtitle="What is your period length?"
            stepIndicator="2/3"
            className="mb-14"
          />

          {/* Picker Section */}
          <View>
            <DayPicker
              values={PERIOD_LENGTH_OPTIONS}
              selectedValue={selectedLength}
              onValueChange={setSelectedLength}
              suffix="days"
            />
          </View>
        </View>

        {/* Bottom Section - Fixed at bottom */}
        <View className="px-5 pb-3 pt-2">
          <View className="items-center">
            <PrimaryButton title="Next" onPress={handleNext} />
          </View>
        </View>

        <HomeIndicatorArea />
      </View>
    </View>
  );
}
