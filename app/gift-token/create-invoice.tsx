import { api } from "@/lib/api";
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
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const MAX_CONTENT_WIDTH = 480;

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke="#FAFAFA"
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
      d="M16.8742 2.5H6.87475C6.70899 2.5 6.55003 2.56584 6.43283 2.68305C6.31563 2.80025 6.24978 2.95921 6.24978 3.12496V6.24978H3.12496C2.95921 6.24978 2.80025 6.31563 2.68305 6.43283C2.56584 6.55003 2.5 6.70899 2.5 6.87475V16.8742C2.5 17.0399 2.56584 17.1989 2.68305 17.3161C2.80025 17.4333 2.95921 17.4991 3.12496 17.4991H13.1244C13.2901 17.4991 13.4491 17.4333 13.5663 17.3161C13.6835 17.1989 13.7493 17.0399 13.7493 16.8742V13.7493H16.8742C17.0399 13.7493 17.1989 13.6835 17.3161 13.5663C17.4333 13.4491 17.4991 13.2901 17.4991 13.1244V3.12496C17.4991 2.95921 17.4333 2.80025 17.3161 2.68305C17.1989 2.56584 17.0399 2.5 16.8742 2.5ZM12.4994 16.2492H3.74993V7.49971H12.4994V16.2492ZM16.2492 12.4994H13.7493V6.87475C13.7493 6.70899 13.6835 6.55003 13.5663 6.43283C13.4491 6.31563 13.2901 6.24978 13.1244 6.24978H7.49971V3.74993H16.2492V12.4994Z"
      fill="#FF4081"
    />
  </Svg>
);

const CheckIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
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
    bolt11?: string;
    payment_hash?: string;
    expires_at?: string;
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
    await Clipboard.setStringAsync(bolt11 || satsEquivalent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async () => {
    if (timeLeft === 0) {
      Alert.alert("Invoice Expired", "This invoice has expired. Please go back and create a new one.");
      return;
    }
    setConfirming(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token && payment_hash) {
        const { response } = await api.post(
          "/payments/confirm",
          { payment_hash },
          token
        );
        if (!response.ok && response.status !== 409) {
          // 409 = already confirmed (treat as success), 410 = expired
          if (response.status === 410) {
            Alert.alert("Invoice Expired", "This invoice has expired. Please go back and create a new one.");
            setConfirming(false);
            return;
          }
          // For other errors, still proceed (manual confirmation)
        }
      }
    } catch {
      // Network error — still proceed with manual confirmation flow
    } finally {
      setConfirming(false);
    }

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
    <View className="flex-1" style={{ backgroundColor: "#FF4081" }}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      {/* Safe area top */}
      <View style={{ height: insets.top }} />
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
              <View className="flex-row items-center justify-between">
                {/* Wallet address */}
                <View style={{ gap: 6, flex: 1, marginRight: 12 }}>
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
                        flexShrink: 1,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="middle"
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
                      textAlign: "right",
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
                      textAlign: "right",
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
              <View className="flex-row items-center justify-between">
                {/* Amount to send */}
                <View style={{ gap: 6, flex: 1, marginRight: 12 }}>
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
                    numberOfLines={1}
                    adjustsFontSizeToFit
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
                      textAlign: "right",
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
                      textAlign: "right",
                    }}
                  >
                    ${amount}
                  </Text>
                </View>
              </View>
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
