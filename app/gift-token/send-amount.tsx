import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

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

// QR scan icon
const QRIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24">
    <Path
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// Paste icon
const PasteIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24">
    <Path
      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// Chevron down icon
const ChevronDownIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path
      d="M6 9l6 6 6-6"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// Check circle icon
const CheckCircleIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      stroke="#4DC721"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

type CurrencyType = "USD" | "EUR" | "KES" | "NGN";

const conversionRates: Record<CurrencyType, number> = {
  USD: 1056,
  EUR: 1150,
  KES: 8,
  NGN: 0.7,
};

const currencyNames: Record<CurrencyType, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  KES: "Kenyan Shilling",
  NGN: "Nigerian Naira",
};

export default function SendAmountScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;

  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [currency, setCurrency] = useState<CurrencyType>("USD");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const handleScanQR = () => {
    Alert.alert(
      "QR Scanning",
      "Please type or paste the destination address manually.",
    );
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setDestination(text);
        Alert.alert("Pasted", `Destination set to: ${text}`);
      } else {
        Alert.alert("Clipboard Empty", "No text found in clipboard");
      }
    } catch (error) {
      console.error("Paste error:", error);
      Alert.alert("Error", "Failed to paste from clipboard");
    }
  };

  const toggleCurrency = () => {
    setShowCurrencyDropdown(!showCurrencyDropdown);
  };

  const selectCurrency = (curr: CurrencyType) => {
    setCurrency(curr);
    setShowCurrencyDropdown(false);
  };

  const calculateSatsEquivalent = (): string => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      return "0";
    }
    const satsEquivalent = amountValue * conversionRates[currency];
    return Math.round(satsEquivalent).toLocaleString();
  };

  const handleProceed = () => {
    if (!destination || !amount) {
      Alert.alert(
        "Required Fields",
        "Please fill in Destination and Amount to continue",
      );
      return;
    }

    router.push({
      pathname: "/gift-token/create-invoice",
      params: {
        category: params.category,
        destination,
        amount,
        currency,
        satsEquivalent: calculateSatsEquivalent(),
        note,
      },
    });
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
            Send Gift token
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-4">
          <Text className="text-white text-base mb-4">
            Input the amount you want to send.
          </Text>

          {/* Form Fields */}
          <View className="gap-4">
            {/* Destination */}
            <View>
              <Text className="text-white text-sm font-medium mb-2">
                Destination
              </Text>
              <View
                className="flex-row items-center px-4 py-3 rounded-lg"
                style={{ backgroundColor: "#FF6B9D" }}
              >
                <TextInput
                  className="flex-1 text-white text-base"
                  placeholder="Sarahabraham@blink.sv"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={destination}
                  onChangeText={setDestination}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TouchableOpacity onPress={handleScanQR} className="p-2">
                  <QRIcon />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePaste} className="p-2">
                  <PasteIcon />
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount */}
            <View className="relative" style={{ zIndex: 10 }}>
              <Text className="text-white text-sm font-medium mb-2">
                Amount
              </Text>
              <View
                className="flex-row items-center px-4 py-3 rounded-lg gap-3"
                style={{ backgroundColor: "#FF6B9D" }}
              >
                <TouchableOpacity
                  onPress={toggleCurrency}
                  className="flex-row items-center gap-1 px-3 py-2 rounded"
                  style={{ backgroundColor: "#FF4081" }}
                >
                  <Text className="text-white text-sm font-semibold">
                    {currency}
                  </Text>
                  <ChevronDownIcon />
                </TouchableOpacity>
                <TextInput
                  className="flex-1 text-white text-base"
                  placeholder="10.00"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Currency Dropdown */}
              {showCurrencyDropdown && (
                <View
                  className="absolute top-20 left-0 right-0 rounded-lg overflow-hidden shadow-lg"
                  style={{ backgroundColor: "#FF6B9D", zIndex: 20 }}
                >
                  {(["USD", "EUR", "KES", "NGN"] as CurrencyType[]).map(
                    (curr, index) => (
                      <TouchableOpacity
                        key={curr}
                        onPress={() => selectCurrency(curr)}
                        className="px-4 py-3"
                        style={{
                          borderBottomWidth: index < 3 ? 1 : 0,
                          borderBottomColor: "#FF99BC",
                        }}
                      >
                        <View className="flex-row justify-between items-center">
                          <View>
                            <Text className="text-white font-semibold text-base">
                              {curr}
                            </Text>
                            <Text className="text-white opacity-80 text-xs mt-0.5">
                              {currencyNames[curr]}
                            </Text>
                          </View>
                          {currency === curr && <CheckCircleIcon />}
                        </View>
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              )}

              {/* SATS Conversion Display */}
              {amount && parseFloat(amount) > 0 && (
                <View className="mt-2">
                  <Text className="text-white opacity-90 text-xs">
                    {currency} {amount} ≈ {calculateSatsEquivalent()} SATS
                  </Text>
                </View>
              )}
            </View>

            {/* Note */}
            <View>
              <Text className="text-white text-sm font-medium mb-2">
                Note (Optional)
              </Text>
              <View
                className="px-4 py-3 rounded-lg"
                style={{ backgroundColor: "#FF6B9D" }}
              >
                <TextInput
                  className="text-white text-base"
                  placeholder="For flowers"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={note}
                  onChangeText={setNote}
                  multiline
                />
              </View>
            </View>
          </View>
        </View>

        {/* Proceed Button */}
        <View
          className="px-4 pb-8"
          style={{ paddingBottom: insets.bottom + 32 }}
        >
          <TouchableOpacity
            onPress={handleProceed}
            disabled={!destination || !amount}
            className="py-4 rounded-full items-center"
            style={{
              backgroundColor: destination && amount ? "#FFB6C1" : "#FF8FAB",
              opacity: destination && amount ? 1 : 0.7,
            }}
          >
            <Text className="text-white text-base font-semibold">
              Create Invoice
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
