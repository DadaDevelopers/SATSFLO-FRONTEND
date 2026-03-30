import { useRouter } from "expo-router";
import React from "react";
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const MAX_CONTENT_WIDTH = 480;

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export default function GiftTokenScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;

  const handleProceed = () => {
    router.push("/gift-token/send-category");
  };

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
        {/* Header */}
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <BackIcon />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white text-xl font-semibold mr-8">
            Gift token
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-4">
          <Text className="text-white text-base mb-6">
            Send a gift token to someone special.
          </Text>

          {/* Send Gift Token Option */}
          <TouchableOpacity
            onPress={handleProceed}
            className="rounded-xl mb-4 px-4 py-5 flex-row items-center justify-between"
            style={{ backgroundColor: "#FF6B9D" }}
          >
            <Text className="text-white text-base font-medium">
              Send Gift Token
            </Text>
          </TouchableOpacity>
        </View>

        {/* Proceed Button */}
        <View
          className="px-4"
          style={{ paddingBottom: insets.bottom + 32 }}
        >
          <TouchableOpacity
            onPress={handleProceed}
            className="py-4 rounded-full items-center"
            style={{ backgroundColor: "#FFB6C1" }}
          >
            <Text className="text-white text-base font-semibold">Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
