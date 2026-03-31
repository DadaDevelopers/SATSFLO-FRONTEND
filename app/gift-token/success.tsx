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
  <Svg width={100} height={100} viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="48" fill="#4ADE80" />
    <Path
      d="M30 50l15 15 25-30"
      stroke="#FF4081"
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
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

  // Get wallet name for display
  const walletName = params.wallet === "blink" ? "Blink" : "Wallet of Satoshi";

  // Use satsEquivalent from params or default for receive flow
  const satsAmount = params.satsEquivalent || "10,009";

  const handleGoHome = () => {
    // Navigate to home and reset the gift token stack
    router.replace("/(tabs)");
  };

  // Success message based on action
  const successMessage =
    action === "send"
      ? "Your SATS was sent successfully!!!"
      : `Your ${walletName} wallet was credited with ${satsAmount} SATS`;

  return (
    <View
      className="flex-1"
      style={{
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
      >
        {/* Content - Centered */}
        <View className="flex-1 items-center justify-center px-4">
          {/* Success Icon */}
          <View className="mb-8">
            <SuccessCheckIcon />
          </View>

          {/* Success Message */}
          <Text className="text-white text-xl font-semibold text-center px-8">
            {successMessage}
          </Text>
        </View>

        {/* Go to Homepage Button */}
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
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
