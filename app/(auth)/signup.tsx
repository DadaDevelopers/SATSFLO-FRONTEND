import { BackButton } from "@/components/signup/back-button";
import { Checkbox } from "@/components/signup/checkbox";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { InputField } from "@/components/signup/input-field";
import { PrimaryButton } from "@/components/signup/primary-button";
import { TitleSection } from "@/components/signup/title-section";
import { TermsModal } from "@/app/(auth)/terms-and-conditions";
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
import Svg, { Path } from "react-native-svg";

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
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [termsInitialTab, setTermsInitialTab] = useState<"terms" | "privacy">("terms");
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
    router.push("/(auth)/login");
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
                subtitle="Sign up with Satsflo to start tracking your cycle today."
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

                    {/* Password Requirements */}
                    {password.length > 0 && (
                      <View className="flex-col gap-[6px]">
                        <Text className="text-xs font-normal leading-[18px] text-white">
                          Password should contain at least:
                        </Text>
                        <View className="flex-col gap-[2px]">
                          {[
                            { label: "8 Characters", met: password.length >= 8 },
                            { label: "1 Uppercase Letter", met: /[A-Z]/.test(password) },
                            { label: "1 Lowercase Letter", met: /[a-z]/.test(password) },
                            { label: "1 Special Character", met: /[^A-Za-z0-9]/.test(password) },
                          ].map(({ label, met }) => (
                            <View key={label} className="flex-row items-center gap-[4px]">
                              <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" style={{ opacity: met ? 1 : 0.4 }}>
                                <Path
                                  d="M11.375 1.75H2.625C2.39294 1.75 2.17038 1.84219 2.00628 2.00628C1.84219 2.17038 1.75 2.39294 1.75 2.625V11.375C1.75 11.6071 1.84219 11.8296 2.00628 11.9937C2.17038 12.1578 2.39294 12.25 2.625 12.25H11.375C11.6071 12.25 11.8296 12.1578 11.9937 11.9937C12.1578 11.8296 12.25 11.6071 12.25 11.375V2.625C12.25 2.39294 12.1578 2.17038 11.9937 2.00628C11.8296 1.84219 11.6071 1.75 11.375 1.75ZM9.49703 5.99703L6.43453 9.05953C6.3939 9.10021 6.34565 9.13248 6.29254 9.1545C6.23942 9.17651 6.18249 9.18784 6.125 9.18784C6.06751 9.18784 6.01058 9.17651 5.95746 9.1545C5.90435 9.13248 5.8561 9.10021 5.81547 9.05953L4.50297 7.74703C4.42088 7.66494 4.37476 7.5536 4.37476 7.4375C4.37476 7.3214 4.42088 7.21006 4.50297 7.12797C4.58506 7.04588 4.6964 6.99976 4.8125 6.99976C4.9286 6.99976 5.03994 7.04588 5.12203 7.12797L6.125 8.13148L8.87797 5.37797C8.91862 5.33732 8.96687 5.30508 9.01998 5.28308C9.07309 5.26108 9.13001 5.24976 9.1875 5.24976C9.24499 5.24976 9.30191 5.26108 9.35502 5.28308C9.40813 5.30508 9.45638 5.33732 9.49703 5.37797C9.53768 5.41862 9.56992 5.46687 9.59192 5.51998C9.61392 5.57309 9.62524 5.63001 9.62524 5.6875C9.62524 5.74499 9.61392 5.80191 9.59192 5.85502C9.56992 5.90813 9.53768 5.95638 9.49703 5.99703Z"
                                  fill="white"
                                />
                              </Svg>
                              <Text
                                className="text-xs font-normal leading-[18px]"
                                style={{ color: met ? "#FFFFFF" : "rgba(255,255,255,0.6)" }}
                              >
                                {label}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

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
                    onTermsPress={() => {
                      setTermsInitialTab("terms");
                      setTermsModalVisible(true);
                    }}
                    onPrivacyPress={() => {
                      setTermsInitialTab("privacy");
                      setTermsModalVisible(true);
                    }}
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
