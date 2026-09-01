import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Share, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const referralKey = (email?: string) => `referral-code:${email?.toLowerCase() || "current-user"}`;

function createReferralCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return `SATS-${Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("")}`;
}

export default function InviteFriendScreen() {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState("");
  const [name, setName] = useState("a friend");

  useEffect(() => {
    const loadReferral = async () => {
      const user = JSON.parse((await AsyncStorage.getItem("user")) || "{}");
      setName(user.name || "a friend");
      const key = referralKey(user.email);
      const storedCode = await AsyncStorage.getItem(key);
      const referralCode = storedCode || createReferralCode();
      if (!storedCode) await AsyncStorage.setItem(key, referralCode);
      setCode(referralCode);
    };
    loadReferral().catch(() => setCode(createReferralCode()));
  }, []);

  const referralLink = `https://satsflo.app/referral?code=${encodeURIComponent(code)}`;
  const message = `Hi! ${name} invited you to try SATSFLO, a private cycle-tracking app. Join with this referral link: ${referralLink}`;

  const shareReferral = async () => {
    try {
      await Share.share({ message, url: referralLink });
    } catch {
      // The native share sheet was dismissed.
    }
  };

  const copyReferral = async () => {
    await Clipboard.setStringAsync(referralLink);
    Alert.alert("Referral link copied", "Send it to a friend whenever you are ready.");
  };

  return (
    <View className="flex-1 bg-[#FF4081]" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />
      <View className="flex-row items-center px-5 pt-7">
        <TouchableOpacity onPress={() => router.push("/(tabs)/settings" as any)} accessibilityLabel="Go back">
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-inter font-medium text-xl text-white">Invite a friend</Text>
        <View className="w-6" />
      </View>

      <View className="flex-1 px-5 pt-16 items-center">
        <View className="w-24 h-24 rounded-full bg-[#FF82AD] items-center justify-center mb-8">
          <Feather name="heart" size={46} color="#FFFFFF" />
        </View>
        <Text className="font-inter font-semibold text-[28px] leading-9 text-white text-center">
          Share SATSFLO with someone you care about
        </Text>
        <Text className="font-inter text-[15px] leading-6 text-[#FFE6EE] text-center mt-4 px-4">
          Your friend can use this link to get started. This is not a partner invitation and does not share your cycle data.
        </Text>

        <View className="w-full bg-white rounded-2xl mt-10 p-5 items-center">
          <Text className="font-inter text-sm text-[#616161]">Your referral code</Text>
          <Text className="font-inter font-bold text-2xl tracking-[2px] text-[#1E1E1E] mt-2">
            {code || "Loading..."}
          </Text>
          <Text className="font-inter text-xs text-[#616161] text-center mt-4">Friends can open your link or enter this code when signing up.</Text>
        </View>
      </View>

      <View className="px-5 pb-8" style={{ paddingBottom: Math.max(insets.bottom, 16) + 16 }}>
        <TouchableOpacity
          disabled={!code}
          onPress={shareReferral}
          className="h-14 rounded-full bg-[#FF82AD] items-center justify-center"
          style={{ opacity: code ? 1 : 0.6 }}
        >
          <Text className="font-inter font-medium text-[15px] text-white">Share referral link</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={!code} onPress={copyReferral} className="h-12 items-center justify-center mt-2">
          <Text className="font-inter font-medium text-sm text-white underline">Copy link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
