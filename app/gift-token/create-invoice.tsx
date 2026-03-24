import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Rect } from "react-native-svg";

const MAX_CONTENT_WIDTH = 480;

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

const CopyIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
      stroke="#FF4081"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const CheckIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M5 13l4 4L19 7"
      stroke="#4DC721"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// Minimal QR placeholder — replaced by a real QR library when available
const QRPlaceholder = ({ value }: { value: string }) => {
  const size = 180;
  const cell = size / 21;
  // Simple fixed pattern as a visual stand-in
  const pattern = [
    [1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1,0],
    [0,1,0,0,1,0,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1],
    [1,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,0,1,1,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,1,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,0,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,0,1,0,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,0,1,1,0,1,1],
  ];
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {pattern.map((row, r) =>
        row.map((col, c) =>
          col ? (
            <Rect
              key={`${r}-${c}`}
              x={c * cell}
              y={r * cell}
              width={cell}
              height={cell}
              fill="#1E1E1E"
            />
          ) : null
        )
      )}
    </Svg>
  );
};

// Status bar visual — matches Figma dynamic island design
const FigmaStatusBar = () => {
  useWindowDimensions();
  if (Platform.OS !== "web") return null;
  return (
    <View
      style={{
        width: "100%",
        height: 44,
        flexDirection: "row",
        alignItems: "flex-end",
        backgroundColor: "rgba(77,72,69,0.02)",
      }}
    >
      {/* Left — time */}
      <View
        style={{
          flex: 1,
          height: 59,
          backgroundColor: "#FFFFFF",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 3,
          paddingLeft: 10,
        }}
      >
        <Text
          style={{
            fontWeight: "600",
            fontSize: 16,
            letterSpacing: -0.32,
            color: "#090909",
          }}
        >
          9:41
        </Text>
      </View>

      {/* Center — Dynamic Island */}
      <View
        style={{
          flex: 1,
          height: 59,
          backgroundColor: "#FFFFFF",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 125,
            height: 37,
            backgroundColor: "#FF99BC",
            borderRadius: 100,
          }}
        />
      </View>

      {/* Right — signal / wifi / battery */}
      <View
        style={{
          flex: 1,
          height: 59,
          backgroundColor: "#FFFFFF",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingRight: 11,
          gap: 8,
        }}
      >
        {/* Signal bars */}
        <Svg width={18} height={12} viewBox="0 0 18 12">
          <Rect x={0} y={8} width={3} height={4} rx={1} fill="#090909" />
          <Rect x={5} y={5} width={3} height={7} rx={1} fill="#090909" />
          <Rect x={10} y={2} width={3} height={10} rx={1} fill="#090909" />
          <Rect x={15} y={0} width={3} height={12} rx={1} fill="#090909" />
        </Svg>
        {/* Wifi */}
        <Svg width={17} height={12} viewBox="0 0 17 12">
          <Path d="M8.5 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#090909" />
          <Path d="M5.2 7.2a4.7 4.7 0 016.6 0" stroke="#090909" strokeWidth={1.5} fill="none" strokeLinecap="round" />
          <Path d="M2 4.2a8.5 8.5 0 0113 0" stroke="#090909" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </Svg>
        {/* Battery */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 25,
              height: 13,
              borderWidth: 1,
              borderColor: "rgba(9,9,9,0.35)",
              borderRadius: 4,
              padding: 2,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#090909",
                borderRadius: 2,
              }}
            />
          </View>
          <View
            style={{
              width: 1.4,
              height: 4,
              backgroundColor: "rgba(9,9,9,0.4)",
              marginLeft: 1,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default function CreateInvoiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;

  const params = useLocalSearchParams<{
    destination?: string;
    amount?: string;
    currency?: string;
    satsEquivalent?: string;
    note?: string;
    category?: string;
  }>();

  const { destination = "", amount = "", currency = "USD", satsEquivalent = "0", note = "", category = "" } = params;

  // Simulated invoice string
  const invoiceString = `lnbc${satsEquivalent.replace(/,/g, "")}n1pjkx2ppsk5zqz0yfhszv9q`;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(invoiceString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    router.push({
      pathname: "/gift-token/select-wallet",
      params: { action: "send", category, destination, amount, currency, satsEquivalent, note },
    });
  };

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: "#FF4081" }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Figma status bar (web only) */}
      <FigmaStatusBar />

      {/* Safe area top padding for native */}
      {Platform.OS !== "web" && (
        <View style={{ height: insets.top }} />
      )}

      {/* Desktop wrapper */}
      <View
        className="flex-1"
        style={
          isDesktop
            ? { maxWidth: MAX_CONTENT_WIDTH, width: "100%", alignSelf: "center" }
            : undefined
        }
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <BackIcon />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white text-xl font-semibold mr-8">
            Create Invoice
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-4">

          {/* Invoice summary card */}
          <View
            className="rounded-2xl p-4 mb-4"
            style={{ backgroundColor: "#FF6B9D" }}
          >
            <Text className="text-white text-xs font-medium opacity-80 mb-3 uppercase tracking-wide">
              Invoice Summary
            </Text>

            <View className="gap-2">
              {destination ? (
                <View className="flex-row justify-between">
                  <Text className="text-white text-sm opacity-80">To</Text>
                  <Text className="text-white text-sm font-medium" numberOfLines={1} style={{ maxWidth: "65%" }}>
                    {destination}
                  </Text>
                </View>
              ) : null}

              <View className="flex-row justify-between">
                <Text className="text-white text-sm opacity-80">Amount</Text>
                <Text className="text-white text-sm font-medium">
                  {currency} {amount}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-white text-sm opacity-80">SATS</Text>
                <Text className="text-white text-sm font-semibold">
                  {satsEquivalent} sats
                </Text>
              </View>

              {note ? (
                <View className="flex-row justify-between">
                  <Text className="text-white text-sm opacity-80">Note</Text>
                  <Text className="text-white text-sm font-medium" numberOfLines={1} style={{ maxWidth: "65%" }}>
                    {note}
                  </Text>
                </View>
              ) : null}

              {category ? (
                <View className="flex-row justify-between">
                  <Text className="text-white text-sm opacity-80">Category</Text>
                  <Text className="text-white text-sm font-medium capitalize">{category}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* QR Code */}
          <View className="items-center mb-4">
            <View
              className="rounded-2xl p-4 items-center justify-center"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <QRPlaceholder value={invoiceString} />
            </View>
            <Text className="text-white text-xs opacity-70 mt-2">
              Scan to pay
            </Text>
          </View>

          {/* Invoice string */}
          <View
            className="rounded-xl px-4 py-3 flex-row items-center gap-3"
            style={{ backgroundColor: "#FF6B9D" }}
          >
            <Text
              className="flex-1 text-white text-xs"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {invoiceString}
            </Text>
            <TouchableOpacity onPress={handleCopy} className="p-1">
              {copied ? <CheckIcon /> : <CopyIcon />}
            </TouchableOpacity>
          </View>

          {copied && (
            <Text className="text-white text-xs text-center mt-2 opacity-80">
              Copied to clipboard
            </Text>
          )}
        </View>

        {/* Confirm Button */}
        <View
          className="px-4"
          style={{ paddingBottom: insets.bottom + 32 }}
        >
          <TouchableOpacity
            onPress={handleConfirm}
            className="py-4 rounded-full items-center"
            style={{ backgroundColor: "#FFB6C1" }}
          >
            <Text className="text-white text-base font-semibold">
              Confirm &amp; Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
