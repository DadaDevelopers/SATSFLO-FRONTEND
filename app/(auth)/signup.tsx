import { BackButton } from "@/components/signup/back-button";
import { Checkbox } from "@/components/signup/checkbox";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { InputField } from "@/components/signup/input-field";
import { PrimaryButton } from "@/components/signup/primary-button";
import { TitleSection } from "@/components/signup/title-section";
import { api } from "@/lib/api";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// On web, password inputs must live inside a <form> to avoid browser warnings.
const FormWrapper =
  Platform.OS === "web"
    ? ({
        children,
        onSubmit,
      }: {
        children: React.ReactNode;
        onSubmit: () => void;
      }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          style={{ display: "contents" }}
        >
          {children}
        </form>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

const MAX_CONTENT_WIDTH = 480;

export default function SignupScreen() {
  const router = useRouter();
  const { flow } = useLocalSearchParams<{ flow?: string }>();
  const isPartnerFlow = flow === "partner";
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const isFormValid =
    name.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    password === confirmPassword &&
    agreeToTerms;

  const handleNext = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      const { response, data } = await api.post("/auth/register", {
        name,
        email,
        password,
        confirm_password: confirmPassword,
        acceptTerms: agreeToTerms,
      });
      if (response.ok) {
        setStatusMessage({
          text: "Account created successfully!",
          type: "success",
        });
        setTimeout(() => router.push("/(auth)/cycle-length"), 1200);
      } else if (response.status === 500) {
        setStatusMessage({
          text: "Account may have been created. Please try signing in, or use a different email.",
          type: "error",
        });
      } else {
        const message =
          data?.message || data?.error || "Failed to create account.";
        setStatusMessage({ text: message, type: "error" });
      }
    } catch {
      setStatusMessage({
        text: "Error creating an account. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push(
      isPartnerFlow ? ("/(auth)/login?flow=partner" as any) : "/(auth)/login"
    );
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: isDesktop ? "#f5f5f5" : "#FF4081",
        paddingTop: isDesktop ? 20 : insets.top,
        paddingBottom: isDesktop ? 20 : 0,
      }}
    >
      <View
        className="flex-1"
        style={
          isDesktop
            ? {
                maxWidth: MAX_CONTENT_WIDTH,
                maxHeight: 844,
                width: "100%",
                alignSelf: "center",
                backgroundColor: "#FF4081",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
                elevation: 8,
                borderRadius: 24,
                overflow: "hidden",
              }
            : undefined
        }
      >
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
            {/* Content */}
            <View className="w-full pt-12 pb-8">
              {/* Back Arrow */}
              <BackButton />

              {/* Title Section */}
              <TitleSection
                title="Create Account"
                subtitle={
                  isPartnerFlow
                    ? "Sign up to support someone you care about with shared cycle insights."
                    : "Sign up with Satsflo to start tracking your cycle today."
                }
                className="mb-10 mt-4"
              />

              {/* Form Section */}
              <FormWrapper onSubmit={handleNext}>
                <View className="gap-5">
                  {/* Input Fields Container */}
                  <View className="gap-4">
                    <InputField
                      placeholder="Name"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      autoComplete="name"
                    />
              <FormWrapper onSubmit={handleNext}>
                <View className="gap-5">
                  {/* Input Fields Container */}
                  <View className="gap-4">
                    <InputField
                      placeholder="Name"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      autoComplete="name"
                    />

                    <InputField
                      placeholder="Email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                    <InputField
                      placeholder="Email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />

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
                    <InputField
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      showPasswordToggle
                      autoCapitalize="none"
                      autoComplete="new-password"
                    />
                  </View>

                  {/* Checkbox */}
                  <Checkbox
                    checked={agreeToTerms}
                    onToggle={() => setAgreeToTerms(!agreeToTerms)}
                    label="I agree to terms and conditions"
                  />
                </View>
              </FormWrapper>
            </View>
          </ScrollView>

          {/* Bottom Section - Fixed at bottom */}
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
                title={loading ? "Signing up..." : "Sign up"}
                onPress={handleNext}
                disabled={loading || !isFormValid}
              />
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
                title={loading ? "Signing up..." : "Sign up"}
                onPress={handleNext}
                disabled={loading || !isFormValid}
              />
              <TouchableOpacity
                onPress={handleSignIn}
                activeOpacity={0.7}
                className="py-3"
              >
                <Text className="text-sm font-normal leading-[17px] text-center text-signup-link">
                  Already have an account?{" "}
                  <Text className="font-semibold text-signup-title">
                    Sign In
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <HomeIndicatorArea />
        </KeyboardAvoidingView>
      </View>

      {/* Terms & Conditions / Privacy Policy modal */}
      <TermsModal
        visible={termsModalVisible}
        initialTab={termsInitialTab}
        onAgree={() => {
          setAgreeToTerms(true);
          setTermsModalVisible(false);
        }}
        onDismiss={() => setTermsModalVisible(false)}
      />
    </View>
  );
}
