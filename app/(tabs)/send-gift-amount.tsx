import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Svg, { Path } from "react-native-svg";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CurrencyType = "USD" | "EUR" | "KES" | "NGN";

// Fallback rates (non-USD currencies converted via approximate USD equivalent)
const usdEquivalent: Record<CurrencyType, number> = {
  USD: 1,
  EUR: 1.08,
  KES: 0.0077,
  NGN: 0.00065,
};

export default function SendGiftAmountScreen() {
  const insets = useSafeAreaInsets();
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [currency, setCurrency] = useState<CurrencyType>("USD");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  // Live BTC price
  const [satsPerUsd, setSatsPerUsd] = useState<number>(1060);

  // Validation state
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [minSats, setMinSats] = useState<number>(1);
  const [maxSats, setMaxSats] = useState<number>(1_000_000);
  const [destError, setDestError] = useState<string | null>(null);

  // Invoice creation
  const [creating, setCreating] = useState(false);

  const prevDestRef = useRef("");

  // Fetch live BTC price on mount
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) return;
        const { response, data } = await api.get("/payments/btc-price", token);
        if (response.ok) {
          const d = data?.data ?? data;
          if (d?.sats_per_usd) setSatsPerUsd(d.sats_per_usd);
        }
      } catch {}
    };
    fetchPrice();
  }, []);

  const handleBack = () => {
    router.back();
  };

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

  // Validate LN address when user leaves the destination field
  const handleDestinationBlur = async () => {
    const dest = destination.trim();
    if (!dest || dest === prevDestRef.current) return;
    prevDestRef.current = dest;
    setValidated(false);
    setDestError(null);
    setValidating(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) { setValidating(false); return; }
      const { response, data } = await api.post(
        "/payments/validate",
        { lightning_address: dest },
        token
      );
      if (response.ok) {
        const d = data?.data ?? data;
        if (d?.valid) {
          setValidated(true);
          if (d.min_sats != null) setMinSats(d.min_sats);
          if (d.max_sats != null) setMaxSats(d.max_sats);
        } else {
          setDestError("Address could not be reached. Please check and try again.");
        }
      } else {
        setDestError("Could not validate address.");
      }
    } catch {
      setDestError("Network error. Please try again.");
    } finally {
      setValidating(false);
    }
  };

  const calculateSatsAmount = (): number => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) return 0;
    const usdAmount = amountValue * usdEquivalent[currency];
    const sats = Math.round(usdAmount * satsPerUsd);
    return Math.min(Math.max(sats, minSats), maxSats);
  };

  const calculateSatsEquivalent = (): string => {
    const sats = calculateSatsAmount();
    return sats > 0 ? sats.toLocaleString() : "0";
  };

  const handleProceed = async () => {
    if (!destination || !amount) {
      Alert.alert(
        "Required Fields",
        "Please fill in Destination and Amount to continue",
      );
      return;
    }

    const sats = calculateSatsAmount();
    if (sats <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    setCreating(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Session expired", "Please log in again.");
        setCreating(false);
        return;
      }

      const { response, data } = await api.post(
        "/payments/tip",
        {
          lightning_address: destination.trim(),
          amount_sats: sats,
          note: note.trim() || undefined,
        },
        token
      );

      if (!response.ok) {
        Alert.alert("Error", data?.message ?? "Failed to create invoice. Please try again.");
        setCreating(false);
        return;
      }

      const d = data?.data ?? data;
      router.push({
        pathname: "/gift-token/create-invoice",
        params: {
          destination: destination.trim(),
          amount: amount,
          currency,
          satsEquivalent: String(d?.amount_sats ?? sats),
          note: note.trim(),
          bolt11: d?.bolt11_invoice ?? "",
          payment_hash: d?.payment_hash ?? "",
          expires_at: d?.expires_at ?? "",
        },
      });
    } catch {
      Alert.alert("Error", "Unable to create invoice. Check your connection.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FF4081]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-6">
        <Pressable onPress={handleBack} className="p-1">
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </Pressable>
        <Text className="text-xl font-inter font-medium text-white tracking-tight">
          Send Gift token
        </Text>
        <View className="w-6 h-6 opacity-0">
          <Feather name="calendar" size={24} color="#666666" />
        </View>
      </View>

      {/* Instruction Text */}
      <View className="px-5 mt-6">
        <Text className="text-sm font-inter text-[#FAFAFA] tracking-tight">
          Input the amount you want to send.
        </Text>
      </View>

      {/* Form Fields */}
      <View className="px-5 mt-4 gap-4">
        {/* Destination */}
        <View className="gap-2.5">
          <Text
            className="text-sm font-inter text-white"
            style={{ fontWeight: "500" }}
          >
            Destination
          </Text>
          <View className="flex-row justify-between items-center px-4" style={{ height: 52, borderWidth: 0.5, borderColor: destError ? '#FF6B6B' : validated ? '#4DC721' : '#FF99BC', borderRadius: 8.5 }}>
            <TextInput
              className="flex-1 text-sm font-inter text-white"
              style={{ fontWeight: "500" }}
              placeholder="Sarahabraham@blink.sv"
              placeholderTextColor="#FAFAFA"
              value={destination}
              onChangeText={(t) => { setDestination(t); setValidated(false); setDestError(null); prevDestRef.current = ""; }}
              onBlur={handleDestinationBlur}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <View className="flex-row gap-2 items-center">
              {validating && <Feather name="loader" size={14} color="#FAFAFA" />}
              {validated && !validating && <Feather name="check-circle" size={14} color="#4DC721" />}
              <Pressable onPress={handleScanQR}>
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <Path d="M14 2.5V5C14 5.13261 13.9473 5.25979 13.8536 5.35355C13.7598 5.44732 13.6326 5.5 13.5 5.5C13.3674 5.5 13.2402 5.44732 13.1464 5.35355C13.0527 5.25979 13 5.13261 13 5V3H11C10.8674 3 10.7402 2.94732 10.6464 2.85355C10.5527 2.75979 10.5 2.63261 10.5 2.5C10.5 2.36739 10.5527 2.24021 10.6464 2.14645C10.7402 2.05268 10.8674 2 11 2H13.5C13.6326 2 13.7598 2.05268 13.8536 2.14645C13.9473 2.24021 14 2.36739 14 2.5ZM5 13H3V11C3 10.8674 2.94732 10.7402 2.85355 10.6464C2.75979 10.5527 2.63261 10.5 2.5 10.5C2.36739 10.5 2.24021 10.5527 2.14645 10.6464C2.05268 10.7402 2 10.8674 2 11V13.5C2 13.6326 2.05268 13.7598 2.14645 13.8536C2.24021 13.9473 2.36739 14 2.5 14H5C5.13261 14 5.25979 13.9473 5.35355 13.8536C5.44732 13.7598 5.5 13.6326 5.5 13.5C5.5 13.3674 5.44732 13.2402 5.35355 13.1464C5.25979 13.0527 5.13261 13 5 13ZM13.5 10.5C13.3674 10.5 13.2402 10.5527 13.1464 10.6464C13.0527 10.7402 13 10.8674 13 11V13H11C10.8674 13 10.7402 13.0527 10.6464 13.1464C10.5527 13.2402 10.5 13.3674 10.5 13.5C10.5 13.6326 10.5527 13.7598 10.6464 13.8536C10.7402 13.9473 10.8674 14 11 14H13.5C13.6326 14 13.7598 13.9473 13.8536 13.8536C13.9473 13.7598 14 13.6326 14 13.5V11C14 10.8674 13.9473 10.7402 13.8536 10.6464C13.7598 10.5527 13.6326 10.5 13.5 10.5ZM2.5 5.5C2.63261 5.5 2.75979 5.44732 2.85355 5.35355C2.94732 5.25979 3 5.13261 3 5V3H5C5.13261 3 5.25979 2.94732 5.35355 2.85355C5.44732 2.75979 5.5 2.63261 5.5 2.5C5.5 2.36739 5.44732 2.24021 5.35355 2.14645C5.25979 2.05268 5.13261 2 5 2H2.5C2.36739 2 2.24021 2.05268 2.14645 2.14645C2.05268 2.24021 2 2.36739 2 2.5V5C2 5.13261 2.05268 5.25979 2.14645 5.35355C2.24021 5.44732 2.36739 5.5 2.5 5.5ZM5 4.5H11C11.1326 4.5 11.2598 4.55268 11.3536 4.64645C11.4473 4.74021 11.5 4.86739 11.5 5V11C11.5 11.1326 11.4473 11.2598 11.3536 11.3536C11.2598 11.4473 11.1326 11.5 11 11.5H5C4.86739 11.5 4.74021 11.4473 4.64645 11.3536C4.55268 11.2598 4.5 11.1326 4.5 11V5C4.5 4.86739 4.55268 4.74021 4.64645 4.64645C4.74021 4.55268 4.86739 4.5 5 4.5ZM5.5 10.5H10.5V5.5H5.5V10.5Z" fill="#FAFAFA" />
                </Svg>
              </Pressable>
              <Pressable onPress={handlePaste}>
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <Path d="M12.5 1.99991H10.2338C9.95281 1.68536 9.6086 1.4337 9.22367 1.26138C8.83873 1.08907 8.42174 1 8 1C7.57826 1 7.16127 1.08907 6.77633 1.26138C6.39139 1.4337 6.04719 1.68536 5.76625 1.99991H3.5C3.23478 1.99991 2.98043 2.10527 2.79289 2.2928C2.60536 2.48034 2.5 2.73469 2.5 2.99991V13.4999C2.5 13.7651 2.60536 14.0195 2.79289 14.207C2.98043 14.3946 3.23478 14.4999 3.5 14.4999H12.5C12.7652 14.4999 13.0196 14.3946 13.2071 14.207C13.3946 14.0195 13.5 13.7651 13.5 13.4999V2.99991C13.5 2.73469 13.3946 2.48034 13.2071 2.2928C13.0196 2.10527 12.7652 1.99991 12.5 1.99991ZM8 1.99991C8.53043 1.99991 9.03914 2.21062 9.41421 2.5857C9.78929 2.96077 10 3.46948 10 3.99991H6C6 3.46948 6.21071 2.96077 6.58579 2.5857C6.96086 2.21062 7.46957 1.99991 8 1.99991ZM12.5 13.4999H3.5V2.99991H5.17188C5.0581 3.32104 4.99997 3.65922 5 3.99991V4.49991C5 4.63252 5.05268 4.75969 5.14645 4.85346C5.24021 4.94723 5.36739 4.99991 5.5 4.99991H10.5C10.6326 4.99991 10.7598 4.94723 10.8536 4.85346C10.9473 4.75969 11 4.63252 11 4.49991V3.99991C11 3.65922 10.9419 3.32104 10.8281 2.99991H12.5V13.4999Z" fill="#FAFAFA" />
                </Svg>
              </Pressable>
            </View>
          </View>
          {destError && (
            <Text className="text-[10px] font-inter text-red-300 px-1">{destError}</Text>
          )}
        </View>

        {/* Amount */}
        <View className="gap-2.5 relative z-10">
          <Text
            className="text-sm font-inter text-white"
            style={{ fontWeight: "500" }}
          >
            Amount
          </Text>
          <View className="flex-row items-center px-4 gap-4" style={{ height: 52, borderWidth: 0.5, borderColor: '#FF99BC', borderRadius: 8.5 }}>
            <Pressable
              onPress={toggleCurrency}
              className="flex-row items-center gap-1 px-3 py-1.5 bg-[#FF669A] rounded"
            >
              <Text className="text-sm font-inter text-white font-semibold">
                {currency}
              </Text>
              <Feather name="chevron-down" size={14} color="#FFFFFF" />
            </Pressable>
            <TextInput
              className="flex-1 text-sm font-inter text-white"
              style={{ fontWeight: "500" }}
              placeholder="10.00"
              placeholderTextColor="#FAFAFA"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Currency Dropdown */}
          {showCurrencyDropdown && (
            <View className="absolute top-[75px] left-0 right-0 bg-[#FF669A] rounded-lg border-2 border-[#FF99BC] overflow-hidden shadow-lg z-20">
              <Pressable
                onPress={() => selectCurrency("USD")}
                className="px-4 py-3 border-b border-[#FF99BC] active:bg-[#FF4081]"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white font-inter font-semibold text-base">
                      USD
                    </Text>
                    <Text className="text-white/80 font-inter text-xs mt-0.5">
                      US Dollar
                    </Text>
                  </View>
                  {currency === "USD" && (
                    <Feather name="check-circle" size={18} color="#4DC721" />
                  )}
                </View>
              </Pressable>
              <Pressable
                onPress={() => selectCurrency("EUR")}
                className="px-4 py-3 border-b border-[#FF99BC] active:bg-[#FF4081]"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white font-inter font-semibold text-base">
                      EUR
                    </Text>
                    <Text className="text-white/80 font-inter text-xs mt-0.5">
                      Euro
                    </Text>
                  </View>
                  {currency === "EUR" && (
                    <Feather name="check-circle" size={18} color="#4DC721" />
                  )}
                </View>
              </Pressable>
              <Pressable
                onPress={() => selectCurrency("KES")}
                className="px-4 py-3 border-b border-[#FF99BC] active:bg-[#FF4081]"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white font-inter font-semibold text-base">
                      KES
                    </Text>
                    <Text className="text-white/80 font-inter text-xs mt-0.5">
                      Kenyan Shilling
                    </Text>
                  </View>
                  {currency === "KES" && (
                    <Feather name="check-circle" size={18} color="#4DC721" />
                  )}
                </View>
              </Pressable>
              <Pressable
                onPress={() => selectCurrency("NGN")}
                className="px-4 py-3 active:bg-[#FF4081]"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white font-inter font-semibold text-base">
                      NGN
                    </Text>
                    <Text className="text-white/80 font-inter text-xs mt-0.5">
                      Nigerian Naira
                    </Text>
                  </View>
                  {currency === "NGN" && (
                    <Feather name="check-circle" size={18} color="#4DC721" />
                  )}
                </View>
              </Pressable>
            </View>
          )}

          {/* SATS Conversion Display */}
          {amount && parseFloat(amount) > 0 && (
            <View className="mt-2 px-2">
              <Text className="text-[10px] font-inter font-medium text-[#EFEFEF] leading-[14px]">
                {currency} {amount} ≈ {calculateSatsEquivalent()} SATS
              </Text>
            </View>
          )}
        </View>

        {/* Note */}
        <View className="gap-2.5">
          <Text
            className="text-sm font-inter text-white"
            style={{ fontWeight: "500" }}
          >
            Note
          </Text>
          <View className="flex-row items-center px-4" style={{ height: 52, borderWidth: 0.5, borderColor: '#FF99BC', borderRadius: 8.5 }}>
            <TextInput
              className="flex-1 text-sm font-inter text-[#FAFAFA]"
              style={{ fontWeight: "500" }}
              placeholder="For flowers"
              placeholderTextColor="#FAFAFA"
              value={note}
              onChangeText={setNote}
            />
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View className="flex-1" />
      <View
        className="items-center pb-0"
        style={{ paddingBottom: insets.bottom }}
      >
        <Pressable
          onPress={handleProceed}
          disabled={creating || validating}
          className="w-[250px] py-4 bg-[#FF82AD] rounded-full items-center justify-center active:opacity-80 border-[0.5px] border-[#FF669A] mb-5"
          style={{ opacity: creating || validating ? 0.7 : 1 }}
        >
          <Text className="text-white font-inter font-medium text-[15px]">
            {creating ? "Creating..." : "Create Invoice"}
          </Text>
        </Pressable>
        <View className="w-full h-[34px] bg-[#FF3378] items-center justify-center">
          <View className="w-[134px] h-[5px] bg-[#FF99BC] rounded-full" />
        </View>
      </View>
    </View>
  );
}
