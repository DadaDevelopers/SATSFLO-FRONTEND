import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CODE_LENGTH = 6;

export default function EnterCodeScreen() {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
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

  const isComplete = code.every((c) => c !== "");

  const focusFirst = () => {
    const firstEmpty = code.findIndex((c) => !c);
    const target = firstEmpty === -1 ? CODE_LENGTH - 1 : firstEmpty;
    inputRefs.current[target]?.focus();
  };

  const handleConnect = async () => {
    if (!isComplete) return;
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        const { response, data } = await api.post(
          "/partner/accept",
          { invite_code: code.join("") },
          token
        );
        if (!response.ok) {
          Alert.alert("Error", data?.message || "Invalid or expired code.");
          return;
        }
      }
    } catch {
      Alert.alert("Error", "Could not connect. Please try again.");
      return;
    }
    router.push("/(tabs)/whats-your-partner-name" as any);
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
          className="bg-[#FF4081] rounded-full h-14 flex-row items-center justify-center"
          style={{ width: 309, gap: 6 }}
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
                  width: 30,
                  height: 44,
                  fontWeight: "300",
                  color: "#FFFFFF",
                  fontSize: 32,
                  lineHeight: 40,
                  textAlign: "center",
                  borderBottomWidth: 2,
                  borderBottomColor: code[i] ? "transparent" : "#FF90B6",
                }}
                cursorColor="#FFFFFF"
                selectionColor="rgba(255,255,255,0.3)"
                placeholderTextColor="#FF90B6"
                placeholder="_"
              />
            ))}
        </TouchableOpacity>
      </View>

      {/* Push button to bottom */}
      <View className="flex-1" />

      {/* Connect button */}
      <View className="items-center" style={{ paddingBottom: 28 }}>
        <TouchableOpacity
          onPress={handleConnect}
          activeOpacity={0.8}
          className="w-[250px] h-14 rounded-full items-center justify-center"
          style={{ backgroundColor: isComplete ? "#FF82AD" : "#FF82AD99" }}
        >
          <Text className="font-inter font-medium text-[15px] text-white">
            Connect
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
