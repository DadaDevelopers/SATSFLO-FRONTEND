import { BottomNavigation } from "@/components/home/bottom-navigation";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

const PlusCircleIcon = () => (
  <Svg width={15} height={15} viewBox="0 0 15 15" fill="none">
    <G clipPath="url(#clip0_2546_13052)">
      <Path
        d="M7.5 13.75C10.9518 13.75 13.75 10.9518 13.75 7.5C13.75 4.04822 10.9518 1.25 7.5 1.25C4.04822 1.25 1.25 4.04822 1.25 7.5C1.25 10.9518 4.04822 13.75 7.5 13.75Z"
        stroke="white"
        strokeWidth={1.831}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.5 5V10"
        stroke="white"
        strokeWidth={1.831}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 7.5H10"
        stroke="white"
        strokeWidth={1.831}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_2546_13052">
        <Rect width={15} height={15} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

type TabType = "threads" | "chats" | "groups";

interface Post {
  id: string;
  avatar: any;
  name: string;
  handle: string;
  status: string;
  content: string;
  image?: any;
  comments: string;
  likes: string;
}

const posts: Post[] = [
  {
    id: "1",
    avatar: require("@/assets/images/zuri.png"),
    name: "Zuri Hassan",
    handle: "@hassan",
    status: "Active 5m ago",
    content:
      "Feeling Anxious\nMy period's a little late, and I'm starting to feel anxious about it. Anyone else get that nervous feeling when your cycle is off? \u{1F61F}",
    comments: "500",
    likes: "10",
  },
  {
    id: "2",
    avatar: require("@/assets/images/zuri.png"),
    name: "Janet",
    handle: "@jelly",
    status: "Online",
    content: "Crazy cravings with heavy crumps!!",
    image: require("@/assets/images/cravings.png"),
    comments: "500",
    likes: "10",
  },
];

type NavTab = "home" | "calendar" | "add" | "chat" | "settings";

export default function ThreadScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>("threads");

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
        break;
      case "settings":
        break;
    }
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Tab Bar - full width rectangle starting from top of screen */}
      <View
        className="w-full bg-[#FFCCDD] rounded-3xl flex-row justify-between items-end px-8 pb-5"
        style={{ height: 110 + insets.top, paddingTop: insets.top }}
      >
        <Pressable onPress={() => setActiveTab("threads")}>
          <Text
            className="text-sm font-inter font-semibold"
            style={{
              color: activeTab === "threads" ? "#FF4081" : "#FFFFFF",
            }}
          >
            Threads
          </Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab("chats")}>
          <Text
            className="text-sm font-inter font-semibold"
            style={{
              color: activeTab === "chats" ? "#FF4081" : "#FFFFFF",
            }}
          >
            Chats
          </Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab("groups")}>
          <Text
            className="text-sm font-inter font-semibold"
            style={{
              color: activeTab === "groups" ? "#FF4081" : "#FFFFFF",
            }}
          >
            Groups
          </Text>
        </Pressable>
      </View>

      {/* Search Bar + New Post Button */}
      <View className="px-5">
        <View className="flex-row items-center gap-1.5 mt-4">
          {/* Search Input */}
          <View className="flex-1 flex-row items-center bg-[#FFE6EE] rounded-2xl px-3.5 py-1.5 gap-2.5">
            <Feather name="search" size={20} color="rgba(30,30,30,0.46)" />
            <TextInput
              className="flex-1 text-sm font-inter text-[#1E1E1E]"
              placeholder="Search post"
              placeholderTextColor="rgba(30,30,30,0.46)"
            />
          </View>
          {/* New Post Button */}
          <Pressable
            onPress={() => router.push("/(tabs)/add-thread")}
            className="w-[30px] h-[30px] rounded-full bg-[#FF669A] items-center justify-center"
          >
            <PlusCircleIcon />
          </Pressable>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1 px-5 mt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* What's on your mind */}
        <View
          className="flex-row items-center px-6 py-3 rounded-2xl mb-4"
          style={{
            borderWidth: 1,
            borderColor: "#FFB3CD",
          }}
        >
          <Image
            source={require("@/assets/images/zuri.png")}
            className="w-10 h-10 rounded-full"
            resizeMode="cover"
          />
          <Text className="ml-6 text-[13px] font-inter text-[#FAFAFA] opacity-65">
            whats on your mind today?
          </Text>
        </View>

        {/* Posts */}
        {posts.map((post) => (
          <View
            key={post.id}
            className="bg-[#FFE6EE] rounded-2xl mb-6 overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 4,
            }}
          >
            {/* Post Header */}
            <View className="flex-row items-center px-5 pt-5">
              {/* Avatar with plus icon */}
              <View className="relative">
                <Image
                  source={post.avatar}
                  className="w-[56px] h-[56px] rounded-full"
                  style={{ borderWidth: 4, borderColor: "#FFE6EE" }}
                  resizeMode="cover"
                />
                <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#FD71A1] items-center justify-center">
                  <Feather name="plus" size={10} color="#FFFFFF" />
                </View>
              </View>

              {/* Name, Handle, Status */}
              <View className="ml-3">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-[13px] font-inter font-semibold text-[#1E1E1E]">
                    {post.name}
                  </Text>
                  <Text className="text-[11px] font-inter text-black/50">
                    {post.handle}
                  </Text>
                </View>
                <Text className="text-[11px] font-inter text-black/50 mt-1">
                  {post.status}
                </Text>
              </View>
            </View>

            {/* Post Content */}
            <View className="px-8 py-4">
              <Text className="text-sm font-inter text-[#1E1E1E] leading-5">
                {post.content}
              </Text>
            </View>

            {/* Post Image (if any) */}
            {post.image && (
              <View className="px-6 pb-4">
                <Image
                  source={post.image}
                  className="w-full h-[160px] rounded-[10px]"
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Action Bar */}
            <View className="flex-row items-center justify-between px-6 pb-5">
              <View className="flex-row items-center gap-5">
                {/* Comments */}
                <Pressable
                  onPress={() => router.push("/(tabs)/view-comments")}
                  className="flex-row items-center gap-1.5"
                >
                  <Feather name="message-circle" size={20} color="#FD71A1" />
                  <Text className="text-[10px] font-inter font-light text-[#FD71A1]">
                    {post.comments}
                  </Text>
                </Pressable>

                {/* Likes */}
                <View className="flex-row items-center gap-1.5">
                  <Feather name="heart" size={20} color="#FD71A1" />
                  <Text className="text-[10px] font-inter font-light text-[#FD71A1]">
                    {post.likes}
                  </Text>
                </View>

                {/* Share */}
                <Feather name="send" size={18} color="#FD71A1" />
              </View>

              {/* BTC Icon */}
              <Pressable onPress={() => router.push("/(tabs)/select-wallet")}>
                <Image
                  source={require("@/assets/images/btc.png")}
                  className="w-[22px] h-[22px]"
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </View>
        ))}

        {/* Bottom spacing */}
        <View className="h-4" />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="chat" onTabPress={handleNavTabPress} />
    </View>
  );
}
