import { BackButton } from "@/components/signup/back-button";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { OtpInput } from "@/components/signup/otp-input";
import { PrimaryButton } from "@/components/signup/primary-button";
import { TitleSection } from "@/components/signup/title-section";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OtpVerificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const isFormValid = otp.length === 6;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      const { response, data } = await api.post("/auth/verify-otp", {
        email,
        otp,
      });
      console.log("Verify OTP response:", data);
      if (response.ok) {
        const token = data?.data?.reset_token ?? data?.reset_token ?? data?.data?.token ?? data?.token;
        setStatusMessage({ text: "OTP verified!", type: "success" });
        setTimeout(() => {
          router.push({
            pathname: "/(auth)/reset-password",
            params: { token },
          });
        }, 800);
      } else {
        const message =
          data?.message || data?.error || "Invalid OTP. Please try again.";
        setStatusMessage({ text: message, type: "error" });
      }
    } catch {
      setStatusMessage({
        text: "Error verifying OTP. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setCountdown(60);
    setCanResend(false);
    setOtp("");
    setStatusMessage(null);
    try {
      const { response, data } = await api.post("/auth/forgot-password", {
        email,
      });
      console.log("Resend OTP response:", data);
      if (response.ok) {
        setStatusMessage({
          text: "OTP resent! Check your email.",
          type: "success",
        });
      } else {
        setStatusMessage({
          text: data?.message || "Failed to resend OTP.",
          type: "error",
        });
      }
    } catch {
      setStatusMessage({ text: "Error resending OTP.", type: "error" });
    }
  };

  return (
    <View className="flex-1 bg-signup-bg" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              title="Enter OTP Code"
              subtitle="Enter the 6 digit code that was sent to your email address."
              className="mb-10"
            />

            <View className="items-center gap-6">
              <OtpInput length={6} value={otp} onChange={setOtp} />

              <TouchableOpacity
                onPress={handleResendCode}
                disabled={!canResend}
                activeOpacity={0.7}
              >
                <Text
                  className={cn(
                    "text-sm font-normal text-[#FAFAFA]",
                    canResend && "font-semibold underline"
                  )}
                >
                  {canResend ? "Resend code" : `Resend code in ${countdown}s`}
                  {canResend ? "Resend code" : `Resend code in ${countdown}s`}
                </Text>
              </TouchableOpacity>
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
              title={loading ? "Verifying..." : "Verify Password"}
              onPress={handleVerify}
              disabled={loading || !isFormValid}
            />
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
              title={loading ? "Verifying..." : "Verify Password"}
              onPress={handleVerify}
              disabled={loading || !isFormValid}
            />
          </View>
        </View>

        <HomeIndicatorArea />
      </KeyboardAvoidingView>
    </View>
  );
}
