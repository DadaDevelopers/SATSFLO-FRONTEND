import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WALLETS = ["Blink", "Bitnob", "Breeze", "Phoenix", "Aqua"];

export default function ConnectWalletScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("Blink");

  return (
    <View style={{ flex: 1, backgroundColor: "#FF4081" }}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          marginTop: insets.top + 20,
          height: 32,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/settings" as any)}
          activeOpacity={0.7}
          style={{ width: 32 }}
        >
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: 20,
            lineHeight: 24,
            letterSpacing: -0.3,
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          Connect Wallet
        </Text>

        <View style={{ width: 32 }} />
      </View>

      {/* Wallet list card */}
      <View
        style={{
          marginHorizontal: 20,
          marginTop: 24,
          backgroundColor: "#FFE6EE",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {WALLETS.map((wallet, index) => (
          <TouchableOpacity
            key={wallet}
            onPress={() => setSelected(wallet)}
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 12,
              height: 53,
              borderBottomWidth: index < WALLETS.length - 1 ? 0.8 : 0,
              borderBottomColor: "#FFD6E4",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter",
                fontWeight: "400",
                fontSize: 14,
                lineHeight: 21,
                color: "#1E1E1E",
              }}
            >
              {wallet}
            </Text>

            {selected === wallet && (
              <Feather name="check-circle" size={18} color="#4DC721" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Bottom: Save button + home indicator */}
      <View style={{ alignItems: "center", gap: 20 }}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/settings" as any)}
          activeOpacity={0.8}
          style={{
            width: 250,
            height: 56,
            backgroundColor: "#FF82AD",
            borderWidth: 0.5,
            borderColor: "#FF669A",
            borderRadius: 1000,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter",
              fontWeight: "500",
              fontSize: 15,
              lineHeight: 18,
              color: "#FFFFFF",
            }}
          >
            Save
          </Text>
        </TouchableOpacity>

        {/* Home indicator bar */}
        <View
          style={{
            width: "100%",
            height: 34,
            backgroundColor: "#FF3378",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 8,
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
    </View>
  );
}
