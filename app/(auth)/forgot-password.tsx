import { BackButton } from "@/components/signup/back-button";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { InputField } from "@/components/signup/input-field";
import { PrimaryButton } from "@/components/signup/primary-button";
import { TitleSection } from "@/components/signup/title-section";
import { api } from "@/lib/api";
import logger from "@/lib/logger";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const isFormValid = email.trim() !== "";

  const handleRecoverPassword = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      const { response, data } = await api.post("/auth/forgot-password", {
        email,
      });
      logger.log("Forgot password response:", data);
      if (response.ok) {
        setStatusMessage({ text: "OTP sent! Check your email.", type: "success" });
        setTimeout(() => {
          router.push({
            pathname: "/(auth)/otp-verification",
            params: { email },
          });
        }, 800);
      } else {
        const message = data?.message || data?.error || "Failed to send OTP.";
        setStatusMessage({ text: message, type: "error" });
      }
    } catch {
      setStatusMessage({
        text: "Error sending OTP. Please try again.",
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
              title="Forgot Password"
              subtitle="Please, enter email address registered with this account to request for a new password."
              className="mb-4"
            />

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
              title={loading ? "Sending..." : "Recover Password"}
              onPress={handleRecoverPassword}
              disabled={loading || !isFormValid}
            />
          </View>
        </View>

        <HomeIndicatorArea />
      </KeyboardAvoidingView>
    </View>
  );
}
