import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CODE_LENGTH = 6;

export default function EnterCodeScreen() {
  const insets = useSafeAreaInsets();
  const { code: codeParam } = useLocalSearchParams<{ code?: string }>();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Pre-fill from deep link param (e.g. satsflo.app/invite?code=X9L4Q8)
  useEffect(() => {
    if (codeParam) {
      const chars = codeParam.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, CODE_LENGTH);
      const filled = Array(CODE_LENGTH).fill("").map((_, i) => chars[i] ?? "");
      setCode(filled);
    }
  }, [codeParam]);

  const handleChange = (text: string, index: number) => {
    // Handle paste: distribute all characters starting from current index
    if (text.length > 1) {
      const chars = text.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, CODE_LENGTH);
      const newCode = [...code];
      chars.split("").forEach((char, i) => {
        if (index + i < CODE_LENGTH) newCode[index + i] = char;
      });
      setCode(newCode);
      const lastFilled = Math.min(index + chars.length - 1, CODE_LENGTH - 1);
      inputRefs.current[lastFilled]?.focus();
      return;
    }
    const char = text.slice(-1).toUpperCase();
    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);
    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const isComplete = code.every((c) => c !== "");

  const focusFirst = () => {
    const firstEmpty = code.findIndex((c) => !c);
    const target = firstEmpty === -1 ? CODE_LENGTH - 1 : firstEmpty;
    inputRefs.current[target]?.focus();
  };

  const handleConnect = async () => {
    if (!isComplete || submitting) return;
    setConnectError(null);
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        setConnectError("Session expired. Please log in again.");
        return;
      }
      const { response, data } = await api.post(
        "/partner/accept",
        { invite_code: code.join("") },
        token
      );
      if (!response.ok) {
        const msg: string = data?.message ?? data?.error ?? "";
        const lower = msg.toLowerCase();
        if (lower.includes("duplicate") || lower.includes("unique constraint") || lower.includes("already connected") || lower.includes("already paired")) {
          setConnectError("You're already connected to a partner. To link a new partner, go to Settings → Partner Mode and disconnect first.");
        } else if (response.status === 404 || lower.includes("not found") || lower.includes("invalid")) {
          setConnectError("Code not found. Double-check the code and try again.");
        } else if (response.status === 410 || lower.includes("expired")) {
          setConnectError("This code has expired. Ask your partner to generate a new one.");
        } else {
          setConnectError(msg || "Could not connect. Please try again.");
        }
        return;
      }
      router.push("/(tabs)/whats-your-partner-name" as any);
    } catch {
      setConnectError("Could not connect. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Header */}
      <View
        className="flex-row items-center px-5 h-6"
        style={{ marginTop: insets.top + 28 }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/invite-partner" as any)}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>

        <Text className="flex-1 text-center font-inter font-medium text-xl text-white tracking-[-0.3px]">
          Enter Code to Connect
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Code entry card */}
      <View
        className="mx-5 bg-[#FFE6EE] rounded-xl border-[0.5px] border-[#DBE2E8] items-center py-4"
        style={{ marginTop: 80, gap: 24 }}
      >
        <Text className="font-inter font-bold text-xl leading-[30px] text-[#222222]">
          CODE
        </Text>

        {/* Pink pill with 6 input slots */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={focusFirst}
          style={{
            width: 309,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#FF4081",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {Array(CODE_LENGTH)
            .fill(null)
            .map((_, i) => (
              <TextInput
                key={i}
                ref={(ref) => {
                  inputRefs.current[i] = ref;
                }}
                value={code[i]}
                onChangeText={(text) => handleChange(text, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                maxLength={1}
                autoCapitalize="characters"
                style={{
                  width: 32,
                  height: 40,
                  fontWeight: "700",
                  color: "#FFFFFF",
                  fontSize: 20,
                  textAlign: "center",
                  textAlignVertical: "center",
                  includeFontPadding: false,
                  paddingTop: 0,
                  paddingBottom: 0,
                  borderBottomWidth: 2,
                  borderBottomColor: code[i] ? "transparent" : "#FFFFFF",
                }}
                cursorColor="#FFFFFF"
                selectionColor="rgba(255,255,255,0.3)"
                placeholderTextColor="rgba(255,255,255,0.5)"
                placeholder=" "
              />
            ))}
        </TouchableOpacity>
      </View>

      {/* Inline error */}
      {connectError && (
        <View className="mx-5 mt-4 px-4 py-3 bg-red-100 rounded-xl flex-row items-center justify-between">
          <Text className="text-red-600 text-sm flex-1">{connectError}</Text>
          <TouchableOpacity onPress={() => setConnectError(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text className="text-red-400 text-base ml-2">✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Push button to bottom */}
      <View className="flex-1" />

      {/* Connect button */}
      <View className="items-center" style={{ paddingBottom: 28 }}>
        <TouchableOpacity
          onPress={handleConnect}
          disabled={!isComplete || submitting}
          activeOpacity={0.8}
          className="w-[250px] h-14 rounded-full items-center justify-center"
          style={{ backgroundColor: isComplete && !submitting ? "#FF82AD" : "#FF82AD99" }}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="font-inter font-medium text-[15px] text-white">
              Connect
            </Text>
          )}
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
