import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

const MAX_CONTENT_WIDTH = 480;

// Back arrow icon
const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// Green checkmark icon
const CheckIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#4ADE80" />
    <Path
      d="M8 12l3 3 5-6"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

type WalletType = "blink" | "walletOfSatoshi" | null;

interface WalletOption {
  id: WalletType;
  label: string;
  logo: any;
}

const wallets: WalletOption[] = [
  {
    id: "blink",
    label: "Blink",
    logo: require("@/assets/images/blinklogo.png"),
  },
  {
    id: "walletOfSatoshi",
    label: "Wallet of Satoshi",
    logo: require("@/assets/images/walletofsatoshilogo.png"),
  },
];

export default function SelectWalletScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    action?: "send" | "receive";
    category?: string;
    destination?: string;
    amount?: string;
    currency?: string;
    satsEquivalent?: string;
    note?: string;
  }>();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;

  const [selectedWallet, setSelectedWallet] = useState<WalletType>("blink");

  const handleProceed = () => {
    if (selectedWallet) {
      router.push({
        pathname: "/gift-token/success",
        params: {
          action: params.action || "receive",
          wallet: selectedWallet,
          category: params.category,
          destination: params.destination,
          amount: params.amount,
          currency: params.currency,
          satsEquivalent: params.satsEquivalent,
          note: params.note,
        },
      });
    }
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: "#FF4081",
        paddingTop: insets.top,
      }}
    >
      {/* Desktop wrapper */}
      <View
        className="flex-1"
        style={
          isDesktop
            ? {
                maxWidth: MAX_CONTENT_WIDTH,
                width: "100%",
                alignSelf: "center",
              }
            : undefined
        }
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <BackIcon />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white text-xl font-semibold mr-8">
            Select Wallet
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-4">
          <Text className="text-white text-base mb-6">
            Select wallet to carry out your transaction.
          </Text>

          {/* Wallet Options */}
          {wallets.map((wallet) => (
            <TouchableOpacity
              key={wallet.id}
              onPress={() => setSelectedWallet(wallet.id)}
              className="rounded-xl mb-4 px-4 py-5 flex-row items-center"
              style={{
                backgroundColor: "#FF6B9D",
              }}
            >
              <Image
                source={wallet.logo}
                className="w-8 h-8"
                resizeMode="contain"
              />
              <Text className="text-white text-base font-medium ml-3 flex-1">
                {wallet.label}
              </Text>
              {selectedWallet === wallet.id && <CheckIcon />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Proceed Button */}
        <View
          className="px-4 pb-8"
          style={{ paddingBottom: insets.bottom + 32 }}
        >
          <TouchableOpacity
            onPress={handleProceed}
            disabled={!selectedWallet}
            className="py-4 rounded-full items-center"
            style={{
              backgroundColor: selectedWallet ? "#FFB6C1" : "#FF8FAB",
              opacity: selectedWallet ? 1 : 0.7,
            }}
          >
            <Text className="text-white text-base font-semibold">Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
