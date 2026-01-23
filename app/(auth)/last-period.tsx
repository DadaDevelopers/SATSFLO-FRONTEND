import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SignupColors } from '@/constants/signup-theme';
import { PrimaryButton } from '@/components/signup/primary-button';
import { BackButton } from '@/components/signup/back-button';
import { CalendarPicker } from '@/components/signup/calendar-picker';
import { CustomStatusBar } from '@/components/signup/custom-status-bar';

export default function LastPeriodScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  // Default to a date like October 12 (as shown in the design)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2024, 9, 12));

  const handleFinish = () => {
    // Navigate to the main app
    router.replace('/(tabs)');
  };

  // Calculate if we need scrolling based on screen height
  const isSmallScreen = height < 700;

  return (
    <View style={styles.container}>
      {/* Custom Status Bar */}
      <CustomStatusBar />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          !isSmallScreen && styles.scrollContentFlex,
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.content}>
          {/* Back Button */}
          <View style={styles.header}>
            <BackButton />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Your last period</Text>
              <Text style={styles.stepIndicator}>3/3</Text>
            </View>
            <Text style={styles.subtitle}>When did your last period start?</Text>
          </View>

          {/* Calendar Section */}
          <View style={styles.calendarSection}>
            <CalendarPicker
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              periodLength={4}
            />
          </View>
        </View>

        {/* Spacer to push button down on larger screens */}
        <View style={styles.spacer} />

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <PrimaryButton
            title="Finish"
            onPress={handleFinish}
            disabled={!selectedDate}
          />
        </View>
      </ScrollView>

      {/* Home Indicator Area */}
      <View style={styles.homeIndicatorArea}>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SignupColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  scrollContentFlex: {
    minHeight: '100%',
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  titleSection: {
    gap: 4,
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    color: SignupColors.titleText,
  },
  stepIndicator: {
    fontSize: 18,
    fontWeight: '600',
    color: SignupColors.titleText,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17,
    color: SignupColors.bodyText,
  },
  calendarSection: {
    // No flex: 1, let the calendar take its natural height
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  homeIndicatorArea: {
    height: 34,
    backgroundColor: SignupColors.homeIndicatorBackground,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: SignupColors.homeIndicator,
    borderRadius: 100,
  },
});
