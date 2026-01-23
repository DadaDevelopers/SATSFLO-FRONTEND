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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isFormValid =
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword;

  const handleSavePassword = () => {
    if (isFormValid) {
      // Navigate to login screen after password reset
      router.replace('/(auth)/login');
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
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Provide a new password to secure access to your account.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              showPasswordToggle
              autoCapitalize="none"
              autoComplete="new-password"
            />

            <InputField
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              showPasswordToggle
              autoCapitalize="none"
              autoComplete="new-password"
            />
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <PrimaryButton
            title="Save New Password"
            onPress={handleSavePassword}
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
