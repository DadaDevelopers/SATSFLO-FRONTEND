import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CODE_LENGTH = 6;

export default function EnterPartnerCodeScreen() {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Check clipboard for a copied invite code on mount
  useEffect(() => {
    (async () => {
      try {
        const text = await Clipboard.getStringAsync();
        if (/^[A-Z0-9]{6}$/i.test(text.trim())) {
          setCode(text.trim().toUpperCase().split(""));
          Alert.alert("Code pasted", "We found an invite code in your clipboard.");
        }
      } catch {
        // clipboard unavailable — ignore
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      const chars = text
        .replace(/[^A-Za-z0-9]/g, "")
        .toUpperCase()
        .slice(0, CODE_LENGTH);
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
    if (char && index < CODE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const focusFirst = () => {
    const firstEmpty = code.findIndex((c) => !c);
    inputRefs.current[
      firstEmpty === -1 ? CODE_LENGTH - 1 : firstEmpty
    ]?.focus();
  };

  const [submitting, setSubmitting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const isComplete = code.every((c) => c !== "");

  const handleNext = async () => {
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
        token,
      );
      if (!response.ok) {
        setConnectError(
          data?.message ||
            "Invalid or expired code. Please check and try again.",
        );
        return;
      }
      router.push("/(tabs)/partner-pairing-success");
    } catch {
      setConnectError(
        "Could not connect. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FF4081" }}>
      {/* Back arrow — top:75px on 852px Figma = insets.top + 16 */}
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.7}
        style={{
          position: "absolute",
          top: insets.top + 16,
          left: 20,
          zIndex: 10,
        }}
      >
        <Feather name="arrow-left" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Title block — top:115px on Figma */}
      <View
        style={{
          marginTop: insets.top + 56,
          paddingHorizontal: 20,
          gap: 4,
        }}
      >
        <Text
          className="font-inter font-medium text-white"
          style={{ fontSize: 24, lineHeight: 29 }}
        >
          Enter Partner Code
        </Text>
        <Text
          className="font-inter"
          style={{ fontSize: 14, lineHeight: 17, color: "#FAFAFA" }}
        >
          Enter the code shared with you to connect.
        </Text>
      </View>

      {/* Code card — Frame 107 */}
      <View
        style={{
          marginTop: 38,
          marginHorizontal: 20,
          backgroundColor: "#FFE6EE",
          borderRadius: 12,
          borderWidth: 0.5,
          borderColor: "#DBE2E8",
          paddingVertical: 16,
          paddingHorizontal: 16,
          alignItems: "center",
          gap: 24,
        }}
      >
        <Text
          className="font-inter"
          style={{
            fontWeight: "700",
            fontSize: 20,
            lineHeight: 30,
            color: "#222222",
            alignSelf: "stretch",
            textAlign: "center",
          }}
        >
          CODE
        </Text>

        {/* Pink pill — Frame 272 */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={focusFirst}
          style={{
            width: 309,
            height: 56,
            borderRadius: 1000,
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
                placeholder="_"
                placeholderTextColor="rgba(255,255,255,0.55)"
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
              />
            ))}
        </TouchableOpacity>
      </View>

      {/* Hint — Frame 1686553369 */}
      <Text
        className="font-inter text-center"
        style={{
          marginTop: 16,
          paddingHorizontal: 20,
          fontSize: 14,
          lineHeight: 21,
          fontStyle: "italic",
          letterSpacing: -0.14,
          color: "#FAFAFA",
        }}
      >
        Code can be found in the invite your partner shared.
      </Text>

      {connectError && (
        <View
          style={{
            marginTop: 12,
            marginHorizontal: 20,
            backgroundColor: "#CC0045",
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text
            className="font-inter"
            style={{ flex: 1, color: "#FFFFFF", fontSize: 13, lineHeight: 18 }}
          >
            {connectError}
          </Text>
          <TouchableOpacity onPress={() => setConnectError(null)} hitSlop={8}>
            <Feather name="x" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      <View style={{ flex: 1 }} />

      {/* Connect button */}
      <View style={{ alignItems: "center", paddingBottom: 28 }}>
        <TouchableOpacity
          onPress={handleNext}
          disabled={!isComplete || submitting}
          activeOpacity={0.8}
          style={{
            width: 250,
            height: 56,
            borderRadius: 1000,
            backgroundColor: "#FF82AD",
            borderWidth: 0.5,
            borderColor: "#FF99BC",
            alignItems: "center",
            justifyContent: "center",
            opacity: isComplete && !submitting ? 1 : 0.55,
          }}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text
              className="font-inter font-medium text-white"
              style={{ fontSize: 15 }}
            >
              Connect
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Home indicator */}
      <View
        style={{
          backgroundColor: "#FF3378",
          alignItems: "center",
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8) + 3,
        }}
      >
        <View
          style={{
            width: 134,
            height: 5,
            backgroundColor: "#FF99BC",
            borderRadius: 100,
          }}
        />
      </View>
    </View>
  );
}
