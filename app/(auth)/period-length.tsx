import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/signup/primary-button';
import { BackButton } from '@/components/signup/back-button';
import { DayPicker } from '@/components/signup/day-picker';
import { HomeIndicatorArea } from '@/components/signup/home-indicator-area';
import { TitleSection } from '@/components/signup/title-section';

const PERIOD_LENGTH_OPTIONS = Array.from({ length: 7 }, (_, i) => i + 3); // 3-9 days

export default function PeriodLengthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedLength, setSelectedLength] = useState(5);

  const handleNext = () => {
    router.push('/(auth)/last-period');
  };

  return (
    <View className="flex-1 bg-signup-bg" style={{ paddingTop: insets.top }}>
      <View className="flex-1 px-5">
        {/* Back Button - positioned at top */}
        <View className="pt-4 pb-4">
          <BackButton />
        </View>

        {/* Title Section */}
        <TitleSection
          title="Tell us about your period"
          subtitle="What is your period length?"
          stepIndicator="2/3"
          className="mb-6"
        />

        {/* Picker Section - centered vertically */}
        <View className="flex-1 justify-center">
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
  );
}
