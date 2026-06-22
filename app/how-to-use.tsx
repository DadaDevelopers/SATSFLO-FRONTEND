import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type UseCase = "cycle" | "partner";

export default function HowToUseScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<UseCase | null>(null);

  const handleNext = () => {
    if (selected === "cycle") router.push("/onboarding");
    else if (selected === "partner") router.push("/(auth)/signup?flow=partner" as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FF4081" }}>
      {/* Back arrow */}
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

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Title */}
        <Text
          className="font-inter font-medium text-white"
          style={{ fontSize: 24, lineHeight: 29, marginTop: insets.top + 56 }}
        >
          How will you be using Satsflo?
        </Text>

        {/* Card 1 — Track My Cycle */}
        <Pressable
          onPress={() => setSelected("cycle")}
          style={{
            marginTop: 24,
            flexDirection: "row",
            alignItems: "flex-start",
            padding: 16,
            gap: 8,
            backgroundColor: "#FFE6EE",
            borderRadius: 12,
            borderWidth: selected === "cycle" ? 1.5 : 0.5,
            borderColor: selected === "cycle" ? "#CC0045" : "#DBE2E8",
            minHeight: 94,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 100,
              borderWidth: 0.5,
              borderStyle: "dashed",
              borderColor: "#CC0045",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 14 }}>🩸</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text
              className="font-inter font-medium"
              style={{ fontSize: 20, lineHeight: 24, color: "#222222" }}
            >
              Track My Cycle
            </Text>
            <Text
              className="font-inter"
              style={{ fontSize: 14, lineHeight: 17, color: "#1E1E1E" }}
            >
              For people using Satsflo for personal cycle tracking.
            </Text>
          </View>
        </Pressable>

        {/* Card 2 — Join as Partner/Friend */}
        <Pressable
          onPress={() => setSelected("partner")}
          style={{
            marginTop: 16,
            flexDirection: "row",
            alignItems: "flex-start",
            padding: 16,
            gap: 8,
            backgroundColor: "#FF99BC",
            borderRadius: 12,
            borderWidth: selected === "partner" ? 1.5 : 1,
            borderColor: selected === "partner" ? "#CC0045" : "#FBFBFB",
            minHeight: 77,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 100,
              borderWidth: 0.5,
              borderStyle: "dashed",
              borderColor: "#CC0045",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 14 }}>💌</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text
              className="font-inter font-medium"
              style={{ fontSize: 20, lineHeight: 24, color: "#222222" }}
            >
              Join as a Partner/Friend
            </Text>
            <Text
              className="font-inter"
              style={{ fontSize: 14, lineHeight: 17, color: "#1E1E1E" }}
            >
              Use an invite code to support someone.
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Next button + sign-in link */}
      <View style={{ alignItems: "center", paddingBottom: 28, gap: 16 }}>
        <TouchableOpacity
          onPress={handleNext}
          disabled={!selected}
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
            opacity: selected ? 1 : 0.55,
          }}
        >
          <Text
            className="font-inter font-medium text-white"
            style={{ fontSize: 15 }}
          >
            Next
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push(
              selected === "partner"
                ? ("/(auth)/login?flow=partner" as any)
                : ("/(auth)/login" as any)
            )
          }
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "Inter",
            }}
          >
            Already have an account?{" "}
            <Text style={{ fontWeight: "600", color: "#FFFFFF" }}>Sign in</Text>
          </Text>
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
