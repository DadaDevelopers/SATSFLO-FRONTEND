import { Checkbox } from "@/components/signup/checkbox";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { InputField } from "@/components/signup/input-field";
import { PrimaryButton } from "@/components/signup/primary-button";
import { TitleSection } from "@/components/signup/title-section";
import { api } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function LoginScreen() {
  const router = useRouter();
  const { flow } = useLocalSearchParams<{ flow?: string }>();
  const isPartnerFlow = flow === "partner";
  const { flow } = useLocalSearchParams<{ flow?: string }>();
  const isPartnerFlow = flow === "partner";
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

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

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSignIn = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      const { response, data } = await api.post("/auth/login", {
        email,
        password,
      });
      if (response.ok) {
        const accessToken = data.data.accessToken;
        await AsyncStorage.multiSet([
          ["accessToken", accessToken],
          ["refreshToken", data.data.refreshToken],
          ["user", JSON.stringify(data.data.user)],
        ]);
        setStatusMessage({ text: "Login successful!", type: "success" });

        // Check if user already has an active partner pairing
        let isPaired = false;
        try {
          const { response: partnerRes, data: partnerData } = await api.get(
            "/partner",
            accessToken,
          );
          isPaired = partnerRes.ok && !!partnerData?.data?.partner;
        } catch {}

        setTimeout(() => {
          if (isPaired) {
            router.replace("/partner" as any);
          } else if (isPartnerFlow) {
            router.replace("/partner-welcome" as any);
          } else {
            router.replace("/(tabs)");
          }
        }, 800);
      } else {
        const message = data?.message || data?.error || "Failed to sign in.";
        setStatusMessage({ text: message, type: "error" });
      }
    } catch {
      setStatusMessage({
        text: "Error signing in. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  const handleCreateAccount = () => {
    router.push(
      isPartnerFlow ? ("/(auth)/signup?flow=partner" as any) : "/(auth)/signup",
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
            <View className="w-full pt-4 pb-8">
              {/* Back Button */}
              <TouchableOpacity
                onPress={() =>
                  router.canGoBack()
                    ? router.back()
                    : router.replace("/how-to-use" as any)
                }
                className="w-10 h-10 justify-center items-center -ml-2 mb-4"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M3.21938 11.4694L9.96937 4.71945C10.1101 4.57871 10.301 4.49965 10.5 4.49965C10.699 4.49965 10.8899 4.57871 11.0306 4.71945C11.1714 4.86018 11.2504 5.05105 11.2504 5.25007C11.2504 5.44909 11.1714 5.63997 11.0306 5.7807L5.56031 11.2501L20.25 11.2501C20.4489 11.2501 20.6397 11.3291 20.7803 11.4697C20.921 11.6104 21 11.8012 21 12.0001C21 12.199 20.921 12.3897 20.7803 12.5304C20.6397 12.6711 20.4489 12.7501 20.25 12.7501L5.56031 12.7501L11.0306 18.2194C11.1714 18.3602 11.2504 18.551 11.2504 18.7501C11.2504 18.9491 11.1714 19.14 11.0306 19.2807C10.8899 19.4214 10.699 19.5005 10.5 19.5005C10.301 19.5005 10.1101 19.4214 9.96937 19.2807L3.21938 12.5307C3.14964 12.461 3.09432 12.3783 3.05658 12.2873C3.01884 12.1962 2.99941 12.0986 2.99941 12.0001C2.99941 11.9015 3.01884 11.8039 3.05658 11.7129C3.09432 11.6218 3.14964 11.5391 3.21938 11.4694Z"
                    fill="white"
                  />
                </Svg>
              </TouchableOpacity>

              {/* Title Section */}
              <TitleSection
                title="Welcome Back!"
                subtitle="Access your account and stay connected to your wellness journey anytime, anywhere."
                className="mb-4"
              />

              {/* Form Section */}
              <FormWrapper onSubmit={handleSignIn}>
                <View className="gap-5">
                  <InputField
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                  <FormWrapper onSubmit={handleSignIn}>
                    <View className="gap-5">
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
                        autoComplete="password"
                      />
                      <InputField
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        showPasswordToggle
                        autoCapitalize="none"
                        autoComplete="password"
                      />

                      {/* Remember me & Forgot Password Row */}
                      <View className="flex-row justify-between items-center">
                        <Checkbox
                          checked={rememberMe}
                          onToggle={() => setRememberMe(!rememberMe)}
                          label="Remember me"
                        />
                        <TouchableOpacity
                          onPress={handleForgotPassword}
                          activeOpacity={0.7}
                        >
                          <Text className="text-md font-medium text-signup-title">
                            Forgot Password?
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </FormWrapper>
                  {/* Remember me & Forgot Password Row */}
                  <View className="flex-row justify-between items-center">
                    <Checkbox
                      checked={rememberMe}
                      onToggle={() => setRememberMe(!rememberMe)}
                      label="Remember me"
                    />
                    <TouchableOpacity
                      onPress={handleForgotPassword}
                      activeOpacity={0.7}
                    >
                      <Text className="text-md font-medium text-signup-title">
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>
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
                title={loading ? "Signing in..." : "Sign In"}
                onPress={handleSignIn}
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
                title={loading ? "Signing in..." : "Sign In"}
                onPress={handleSignIn}
                disabled={loading || !isFormValid}
              />
              <TouchableOpacity
                onPress={handleCreateAccount}
                activeOpacity={0.7}
                className="py-3"
              >
                <Text className="text-sm font-normal leading-[17px] text-center text-signup-link">
                  Don&apos;t have an account?{" "}
                  <Text className="font-semibold text-signup-title">
                    Create account
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <HomeIndicatorArea />
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
