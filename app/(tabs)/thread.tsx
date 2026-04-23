import { BottomNavigation } from "@/components/home/bottom-navigation";
import { router } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavTab = "home" | "calendar" | "add" | "chat" | "settings";

export default function ThreadScreen() {
  const insets = useSafeAreaInsets();

  const handleNavTabPress = (tab: NavTab) => {
    switch (tab) {
      case "home":
        router.push("/");
        break;
      case "calendar":
        router.push("/calendar");
        break;
      case "add":
        router.push("/add-log");
        break;
      case "chat":
        router.push("/(tabs)/chat");
        break;
      case "settings":
        router.push("/(tabs)/settings");
        break;
    }
  };

  const handleNotify = () => {
    Alert.alert("Got it!", "We'll notify you when this feature is ready.");
  };

  const handleNotify = () => {
    Alert.alert("Got it!", "We'll notify you when this feature is ready.");
  };

  return (
    <View className="flex-1 bg-[#FF4081]" style={{ paddingTop: insets.top }}>
      {/* Centered coming-soon content */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Dashed info box */}
        <View
          className="items-center justify-center px-6 py-7 rounded-3xl"
          style={{
            width: 300,
            backgroundColor: "#FFE5EE",
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: "#DC014C",
          }}
        >
          <Text
            className="text-center text-[#090909]"
            style={{
              fontFamily: "Inter",
              fontWeight: "500",
              fontSize: 14,
              lineHeight: 20,
              letterSpacing: -0.28,
            }}
          >
            {
              "🚧 This feature is coming soon. We're putting the finishing touches on it!"
            }
          </Text>
        </View>

        {/* Notify me button */}
        <TouchableOpacity
          onPress={handleNotify}
          activeOpacity={0.85}
          className="items-center justify-center mt-9"
          style={{
            width: 150,
            height: 50,
            backgroundColor: "#FF82AD",
            borderRadius: 1000,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter",
              fontWeight: "600",
              fontSize: 16,
              lineHeight: 19,
              color: "#FFFFFF",
            }}
          >
            Notify me
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="chat" onTabPress={handleNavTabPress} />
    </View>
  );
}
