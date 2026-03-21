import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function GenerateInviteScreen() {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60 - 1);

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          const { response, data } = await api.post(
            "/partner/invite",
            {},
            token,
          );
          if (response.ok) {
            const d = data?.data ?? data;
            setCode(d?.invite_code ?? d?.code ?? "");
          }
        }
      } catch {}
    };
    fetchCode();
  }, []);

  useEffect(() => {
    fetchCode();
    return () => {
      stopPolling();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown timer — restarts whenever timeLeft is first set to a positive value
  useEffect(() => {
    if (timeLeft <= 0) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          stopPolling();
          setInviteStatus("expired");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft === 0 ? 0 : 1]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    Alert.alert("Copied!", `Code ${code} copied to clipboard.`);
  };

  const handleShare = async () => {
    try {
      const content =
        shareUrl || `Join me on SATSFLO! Use my invite code: ${code}`;
      await Share.share({ message: content });
    } catch {
      // share dismissed
    }
  };

  const isExpired = inviteStatus === "expired" || timeLeft === 0;

  const expiryLabel = loading
    ? "Generating code..."
    : isExpired
      ? "Code expired — generate a new one"
      : `Code expires in ${formatTime(timeLeft)}`;

  const statusLabel =
    inviteStatus === "accepted"
      ? "Partner joined! Redirecting..."
      : inviteStatus === "expired"
        ? "This code is no longer valid."
        : statusChecking
          ? "Checking status..."
          : "Waiting for your partner to join...";

  const statusColor =
    inviteStatus === "accepted"
      ? "#4DC721"
      : inviteStatus === "expired"
        ? "#FF6B6B"
        : "#FAFAFA";

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Header */}
      <View
        className="flex-row items-center h-6 px-5"
        style={{ marginTop: insets.top + 28 }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/sharing-invite" as any)}
          activeOpacity={0.7}
          className="w-6"
        >
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>

        <Text className="flex-1 text-center font-inter font-medium text-xl text-white tracking-[-0.3px]">
          Generate Code
        </Text>

        <View className="w-6" />
      </View>

      {/* Error banner */}
      {error && (
        <View className="mx-5 mt-6 px-4 py-3 bg-red-100 rounded-xl flex-row items-center justify-between">
          <Text className="text-red-600 text-sm flex-1">{error}</Text>
          <TouchableOpacity
            onPress={fetchCode}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text className="text-red-500 text-sm font-semibold ml-3">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Code card */}
      <View className="mt-14 mx-5 bg-[#FFE6EE] rounded-xl border-[0.5px] border-[#DBE2E8] py-4 px-4 items-center gap-6">
        <Text className="font-inter font-bold text-xl leading-[30px] text-[#222222]">
          CODE
        </Text>

        {/* Pink pill: code + copy button */}
        <View
          className="flex-row items-center rounded-full py-2 px-6 w-[223px] h-14 justify-center gap-[10px]"
          style={{ backgroundColor: isExpired ? "#FFAABB" : "#FF4081" }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text
                className="font-inter font-extrabold text-[32px] leading-10 text-white"
                style={{ opacity: isExpired ? 0.5 : 1 }}
              >
                {code}
              </Text>
              {!isExpired && (
                <TouchableOpacity
                  onPress={handleCopy}
                  activeOpacity={0.8}
                  className="w-8 h-8 rounded-full bg-[#FF90B6] items-center justify-center"
                >
                  <Feather name="copy" size={15} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      {/* Expiry + status */}
      <View className="items-center mt-3 gap-4">
        <Text className="font-inter font-medium text-sm leading-[21px] tracking-[-0.01em] text-[#FAFAFA] text-center">
          {expiryLabel}
        </Text>

        {/* Live status indicator */}
        {!loading && !error && (
          <View className="flex-row items-center gap-2">
            {statusChecking && inviteStatus === "pending" ? (
              <ActivityIndicator size="small" color="#FAFAFA" />
            ) : (
              <View
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    inviteStatus === "accepted"
                      ? "#4DC721"
                      : inviteStatus === "expired"
                        ? "#FF6B6B"
                        : "#FFD6E4",
                }}
              />
            )}
            <Text
              className="font-inter text-sm tracking-[-0.01em]"
              style={{ color: statusColor }}
            >
              {statusLabel}
            </Text>
          </View>
        )}
      </View>

      {/* Expired — regenerate button */}
      {isExpired && !loading && (
        <View className="items-center mt-6">
          <TouchableOpacity
            onPress={fetchCode}
            activeOpacity={0.8}
            className="px-6 py-2.5 bg-white/20 rounded-full"
          >
            <Text className="font-inter font-medium text-sm text-white">
              Generate new code
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text className="font-inter italic font-semibold text-2xl leading-8 tracking-[-0.01em] text-white text-center w-[239px] mt-12 self-center">
        Share this code with your partner
      </Text>

      {/* Push button to bottom */}
      <View className="flex-1" />

      {/* Share my code button */}
      <View className="items-center pb-7">
        <TouchableOpacity
          onPress={handleShare}
          disabled={loading || isExpired}
          activeOpacity={0.8}
          className="w-[250px] h-14 rounded-full items-center justify-center"
          style={{
            backgroundColor: loading || isExpired ? "#FFAABB" : "#FF82AD",
          }}
        >
          <Text className="font-inter font-medium text-[15px] text-white">
            Share my code
          </Text>
        </TouchableOpacity>
      </View>

      {/* Home indicator */}
      <View
        className="bg-[#FF3378] items-center justify-end pt-2"
        style={{ paddingBottom: Math.max(insets.bottom, 8) + 3 }}
      >
        <View className="w-[134px] h-[5px] bg-[#FF99BC] rounded-full" />
      </View>
    </View>
  );
}
