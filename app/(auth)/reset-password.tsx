import { BackButton } from "@/components/signup/back-button";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { InputField } from "@/components/signup/input-field";
import { PrimaryButton } from "@/components/signup/primary-button";
import { TitleSection } from "@/components/signup/title-section";
import { authService } from "@/services/auth.service";
import { handleApiError } from "@/utils/handleApiError";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Token arrives via email deep-link: /(auth)/reset-password?token=xxx
  const { token } = useLocalSearchParams<{ token: string }>();

  const isFormValid =
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    password === confirmPassword;

  const handleSavePassword = async () => {
    if (!isFormValid || isSubmitting) return;
    if (!token) {
      Alert.alert('Error', 'Reset token is missing. Please use the link from your email.');
      return;
    }
    setIsSubmitting(true);
    try {
      await authService.resetPassword(token, password);
      Alert.alert('Password Reset', 'Your password has been updated. Please sign in.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (err) {
      Alert.alert('Error', handleApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-signup-bg" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              title="Reset Password"
              subtitle="Provide a new password to secure access to your account."
              className="mb-4"
            />

            {/* Form Section */}
            <View className="gap-5">
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
        <View className="px-6 pb-4 pt-4">
          <View className="items-center">
            {!token && (
              <Text className="text-red-300 text-xs text-center mb-3">
                No reset token found. Please use the link from your email.
              </Text>
            )}
            <PrimaryButton
              title={isSubmitting ? "Saving..." : "Save New Password"}
              onPress={handleSavePassword}
              disabled={!isFormValid || isSubmitting || !token}
            />
          </View>
        </View>

        <HomeIndicatorArea />
      </KeyboardAvoidingView>
    </View>
  );
}
