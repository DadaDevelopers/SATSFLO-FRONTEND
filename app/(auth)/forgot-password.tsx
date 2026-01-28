import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InputField } from '@/components/signup/input-field';
import { PrimaryButton } from '@/components/signup/primary-button';
import { BackButton } from '@/components/signup/back-button';
import { HomeIndicatorArea } from '@/components/signup/home-indicator-area';
import { TitleSection } from '@/components/signup/title-section';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');

  const isFormValid = email.trim() !== '';

  const handleRecoverPassword = () => {
    if (isFormValid) {
      router.push('/(auth)/otp-verification');
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
            paddingHorizontal: 20,
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button - positioned at top */}
          <View className="absolute top-4 left-0">
            <BackButton />
          </View>

          {/* Center content */}
          <View className="w-full py-16">
            {/* Title Section */}
            <TitleSection
              title="Forgot Password"
              subtitle="Please, enter email address registered with this account to request for a new password."
              className="mb-6"
            />

            {/* Form Section */}
            <View className="gap-4">
              <InputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Section - Fixed at bottom */}
        <View className="px-5 pb-3 pt-2">
          <View className="items-center">
            <PrimaryButton
              title="Recover Password"
              onPress={handleRecoverPassword}
              disabled={!isFormValid}
            />
          </View>
        </View>

        <HomeIndicatorArea />
      </KeyboardAvoidingView>
    </View>
  );
}
