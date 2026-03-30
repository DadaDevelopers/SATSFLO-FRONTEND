import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

const MAX_CONTENT_WIDTH = 480;

// Large green checkmark icon
const SuccessCheckIcon = () => (
  <Svg width={150} height={150} viewBox="0 0 150 150" fill="none">
    <Path d="M75 14.0625C62.9477 14.0625 51.1661 17.6364 41.145 24.3323C31.1238 31.0282 23.3133 40.5454 18.7011 51.6802C14.0889 62.8151 12.8821 75.0676 15.2334 86.8883C17.5847 98.709 23.3884 109.567 31.9107 118.089C40.433 126.612 51.291 132.415 63.1117 134.767C74.9324 137.118 87.1849 135.911 98.3198 131.299C109.455 126.687 118.972 118.876 125.668 108.855C132.364 98.8339 135.938 87.0523 135.938 75C135.92 58.8436 129.495 43.3538 118.071 31.9295C106.646 20.5052 91.1564 14.0796 75 14.0625ZM101.754 64.2539L68.9414 97.0664C68.5061 97.5022 67.9891 97.848 67.4201 98.0839C66.851 98.3198 66.241 98.4412 65.625 98.4412C65.009 98.4412 64.399 98.3198 63.83 98.0839C63.2609 97.848 62.744 97.5022 62.3086 97.0664L48.2461 83.0039C47.3666 82.1243 46.8724 80.9314 46.8724 79.6875C46.8724 78.4436 47.3666 77.2507 48.2461 76.3711C49.1257 75.4915 50.3186 74.9974 51.5625 74.9974C52.8064 74.9974 53.9994 75.4915 54.8789 76.3711L65.625 87.123L95.1211 57.6211C95.5566 57.1856 96.0737 56.8401 96.6427 56.6044C97.2117 56.3687 97.8216 56.2474 98.4375 56.2474C99.0534 56.2474 99.6633 56.3687 100.232 56.6044C100.801 56.8401 101.318 57.1856 101.754 57.6211C102.189 58.0566 102.535 58.5736 102.771 59.1427C103.006 59.7117 103.128 60.3216 103.128 60.9375C103.128 61.5534 103.006 62.1633 102.771 62.7323C102.535 63.3014 102.189 63.8184 101.754 64.2539Z" fill="#4DC721" />
  </Svg>
);

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    action?: "send" | "receive";
    action?: "send" | "receive";
    wallet?: string;
    category?: string;
    satsEquivalent?: string;
  }>();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;

  // Determine action type (default to receive for backward compatibility)
  const action = params.action || "receive";
  const action = params.action || "receive";

  // Get wallet name for display
  const walletName = params.wallet === "blink" ? "Blink" : "Wallet of Satoshi";
  const walletName = params.wallet === "blink" ? "Blink" : "Wallet of Satoshi";

  // Use satsEquivalent from params or default for receive flow
  const satsAmount = params.satsEquivalent || "10,009";
  const satsAmount = params.satsEquivalent || "10,009";

  const handleGoHome = () => {
    // Navigate to home and reset the gift token stack
    router.replace("/(tabs)");
    router.replace("/(tabs)");
  };

  // Success message based on action
  const successMessage =
    action === "send"
      ? "Your SATS was sent successfully!!!"
      : `Your ${walletName} wallet was credited with ${satsAmount} SATS`;
  const successMessage =
    action === "send"
      ? "Your SATS was sent successfully!!!"
      : `Your ${walletName} wallet was credited with ${satsAmount} SATS`;

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: "#FF4081",
        backgroundColor: "#FF4081",
        paddingTop: insets.top,
      }}
    >
      {/* Desktop wrapper */}
      <View
        className="flex-1"
        style={
          isDesktop
            ? {
                maxWidth: MAX_CONTENT_WIDTH,
                width: "100%",
                alignSelf: "center",
              }
            : undefined
        }
        style={
          isDesktop
            ? {
                maxWidth: MAX_CONTENT_WIDTH,
                width: "100%",
                alignSelf: "center",
              }
            : undefined
        }
      >
        {/* Content - Centered */}
        <View className="flex-1 items-center justify-center px-4">
          {/* Success Icon */}
          <View className="mb-8">
            <SuccessCheckIcon />
          </View>

          {/* Success Message */}
          <Text
            className="text-white font-inter font-medium text-2xl text-center leading-[29px] w-[248px]"
            style={{ letterSpacing: -0.3 }}
          >
            {successMessage}
          </Text>
        </View>

        {/* Go to Homepage Button */}
        <View
          className="items-center"
          style={{ paddingBottom: insets.bottom + 32 }}
        >
        <View
          className="items-center"
          style={{ paddingBottom: insets.bottom + 32 }}
        >
          <TouchableOpacity
            onPress={handleGoHome}
            style={{
              width: 250,
              height: 50,
              backgroundColor: "#FF82AD",
              borderWidth: 0.5,
              borderColor: "#FF669A",
              borderRadius: 1000,
              alignItems: "center",
              justifyContent: "center",
            }}
            style={{
              width: 250,
              height: 50,
              backgroundColor: "#FF82AD",
              borderWidth: 0.5,
              borderColor: "#FF669A",
              borderRadius: 1000,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: "500",
                lineHeight: 18,
                textAlign: "center",
              }}
            >
              Go to Homepage
            </Text>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: "500",
                lineHeight: 18,
                textAlign: "center",
              }}
            >
              Go to Homepage
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
