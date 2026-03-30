import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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
      stroke="#FAFAFA"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const CopyIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
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
  <Svg width={20} height={20} viewBox="0 0 24 24">
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

const QRPlaceholder = ({ value }: { value: string }) => {
  const size = 200;
  const cell = size / 21;
  const pattern = [
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
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
          ) : null,
        ),
      )}
    </Svg>
  );
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

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

  const {
    destination = "",
    amount = "10.00",
    currency = "USD",
    satsEquivalent = "923546",
    note = "",
    category = "",
  } = params;

  // Simulated invoice / wallet address string
  const walletAddress = `inbc10760nyx...3sqq6s7mw`;
  const invoiceString = `lnbc${satsEquivalent.replace(/,/g, "")}n1pjkx2ppsk5zqz0yfhszv9q`;

  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(invoiceString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    router.push({
      pathname: "/gift-token/success",
      params: {
        action: "send",
        category,
        destination,
        amount,
        currency,
        satsEquivalent,
        note,
      },
    });
  };

  // Format sats as BTC-like display
  const btcAmount = `0.${satsEquivalent.replace(/,/g, "").padStart(9, "0")}BTC`;

  return (
    <View className="flex-1" style={{ backgroundColor: "#FF4081" }}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      {/* Safe area top */}
      <View style={{ height: insets.top }} />

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
        <View
          className="flex-row items-center"
          style={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 8 }}
        >
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <BackIcon />
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              color: "#FFFFFF",
              fontSize: 20,
              fontWeight: "500",
              letterSpacing: -0.3,
              marginRight: 32,
            }}
          >
            Create Invoice
          </Text>
        </View>

        {/* Main card — vertically centered */}
        <View className="flex-1 items-center justify-center px-5">
          <View
            style={{
              width: "100%",
              maxWidth: 353,
              backgroundColor: "#FFE5EE",
              borderWidth: 0.5,
              borderColor: "#FF99BC",
              borderRadius: 16,
              padding: 20,
              gap: 20,
            }}
          >
            {/* Top section: QR + instruction */}
            <View className="items-center" style={{ gap: 10 }}>
              {/* QR code box */}
              <View
                style={{
                  width: 224,
                  height: 224,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 24,
                  padding: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <QRPlaceholder value={invoiceString} />
              </View>

              {/* Instruction text */}
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 15,
                  textAlign: "center",
                  letterSpacing: -0.01 * 12,
                  color: "#090909",
                  maxWidth: 229,
                }}
              >
                Scan QR code to make payment or copy wallet address below.
              </Text>
            </View>

            {/* Bottom section: wallet address + amount */}
            <View style={{ gap: 12 }}>
              {/* Row 1: wallet address + expiry */}
              <View
                className="flex-row items-center justify-between"
                style={{ gap: 44 }}
              >
                {/* Wallet address */}
                <View style={{ gap: 6 }}>
                  <Text
                    style={{ fontSize: 10, lineHeight: 16, color: "#4F4F4F" }}
                  >
                    Wallet address
                  </Text>
                  <View className="flex-row items-center" style={{ gap: 8 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "500",
                        lineHeight: 18,
                        color: "#090909",
                      }}
                    >
                      {walletAddress}
                    </Text>
                    <TouchableOpacity onPress={handleCopy}>
                      {copied ? <CheckIcon /> : <CopyIcon />}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Invoice expiry */}
                <View className="items-end" style={{ gap: 6 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      lineHeight: 16,
                      color: "#4F4F4F",
                      textAlign: "center",
                    }}
                  >
                    Invoice expires in:
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      lineHeight: 18,
                      color: "#090909",
                      textAlign: "center",
                    }}
                  >
                    {formatTime(timeLeft)}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View
                style={{ height: 1, backgroundColor: "#FFD6E4", width: "100%" }}
              />

              {/* Row 2: amount + USD equivalent */}
              <View
                className="flex-row items-center justify-between"
                style={{ gap: 44 }}
              >
                {/* Amount to send */}
                <View style={{ gap: 6 }}>
                  <Text
                    style={{ fontSize: 10, lineHeight: 16, color: "#4F4F4F" }}
                  >
                    Amount to send
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "500",
                      lineHeight: 18,
                      color: "#090909",
                    }}
                  >
                    {btcAmount}
                  </Text>
                </View>

                {/* USD equivalent */}
                <View className="items-end" style={{ gap: 6 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      lineHeight: 16,
                      color: "#4F4F4F",
                      textAlign: "center",
                    }}
                  >
                    USD equivalent
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      lineHeight: 18,
                      color: "#090909",
                      textAlign: "center",
                    }}
                  >
                    ${amount}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom: button + home indicator */}
        <View style={{ gap: 20 }}>
          {/* Button row */}
          <View className="items-center">
            <TouchableOpacity
              onPress={handleConfirm}
              style={{
                width: 250,
                height: 50,
                backgroundColor: "#FF82AD",
                borderWidth: 0.5,
                borderColor: "#FF669A",
                borderRadius: 1000,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 15,
                  fontWeight: "500",
                  lineHeight: 18,
                  textAlign: "center",
                }}
              >
                I have sent the tip
              </Text>
            </TouchableOpacity>
          </View>

          {/* Home indicator */}
          <View
            style={{
              width: "100%",
              height: 34,
              backgroundColor: "#FF3378",
              alignItems: "center",
              justifyContent: "flex-end",
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
    </View>
  );
}
