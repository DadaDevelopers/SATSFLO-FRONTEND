import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const BackArrowIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke="#FAFAFA"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function AddThreadScreen() {
  const insets = useSafeAreaInsets();
  const [threadText, setThreadText] = useState("");

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: "#FF4081" }}
    >
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        {/* Header */}
        <View className="flex-row items-center px-5 py-4">
          <TouchableOpacity onPress={() => router.replace("/(tabs)/thread")}>
            <BackArrowIcon />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white text-xl font-inter font-medium mr-6"
            style={{ letterSpacing: -0.3 }}
          >
            Add a thread
          </Text>
        </View>

        {/* Thread composer */}
        <View className="px-5 mt-2">
          <View className="flex-row">
            {/* Left column: avatar + timeline */}
            <View className="items-center">
              {/* Avatar */}
              <Image
                source={require("@/assets/images/zuri.png")}
                className="w-10 h-10 rounded-full"
                resizeMode="cover"
              />
              {/* Top dot */}
              <View className="w-2.5 h-2.5 rounded-full bg-[#FD7BA7] mt-1" />
              {/* Vertical line */}
              <View
                className="w-[1px] h-12"
                style={{ backgroundColor: "rgba(250, 250, 250, 0.63)", opacity: 0.5 }}
              />
              {/* Bottom dot */}
              <View className="w-2.5 h-2.5 rounded-full bg-[#FD7BA7]" />
            </View>

            {/* Right column: name + input */}
            <View className="flex-1 ml-3">
              {/* Name */}
              <Text className="text-[13px] font-inter font-semibold text-white">
                Zuri Hassan
              </Text>

              {/* Text input */}
              <TextInput
                className="text-[13px] font-inter mt-1 min-h-[40px]"
                style={{ color: "rgba(250, 250, 250, 0.9)" }}
                placeholder="what's on your mind today?"
                placeholderTextColor="rgba(250, 250, 250, 0.9)"
                multiline
                autoFocus
                value={threadText}
                onChangeText={setThreadText}
              />

              {/* Action icons */}
              <View className="flex-row items-center gap-4 mt-3">
                <TouchableOpacity>
                  <Feather name="image" size={20} color="#FAFAFA" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Feather name="paperclip" size={20} color="#FAFAFA" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Feather name="camera" size={20} color="#FAFAFA" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Feather name="mic" size={20} color="#FAFAFA" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Spacer to push content up when keyboard shows */}
        <View className="flex-1" />

        {/* Home Indicator */}
        <View
          className="w-full h-[34px] bg-[#FBFBFB] items-center justify-center"
          style={{ paddingBottom: insets.bottom }}
        >
          <View className="w-[134px] h-[5px] bg-[#090909] rounded-full" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
