import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/signup/primary-button';
import { BackButton } from '@/components/signup/back-button';
import { CalendarPicker } from '@/components/signup/calendar-picker';
import { HomeIndicatorArea } from '@/components/signup/home-indicator-area';
import { TitleSection } from '@/components/signup/title-section';

export default function LastPeriodScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Default to a date like October 12 (as shown in the design)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2024, 9, 12));

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-signup-bg" style={{ paddingTop: insets.top }}>
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
          {/* Back Button - positioned at top */}
          <View className="pt-4 pb-4">
            <BackButton />
          </View>

          {/* Title Section */}
          <TitleSection
            title="Your last period"
            subtitle="When did your last period start?"
            stepIndicator="3/3"
            className="mb-4"
          />

          {/* Calendar Section - takes full width */}
          <View className="w-full">
            <CalendarPicker
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              periodLength={4}
            />
          </View>

          {/* Flexible spacer */}
          <View className="flex-1 min-h-4" />
        </ScrollView>

        {/* Bottom Section - Fixed at bottom */}
        <View className="px-5 pb-3 pt-2">
          <View className="items-center">
            <PrimaryButton title="Finish" onPress={handleFinish} disabled={!selectedDate} />
          </View>
        </View>
      </View>

      <HomeIndicatorArea />
    </View>
  );
}
