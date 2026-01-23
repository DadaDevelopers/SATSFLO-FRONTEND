import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SignupColors } from '@/constants/signup-theme';
import { InputField } from '@/components/signup/input-field';
import { PrimaryButton } from '@/components/signup/primary-button';
import { BackButton } from '@/components/signup/back-button';
import { CustomStatusBar } from '@/components/signup/custom-status-bar';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const isFormValid = email.trim() !== '';

  const handleRecoverPassword = () => {
    if (isFormValid) {
      // Navigate to OTP screen
      router.push('/(auth)/otp-verification');
    }
  };

  return (
    <View style={styles.container}>
      {/* Custom Status Bar */}
      <CustomStatusBar />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <View style={styles.header}>
            <BackButton />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Please, enter email address registered with this account to request for a new password.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <PrimaryButton
            title="Recover Password"
            onPress={handleRecoverPassword}
            disabled={!isFormValid}
          />
        </View>

        {/* Home Indicator Area */}
        <View style={styles.homeIndicatorArea}>
          <View style={styles.homeIndicator} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SignupColors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  titleSection: {
    gap: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    color: SignupColors.titleText,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17,
    color: SignupColors.bodyText,
  },
  formSection: {
    gap: 20,
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
