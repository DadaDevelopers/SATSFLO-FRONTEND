import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Notification {
  id: string;
  message: string;
  type?: string;
  avatar_url?: string | null;
  is_read?: boolean;
  created_at?: string;
}

function isToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

function formatTime(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return "";
  }
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }
    try {
      const { response, data } = await api.get("/notifications", token);
      if (response.ok) {
        const list = data?.data ?? data ?? [];
        setNotifications(Array.isArray(list) ? list : []);
        setError(null);
        // Mark all as read
        api.post("/notifications/read-all", {}, token).catch(() => {});
      } else {
        setError(data?.message ?? "Failed to load notifications.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const todayCount = notifications.filter((n) => isToday(n.created_at)).length;

  return (
    <View className="flex-1 bg-[#FF4081]" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      {/* Header */}
      <View className="flex-row justify-between px-5 py-6 gap-[40px]">
        <Pressable onPress={() => router.back()} className="p-0">
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </Pressable>
        <Text className="text-xl font-inter font-medium text-white text-center tracking-tight">
          Notifications
        </Text>
        <View className="w-6" />
      </View>

      {/* Subtitle */}
      <View className="px-5 mb-4">
        {loading ? (
          <Text className="text-base font-inter font-medium text-[#FAFAFA]">
            Loading notifications…
          </Text>
        ) : error ? (
          <Text className="text-base font-inter font-medium text-[#FAFAFA]">
            {error}
          </Text>
        ) : (
          <Text className="text-base font-inter font-medium text-[#FAFAFA]">
            {todayCount > 0
              ? `You have ${todayCount} Notification${todayCount === 1 ? "" : "s"} today.`
              : notifications.length === 0
              ? "You have no notifications."
              : "No new notifications today."}
          </Text>
        )}
      </View>

      {/* Content */}
      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center pb-20">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : error && !refreshing ? (
        <View className="flex-1 items-center justify-center pb-20 px-6">
          <Feather name="alert-circle" size={64} color="#FFFFFF" />
          <Text className="text-white text-base font-medium mt-4 text-center">
            {error}
          </Text>
          <Pressable
            onPress={fetchNotifications}
            className="mt-6 px-6 py-3 rounded-full border border-white"
          >
            <Text className="text-white text-sm font-medium">Retry</Text>
          </Pressable>
        </View>
      ) : notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center pb-20">
          <Feather name="bell-off" size={64} color="#FFFFFF" />
          <Text className="text-white text-base font-medium mt-4">
            No notifications yet
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#FFFFFF"
              colors={["#FFFFFF"]}
            />
          }
        >
          <View className="flex flex-col gap-3 pb-8">
            {notifications.map((notification) => (
              <View
                key={notification.id}
                className="flex-row items-center rounded-2xl bg-white px-4 py-4 gap-3"
              >
                {/* Avatar */}
                {notification.avatar_url ? (
                  <Image
                    source={{ uri: notification.avatar_url }}
                    style={{ width: 52, height: 52, borderRadius: 26 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      backgroundColor: "#FF4081",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Feather name="bell" size={22} color="#FFFFFF" />
                  </View>
                )}

                {/* Message */}
                <View className="flex-1">
                  <Text
                    className="text-sm font-inter text-[#090909]"
                    numberOfLines={2}
                  >
                    {notification.message}
                  </Text>
                  {notification.created_at ? (
                    <Text className="text-xs text-[#888] mt-0.5">
                      {formatTime(notification.created_at)}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

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
