import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Share, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function GenerateInviteScreen() {
  const insets = useSafeAreaInsets();
  const [code] = useState(generateCode);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60 - 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    Alert.alert("Copied!", `Code ${code} copied to clipboard.`);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on SATSFLO! Use my invite code: ${code}`,
      });
    } catch {
      // share dismissed
    }
    router.push("/(tabs)/partner-pairing-success" as any);
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Header — back arrow | Generate Code | spacer */}
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

      {/* Code card */}
      <View className="mt-14 mx-5 bg-[#FFE6EE] rounded-xl border-[0.5px] border-[#DBE2E8] py-4 px-4 items-center gap-6">
        <Text className="font-inter font-bold text-xl leading-[30px] text-[#222222]">
          CODE
        </Text>

        {/* Pink pill: code + copy button */}
        <View className="flex-row items-center bg-[#FF4081] rounded-full py-2 px-6 w-[223px] h-14 justify-center gap-[10px]">
          <Text className="font-inter font-extrabold text-[32px] leading-10 text-white">
            {code}
          </Text>

          <TouchableOpacity
            onPress={handleCopy}
            activeOpacity={0.8}
            className="w-8 h-8 rounded-full bg-[#FF90B6] items-center justify-center"
          >
            <Feather name="copy" size={15} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Expiry countdown + share text */}
      <View className="items-center mt-3 gap-16">
        <Text className="font-inter font-medium text-sm leading-[21px] tracking-[-0.01em] text-[#FAFAFA] text-center">
          Code expires in {formatTime(timeLeft)}
        </Text>

        <Text className="font-inter italic font-semibold text-2xl leading-8 tracking-[-0.01em] text-white text-center w-[239px]">
          Share this code with your partner
        </Text>
      </View>

      {/* Push button to bottom */}
      <View className="flex-1" />

      {/* Share my code button */}
      <View className="items-center pb-7">
        <TouchableOpacity
          onPress={handleShare}
          activeOpacity={0.8}
          className="w-[250px] h-14 bg-[#FF82AD] rounded-full items-center justify-center"
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
