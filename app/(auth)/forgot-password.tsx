import { BackButton } from "@/components/signup/back-button";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { InputField } from "@/components/signup/input-field";
import { PrimaryButton } from "@/components/signup/primary-button";
import { TitleSection } from "@/components/signup/title-section";
import { authService } from "@/services/auth.service";
import { handleApiError } from "@/utils/handleApiError";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = email.trim() !== "";

  const handleRecoverPassword = async () => {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await authService.forgotPassword(email.trim());
      Alert.alert(
        'Email Sent',
        'Check your inbox for a password reset link.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
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
              title="Forgot Password"
              subtitle="Please, enter email address registered with this account to request for a new password."
              className="mb-4"
            />

            {/* Form Section */}
            <View className="gap-5">
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
        <View className="px-6 pb-4 pt-4">
          <View className="items-center">
            <PrimaryButton
              title={isSubmitting ? "Sending..." : "Recover Password"}
              onPress={handleRecoverPassword}
              disabled={!isFormValid || isSubmitting}
            />
          </View>
        </View>

        <HomeIndicatorArea />
      </KeyboardAvoidingView>
    </View>
  );
}
