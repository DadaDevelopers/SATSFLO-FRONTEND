import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GiftTokenWalletScreen() {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  const handleProceed = () => {
    router.push("/(tabs)/send-gift-amount");
  };

  return (
    <View className="flex-1 bg-[#FF4081]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-6">
        {/* Back Button */}
        <Pressable onPress={handleBack} className="p-1">
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </Pressable>

        {/* Title — centered between back button and spacer */}
        <Text className="flex-1 text-center text-xl font-inter font-medium text-white tracking-tight">
          Gift token
        </Text>

        {/* Invisible spacer to balance the back button */}
        <View className="w-8 h-6" />
      </View>

      {/* Instruction Text */}
      <View className="px-5 mt-6">
        <Text className="text-sm font-inter text-[#FAFAFA] tracking-tight">
          Send a gift token to someone special.
        </Text>
      </View>

      {/* Action Options */}
      <View className="px-5 mt-4 gap-4">
        {/* Send Gift Token */}
        <Pressable
          onPress={handleProceed}
          className="flex-row justify-between items-center px-4 py-5 border rounded-lg active:opacity-80"
          style={{ borderColor: "#FF99BC", borderWidth: 1 }}
        >
          <Text
            className="text-base font-inter text-[#FAFAFA]"
            style={{ fontWeight: "500" }}
          >
            Send Gift Token
          </Text>
        </Pressable>
      </View>

      {/* Bottom Section */}
      <View className="flex-1" />
      <View
        className="items-center pb-0"
        style={{ paddingBottom: insets.bottom }}
      >
        {/* Proceed Button */}
        <Pressable
          onPress={handleProceed}
          className="w-[250px] py-4 bg-[#FF82AD] rounded-full items-center justify-center active:opacity-80 border-[0.5px] border-[#FF669A] mb-5"
        >
          <Text className="text-white font-inter font-medium text-[15px]">
            Proceed
          </Text>
        </Pressable>

        {/* Home Indicator Area */}
        <View className="w-full h-[34px] bg-[#FF3378] items-center justify-center">
          <View className="w-[134px] h-[5px] bg-[#FF99BC] rounded-full" />
        </View>
      </View>
    </View>
  );
}
