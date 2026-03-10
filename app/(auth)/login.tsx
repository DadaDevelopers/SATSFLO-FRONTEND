import { Checkbox } from "@/components/signup/checkbox";
import { HomeIndicatorArea } from "@/components/signup/home-indicator-area";
import { InputField } from "@/components/signup/input-field";
import { PrimaryButton } from "@/components/signup/primary-button";
import { TitleSection } from "@/components/signup/title-section";
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

const MAX_CONTENT_WIDTH = 480;

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSignIn = () => {
    if (isFormValid) {
      router.replace("/(tabs)");
    }
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  const handleCreateAccount = () => {
    router.push("/(auth)/signup");
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
                onPress={() => router.back()}
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

                {/* Remember me & Forgot Password Row */}
                <View className="flex-row justify-between items-center ">
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
            </View>
          </ScrollView>

          {/* Bottom Section - Fixed at bottom */}
          <View className="px-6 pb-4 pt-4">
            <View className="items-center gap-4">
              <PrimaryButton title="Sign In" onPress={handleSignIn} />
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
