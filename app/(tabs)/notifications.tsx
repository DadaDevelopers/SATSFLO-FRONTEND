import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Notification {
  id: string;
  avatar: any;
  message: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    avatar: require("@/assets/images/joy.png"),
    message: "Joy liked your post",
  },
  {
    id: "2",
    avatar: require("@/assets/images/hana.png"),
    message: "Hannah liked your post",
  },
  {
    id: "3",
    avatar: require("@/assets/images/joy.png"),
    message: "Joy commented your post",
  },
  {
    id: "4",
    avatar: require("@/assets/images/janedoe.png"),
    message: "You have received 0.0000211BTC (KES 250)",
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-[#FF4081]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row justify-between px-5 py-6 gap-[40px]">
        {/* Back Button */}
        <Pressable onPress={handleBack} className="p-0">
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </Pressable>

        {/* Title */}
        <Text className="text-xl font-inter font-medium text-white text-center tracking-tight">
          Notifications
        </Text>

        {/* Spacer for alignment */}
        <View className="w-6" />
      </View>

      {/* Subtitle */}
      <View className="px-5 mt-2">
        <Text className="text-base font-inter font-medium text-[#FAFAFA]">
          You have 4 Notifications today.
        </Text>
      </View>

      {/* Notifications List */}
      <ScrollView className="flex-1 px-5 mt-5">
        <View className="flex flex-col gap-4 pb-8">
          {notifications.map((notification) => (
            <View
              key={notification.id}
              className="flex-row items-center p-2.5 gap-2.5 bg-[#FFE6EE] rounded-lg"
            >
              {/* Avatar */}
              <Image
                source={notification.avatar}
                className="w-[50px] h-[50px] rounded-full"
                resizeMode="cover"
              />

              {/* Message */}
              <Text className="flex-1 text-sm font-inter text-[#090909]">
                {notification.message}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Home Indicator */}
      <View
        className="w-full h-[34px] bg-[#FF3378] items-center justify-center"
        style={{ paddingBottom: insets.bottom }}
      >
        <View className="w-[134px] h-[5px] bg-[#FF99BC] rounded-full" />
      </View>
    </View>
  );
}
