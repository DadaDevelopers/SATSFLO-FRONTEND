import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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

const SendIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
      stroke="#FFE6EE"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface Comment {
  id: string;
  content: string;
  user?: { name?: string };
  created_at?: string;
}

interface ThreadDetail {
  id: string;
  title?: string;
  content: string;
  user?: { name?: string };
  created_at?: string;
  comments_count?: number;
}

export default function ViewCommentsScreen() {
  const insets = useSafeAreaInsets();
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!threadId) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const [threadRes, commentsRes] = await Promise.all([
          api.get(`/threads/${threadId}`),
          api.get(`/threads/${threadId}/comments`),
        ]);
        if (threadRes.response.ok) {
          setThread(threadRes.data?.data ?? threadRes.data);
        }
        if (commentsRes.response.ok) {
          const list = commentsRes.data?.data ?? commentsRes.data ?? [];
          setComments(Array.isArray(list) ? list : []);
        }
      } catch {}
      setLoading(false);
    };
    loadData();
  }, [threadId]);

  const handleSendComment = async () => {
    if (!commentText.trim() || !threadId) return;
    setSending(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        const { response, data } = await api.post(
          `/threads/${threadId}/comments`,
          { content: commentText.trim() },
          token
        );
        if (response.ok) {
          const newComment = data?.data ?? data;
          setComments((prev) => [...prev, newComment]);
          setCommentText("");
        }
      }
    } catch {}
    setSending(false);
  };

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
          <Text
            className="flex-1 text-center text-white text-xl font-inter font-medium mr-6"
            style={{ letterSpacing: -0.3 }}
          >
            Threads
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {/* Original Post */}
          <View className="px-5">
            <View className="flex-row">
              <View className="relative">
                <View className="w-[46px] h-[46px] rounded-full bg-[#FFE6EE] items-center justify-center" style={{ borderWidth: 4, borderColor: "#FFFFFF" }}>
                  <Feather name="user" size={22} color="#FF82AD" />
                </View>
                <View className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-white items-center justify-center">
                  <Feather name="plus-circle" size={12} color="#FF4081" />
                </View>
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-xs font-inter font-semibold text-white">
                  {thread?.user?.name ?? "User"}
                </Text>
                <Text className="text-[10px] font-inter text-[#FAFAFA] mt-0.5">
                  {thread?.created_at
                    ? new Date(thread.created_at).toLocaleDateString()
                    : ""}
                </Text>
                {thread?.title ? (
                  <Text className="text-xs font-inter font-semibold text-white mt-2">
                    {thread.title}
                  </Text>
                ) : null}
                <Text
                  className="text-xs font-inter mt-2 leading-[15px]"
                  style={{ color: "rgba(250, 250, 250, 0.8)" }}
                >
                  {thread?.content ?? ""}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between mt-3">
              <View className="flex-row items-center gap-4">
                <Feather name="message-circle" size={15} color="#FAFAFA" />
                <Feather name="heart" size={12} color="#FAFAFA" />
                <Feather name="share" size={16} color="#FAFAFA" />
              </View>
              <Image
                source={require("@/assets/images/btc.png")}
                className="w-[19px] h-[19px]"
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Comments divider */}
          <View className="mt-5">
            <View className="h-[1px] bg-[#FF669A]" />
            <View className="flex-row justify-between items-center px-5 py-1.5">
              <Text className="text-[14px] font-inter font-semibold text-white">
                Comments
              </Text>
              <Text className="text-xs font-inter font-semibold text-[#FAFAFA]">
                {comments.length}
              </Text>
            </View>
            <View className="h-[1px] bg-[#FF669A]" />
          </View>

          {/* Loading indicator */}
          {loading && (
            <ActivityIndicator color="#FFFFFF" style={{ marginTop: 20 }} />
          )}

          {/* Comments list */}
          <View className="px-5 mt-5 gap-6">
            {comments.map((comment) => (
              <View key={comment.id} className="flex-row">
                <View className="relative">
                  <View className="w-10 h-10 rounded-full bg-[#FFE6EE] items-center justify-center">
                    <Feather name="user" size={20} color="#FF82AD" />
                  </View>
                  <View className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-white items-center justify-center">
                    <Feather name="plus-circle" size={12} color="#FF4081" />
                  </View>
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-[14px] font-inter font-semibold text-white">
                    {comment.user?.name ?? "User"}
                  </Text>
                  {comment.created_at ? (
                    <Text className="text-[10px] font-inter text-[#FAFAFA]">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </Text>
                  ) : null}
                  <Text
                    className="text-xs font-inter mt-2 leading-[15px]"
                    style={{ color: "#F7F7F7" }}
                  >
                    {comment.content}
                  </Text>
                  <View className="flex-row items-center justify-between mt-3">
                    <View className="flex-row items-center gap-4">
                      <Feather name="message-circle" size={15} color="#FAFAFA" />
                      <Feather name="heart" size={12} color="#FAFAFA" />
                      <Feather name="share" size={16} color="#FAFAFA" />
                    </View>
                    <Image
                      source={require("@/assets/images/btc.png")}
                      className="w-[19px] h-[19px]"
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Bottom spacing for scroll */}
          <View className="h-20" />
        </ScrollView>

        {/* Post a comment bar */}
        <View className="flex-row items-center px-5 py-2.5 gap-3">
          {/* User avatar */}
          <View className="w-[26px] h-[26px] rounded-full bg-[#FFE6EE] items-center justify-center" style={{ borderWidth: 1, borderColor: "#FFFFFF" }}>
            <Feather name="user" size={14} color="#FF82AD" />
          </View>

          {/* Input field */}
          <View className="flex-1 flex-row items-center bg-[#FF4E8A] rounded-[18px] h-10 px-4">
            <TextInput
              className="flex-1 text-sm font-inter text-white"
              placeholder="Post a comment"
              placeholderTextColor="#FFFFFF"
              value={commentText}
              onChangeText={setCommentText}
              editable={!sending}
            />
            <TouchableOpacity className="ml-2" onPress={handleSendComment} disabled={sending}>
              <SendIcon />
            </TouchableOpacity>
          </View>
        </View>

        {/* Home Indicator */}
        <View
          className="w-full h-[34px] bg-[#FF3378] items-center justify-center"
          style={{ paddingBottom: insets.bottom }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
