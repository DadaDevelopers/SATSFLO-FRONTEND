import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InputField } from '@/components/signup/input-field';
import { PrimaryButton } from '@/components/signup/primary-button';
import { BackButton } from '@/components/signup/back-button';
import { HomeIndicatorArea } from '@/components/signup/home-indicator-area';
import { TitleSection } from '@/components/signup/title-section';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isFormValid =
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword;

  const handleSavePassword = () => {
    if (isFormValid) {
      router.replace('/(auth)/login');
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
              title="Reset Password"
              subtitle="Provide a new password to secure access to your account."
              className="mb-6"
            />

            {/* Form Section */}
            <View className="gap-4">
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
          </View>
        </ScrollView>

        {/* Bottom Section - Fixed at bottom */}
        <View className="px-5 pb-3 pt-2">
          <View className="items-center">
            <PrimaryButton
              title="Save New Password"
              onPress={handleSavePassword}
              disabled={!isFormValid}
            />
          </View>
        </View>

        <HomeIndicatorArea />
      </KeyboardAvoidingView>
    </View>
  );
}
