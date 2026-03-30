import { api } from "@/lib/api";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { default as React, default as React, useCallback, useEffect, useState } from "react";
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

  const handleBack = () => {
    router.back();
  };

  const formatTime = (dateStr?: string): string => {
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
  };

  return (
    <View className="flex-1 bg-[#FF4081]" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

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
      <View className="px-5 mt-2">
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
            {notifications.length === 0
              ? "You have no notifications."
              : `You have ${notifications.length} notification${notifications.length === 1 ? "" : "s"}.`}
          </Text>
        )}
      </View>

      {/* Loading spinner */}
      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center pb-20">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : error && !refreshing ? (
        /* Error / Retry state */
        <View className="flex-1 items-center justify-center pb-20 px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#FFFFFF" />
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
        /* Empty state */
        <View className="flex-1 items-center justify-center pb-20">
          <Ionicons
            name="notifications-off-outline"
            size={64}
            color="#FFFFFF"
          />
          <Text className="text-white text-base font-medium mt-4">
            No notifications yet
          </Text>
          <Text className="text-[#FFB4CD] text-sm mt-1 text-center px-10">
            When you get notifications, they'll show up here.
          </Text>
        </View>
      ) : (
        /* Notifications List */
        <ScrollView
          className="flex-1 px-5 mt-5"
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
          <View className="flex flex-col gap-4 pb-8">
            {notifications.map((notification) => (
              <View
                key={notification.id}
                className="flex-row items-center p-2.5 gap-2.5 rounded-lg"
                style={{
                  backgroundColor: notification.is_read ? "#FFE6EE" : "#FFD0E4",
                }}
              >
                {/* Avatar */}
                {notification.avatar_url ? (
                  <Image
                    source={{ uri: notification.avatar_url }}
                    className="w-[50px] h-[50px] rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    className="w-[50px] h-[50px] rounded-full items-center justify-center"
                    style={{ backgroundColor: "#FF4081" }}
                  >
                    <Feather name="bell" size={22} color="#FFFFFF" />
                  </View>
                )}

                {/* Message + time */}
                <View className="flex-1">
                  <Text className="text-sm font-inter text-[#090909]">
                    {notification.message}
                  </Text>
                  {notification.created_at ? (
                    <Text className="text-xs text-[#888] mt-0.5">
                      {formatTime(notification.created_at)}
                    </Text>
                  ) : null}
                </View>

                {/* Unread dot */}
                {!notification.is_read && (
                  <View
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#FF4081" }}
                  />
                )}
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
