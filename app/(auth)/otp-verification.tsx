import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SignupColors } from '@/constants/signup-theme';
import { PrimaryButton } from '@/components/signup/primary-button';
import { BackButton } from '@/components/signup/back-button';
import { CustomStatusBar } from '@/components/signup/custom-status-bar';
import { OtpInput } from '@/components/signup/otp-input';

export default function OtpVerificationScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(15);
  const [canResend, setCanResend] = useState(false);

  const isFormValid = otp.length === 4;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = () => {
    if (isFormValid) {
      // Navigate to reset password screen
      router.push('/(auth)/reset-password');
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      // Reset countdown
      setCountdown(15);
      setCanResend(false);
      setOtp('');
      // TODO: Trigger resend OTP API call
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
            <Text style={styles.title}>Enter OTP Code</Text>
            <Text style={styles.subtitle}>
              Enter the 4 digits code that was sent to your email address.
            </Text>
          </View>

          {/* OTP Input Section */}
          <View style={styles.otpSection}>
            <OtpInput
              length={4}
              value={otp}
              onChange={setOtp}
            />

            {/* Resend Code */}
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={!canResend}
              activeOpacity={0.7}
            >
              <Text style={[styles.resendText, canResend && styles.resendTextActive]}>
                {canResend ? 'Resend code' : `Resend code in ${countdown}s`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <PrimaryButton
            title="Verify Password"
            onPress={handleVerify}
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
    marginBottom: 32,
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
  otpSection: {
    alignItems: 'center',
    gap: 24,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '400',
    color: SignupColors.bodyText,
  },
  resendTextActive: {
    color: SignupColors.titleText,
    fontWeight: '600',
    textDecorationLine: 'underline',
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
