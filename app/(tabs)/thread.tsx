import { BottomNavigation } from "@/components/home/bottom-navigation";
import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

const getHeaderPath = (tab: TabType): string => {
  switch (tab) {
    case "threads":
      return "M-22 24C-22 10.7452 -11.2548 0 2 0H398C411.255 0 422 10.7452 422 24V51.8621C422 65.1169 411.255 75.8621 398 75.8621H145.424C135.281 75.8621 126.537 82.9951 124.5 92.931C122.463 102.867 113.719 110 103.576 110H2C-11.2548 110 -22 99.2548 -22 86V24Z";
    case "chats":
      return "M-22 24C-22 10.7452 -11.2548 0 2 0H398C411.255 0 422 10.7452 422 24V51.8621C422 65.1169 411.255 75.8621 398 75.8621H276.424C266.281 75.8621 257.537 82.9951 255.5 92.931C253.463 102.867 244.719 110 234.576 110H157.424C147.281 110 138.537 102.867 136.5 92.931C134.463 82.9951 125.719 75.8621 115.576 75.8621H2C-11.2548 75.8621 -22 65.1169 -22 51.8621V24Z";
    case "groups":
      return "M-22 24C-22 10.7452 -11.2548 0 2 0H398C411.255 0 422 10.7452 422 24V86C422 99.2548 411.255 110 398 110H289.424C279.281 110 270.537 102.867 268.5 92.931C266.463 82.9951 257.719 75.8621 247.576 75.8621H2C-11.2548 75.8621 -22 65.1169 -22 51.8621V24Z";
  }
};

interface Thread {
  id: string;
  title?: string;
  content: string;
  category?: string;
  user?: { name?: string; username?: string };
  comments_count?: number;
  likes_count?: number;
  is_liked?: boolean;
  created_at?: string;
}

interface Group {
  id: string;
  name: string;
  description?: string;
  members_count?: number;
}

type NavTab = "home" | "calendar" | "add" | "chat" | "settings";

export default function ThreadScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>("threads");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadThreads = async () => {
      setLoading(true);
      try {
        const { response, data } = await api.get("/threads");
        if (response.ok) {
          const list = data?.data ?? data ?? [];
          setThreads(Array.isArray(list) ? list : []);
          const liked = new Set<string>(
            (Array.isArray(list) ? list : [])
              .filter((t: Thread) => t.is_liked)
              .map((t: Thread) => t.id)
          );
          setLikedIds(liked);
        }
      } catch {}
      setLoading(false);
    };
    loadThreads();
  }, []);

  useEffect(() => {
    if (activeTab !== "groups") return;
    const loadGroups = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) return;
        const { response, data } = await api.get("/groups", token);
        if (response.ok) {
          const list = data?.data ?? data ?? [];
          setGroups(Array.isArray(list) ? list : []);
        }
      } catch {}
    };
    loadGroups();
  }, [activeTab]);

  const handleLikeToggle = async (threadId: string) => {
    const isLiked = likedIds.has(threadId);
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (isLiked) { next.delete(threadId); } else { next.add(threadId); }
      return next;
    });
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, likes_count: (t.likes_count ?? 0) + (isLiked ? -1 : 1) }
          : t
      )
    );
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        if (isLiked) {
          await api.delete(`/threads/${threadId}/like`, undefined, token);
        } else {
          await api.post(`/threads/${threadId}/like`, {}, token);
        }
      }
    } catch {}
  };

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

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Tab Bar - full width rectangle starting from top of screen */}
      {/* Top Header */}
      <View style={{ paddingTop: insets.top }}>
        <View style={{ position: "relative", paddingBottom: 14 }}>
          {/* Background SVG */}
          <Svg
            width="100%"
            height={110}
            viewBox="0 0 393 110"
            preserveAspectRatio="none"
          >
            <Path d={getHeaderPath(activeTab)} fill="#FFCCDD" />
          </Svg>

          {/* Tabs */}
          <View
            style={{
              position: "absolute",
              bottom: 25,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Pressable onPress={() => setActiveTab("threads")}>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: activeTab === "threads" ? "#FF4081" : "#FFFFFF",
                }}
              >
                Threads
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push("/(tabs)/chat")}>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: activeTab === "chats" ? "#FF4081" : "#FFFFFF",
                }}
              >
                Chats
              </Text>
            </Pressable>

            <Pressable onPress={() => setActiveTab("groups")}>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: activeTab === "groups" ? "#FF4081" : "#FFFFFF",
                }}
              >
                Groups
              </Text>
            </Pressable>
          </View>
        </View>
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
        {activeTab === "groups" ? (
          /* Groups List */
          <>
            {groups.length === 0 ? (
              <Text className="text-center text-white/70 mt-10">No groups yet.</Text>
            ) : (
              groups.map((group) => (
                <View
                  key={group.id}
                  className="bg-[#FFE6EE] rounded-2xl mb-4 px-5 py-4"
                >
                  <Text className="text-[14px] font-inter font-semibold text-[#1E1E1E]">
                    {group.name}
                  </Text>
                  {group.description ? (
                    <Text className="text-[12px] font-inter text-black/60 mt-1">
                      {group.description}
                    </Text>
                  ) : null}
                  {group.members_count !== undefined ? (
                    <Text className="text-[11px] font-inter text-[#FD71A1] mt-1">
                      {group.members_count} members
                    </Text>
                  ) : null}
                </View>
              ))
            )}
          </>
        ) : (
          /* Threads List */
          <>
            {/* What's on your mind */}
            <View
              className="flex-row items-center px-6 py-3 rounded-2xl mb-4"
              style={{ borderWidth: 1, borderColor: "#FFB3CD" }}
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

            {loading && (
              <ActivityIndicator color="#FFFFFF" style={{ marginTop: 20 }} />
            )}

            {!loading && threads.length === 0 && (
              <Text className="text-center text-white/70 mt-10">No threads yet.</Text>
            )}

            {threads.map((thread) => (
              <View
                key={thread.id}
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
                  <View className="relative">
                    <Image
                      source={require("@/assets/images/zuri.png")}
                      className="w-[56px] h-[56px] rounded-full"
                      style={{ borderWidth: 4, borderColor: "#FFE6EE" }}
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#FD71A1] items-center justify-center">
                      <Feather name="plus" size={10} color="#FFFFFF" />
                    </View>
                  </View>
                  <View className="ml-3">
                    <View className="flex-row items-center gap-1.5">
                      <Text className="text-[13px] font-inter font-semibold text-[#1E1E1E]">
                        {thread.user?.name ?? "User"}
                      </Text>
                      {thread.user?.username ? (
                        <Text className="text-[11px] font-inter text-black/50">
                          @{thread.user.username}
                        </Text>
                      ) : null}
                    </View>
                    {thread.created_at ? (
                      <Text className="text-[11px] font-inter text-black/50 mt-1">
                        {new Date(thread.created_at).toLocaleDateString()}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* Post Content */}
                <View className="px-8 py-4">
                  {thread.title ? (
                    <Text className="text-sm font-inter font-semibold text-[#1E1E1E] mb-1">
                      {thread.title}
                    </Text>
                  ) : null}
                  <Text className="text-sm font-inter text-[#1E1E1E] leading-5">
                    {thread.content}
                  </Text>
                </View>

                {/* Action Bar */}
                <View className="flex-row items-center justify-between px-6 pb-5">
                  <View className="flex-row items-center gap-5">
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: "/(tabs)/view-comments" as any,
                          params: { threadId: thread.id },
                        })
                      }
                      className="flex-row items-center gap-1.5"
                    >
                      <Feather name="message-circle" size={20} color="#FD71A1" />
                      <Text className="text-[10px] font-inter font-light text-[#FD71A1]">
                        {thread.comments_count ?? 0}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleLikeToggle(thread.id)}
                      className="flex-row items-center gap-1.5"
                    >
                      <Feather
                        name="heart"
                        size={20}
                        color={likedIds.has(thread.id) ? "#FF4081" : "#FD71A1"}
                      />
                      <Text className="text-[10px] font-inter font-light text-[#FD71A1]">
                        {thread.likes_count ?? 0}
                      </Text>
                    </Pressable>

                    <Feather name="send" size={18} color="#FD71A1" />
                  </View>

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
          </>
        )}

        {/* Bottom spacing */}
        <View className="h-4" />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="chat" onTabPress={handleNavTabPress} />
    </View>
  );
}
