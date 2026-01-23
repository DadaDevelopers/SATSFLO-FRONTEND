import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SignupColors } from '@/constants/signup-theme';
import { PrimaryButton } from '@/components/signup/primary-button';
import { BackButton } from '@/components/signup/back-button';
import { DayPicker } from '@/components/signup/day-picker';
import { CustomStatusBar } from '@/components/signup/custom-status-bar';

const CYCLE_LENGTH_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 21); // 21-35 days

export default function CycleLengthScreen() {
  const router = useRouter();
  const [selectedLength, setSelectedLength] = useState(27);

  const handleNext = () => {
    router.push('/(auth)/period-length');
  };

  return (
    <View style={styles.container}>
      {/* Custom Status Bar */}
      <CustomStatusBar />

      <View style={styles.content}>
        {/* Back Button */}
        <View style={styles.header}>
          <BackButton />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Tell us about your cycle</Text>
            <Text style={styles.stepIndicator}>1/3</Text>
          </View>
          <Text style={styles.subtitle}>What is your cycle length?</Text>
        </View>

        {/* Picker Section */}
        <View style={styles.pickerSection}>
          <DayPicker
            values={CYCLE_LENGTH_OPTIONS}
            selectedValue={selectedLength}
            onValueChange={setSelectedLength}
            suffix="days"
          />
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <PrimaryButton title="Next" onPress={handleNext} />
      </View>

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  titleSection: {
    gap: 4,
    marginBottom: 40,
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
  pickerSection: {
    flex: 1,
    paddingTop: 20,
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
