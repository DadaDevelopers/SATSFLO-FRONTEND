import { BackButton } from "@/components/signup/back-button";
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

  const isFormValid =
    name.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    password === confirmPassword &&
    agreeToTerms;

  const handleNext = () => {
    if (isFormValid) {
      router.push("/(auth)/cycle-length");
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
            </View>
          </ScrollView>

          {/* Bottom Section - Fixed at bottom */}
          <View className="px-6 pb-4 pt-4">
            <View className="items-center gap-4">
              <PrimaryButton title="Sign up" onPress={handleNext} />
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
    </View>
  );
}
