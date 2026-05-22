import { BackButton } from "@/components/signup/back-button";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { InputField } from "@/components/signup/input-field";
import { PrimaryButton } from "@/components/signup/primary-button";
import { TitleSection } from "@/components/signup/title-section";
import { api } from "@/lib/api";
import logger from "@/lib/logger";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useLocalSearchParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const isFormValid =
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    password === confirmPassword;

  const handleSavePassword = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      const { response, data } = await api.post(
        `/auth/reset-password/${token}`,
        {
          password,
          confirm_password: confirmPassword,
        }
      );
      logger.log("Reset password response:", data);
      if (response.ok) {
        setStatusMessage({
          text: "Password reset successfully!",
          type: "success",
        });
        setTimeout(() => router.replace("/(auth)/login"), 1200);
      } else {
        const message =
          data?.message || data?.error || "Failed to reset password.";
        setStatusMessage({ text: message, type: "error" });
      }
    } catch {
      setStatusMessage({
        text: "Error resetting password. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
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
          <View className="pt-4 pb-2">
            <BackButton />
          </View>

          <View className="w-full pt-8 pb-8">
            <TitleSection
              title="Reset Password"
              subtitle="Provide a new password to secure access to your account."
              className="mb-4"
            />

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

        <View className="px-6 pb-4 pt-4">
          <View className="items-center gap-4">
            {statusMessage && (
              <View
                className="w-full rounded-xl px-4 py-3"
                style={{
                  backgroundColor:
                    statusMessage.type === "success"
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(0,0,0,0.25)",
                }}
              >
                <Text className="text-sm text-center font-medium text-white">
                  {statusMessage.text}
                </Text>
              </View>
            )}
            <PrimaryButton
              title={loading ? "Saving..." : "Save New Password"}
              onPress={handleSavePassword}
              disabled={loading || !isFormValid}
            />
          </View>
        </View>

        <HomeIndicatorArea />
      </KeyboardAvoidingView>
    </View>
  );
}
