import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/signup/primary-button';
import { BackButton } from '@/components/signup/back-button';
import { HomeIndicatorArea } from '@/components/signup/home-indicator-area';
import { TitleSection } from '@/components/signup/title-section';
import { OtpInput } from '@/components/signup/otp-input';
import { cn } from '@/lib/utils';

export default function OtpVerificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      router.push('/(auth)/reset-password');
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setCountdown(15);
      setCanResend(false);
      setOtp('');
    }
  };

  return (
    <View className="flex-1 bg-signup-bg" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button - positioned at top */}
          <View className="pt-4 pb-2">
            <BackButton />
          </View>

          {/* Content */}
          <View className="w-full pt-8 pb-8">
            {/* Title Section */}
            <TitleSection
              title="Enter OTP Code"
              subtitle="Enter the 4 digits code that was sent to your email address."
              className="mb-10"
            />

            {/* OTP Input Section */}
            <View className="items-center gap-6">
              <OtpInput length={4} value={otp} onChange={setOtp} />

              {/* Resend Code */}
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={!canResend}
                activeOpacity={0.7}
              >
                <Text
                  className={cn(
                    'text-sm font-normal text-[#FAFAFA]',
                    canResend && 'font-semibold underline'
                  )}
                >
                  {canResend ? 'Resend code' : `Resend code in ${countdown}s`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Section - Fixed at bottom */}
        <View className="px-6 pb-4 pt-4">
          <View className="items-center">
            <PrimaryButton title="Verify Password" onPress={handleVerify} disabled={!isFormValid} />
          </View>
        </View>

        <HomeIndicatorArea />
      </KeyboardAvoidingView>
    </View>
  );
}
